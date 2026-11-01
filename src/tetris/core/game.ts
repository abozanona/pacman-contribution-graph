import { Utils } from '../../shared/utils/utils';
import { Renderer } from '../renderers/svg';
import { Position, TetrisCell, TetrisStore } from '../types';
import {
	GRID_HEIGHT,
	GRID_WIDTH,
	TETRIS_CLEAR_FLASH_FRAMES,
	TETRIS_END_HOLD_FRAMES,
	TETRIS_FADE_FRAMES,
	TETRIS_LEVEL_POINTS,
	TETRIS_LINE_LENGTH,
	TETRIS_MAX_IDLE_PIECES,
	TETRIS_MAX_PIECES
} from './constants';
import { createRandom, PIECES } from './pieces';

interface Placement {
	/** Squares that ended up on the board. */
	cells: Position[];
	/** Squares that came to rest above the top edge; they are discarded. */
	lost: number;
	/** Filled squares the piece came to rest on; lines through them are checked too. */
	supports: Position[];
	pieceColor: number;
	/** How many times the piece is rotated from its spawn orientation (0-3). */
	rotation: number;
	offsetX: number;
	score: number;
}

type Board = TetrisCell[][];

/** What the AI is trying to clear: contributions first, then any piece squares left hanging over a gap. */
type Target = 'contribution' | 'hanging';

const isFilled = (cell: TetrisCell) => cell.kind === 'contribution' || cell.kind === 'piece';

const cloneBoard = (board: Board): Board => board.map((column) => column.map((cell) => ({ ...cell })));

const pushSnapshot = (store: TetrisStore, board: Board = store.board) => {
	store.snapshots.push({ cells: cloneBoard(board) });
	store.frameCount = store.snapshots.length - 1;
};

const resetGameState = (store: TetrisStore) => {
	store.frameCount = 0;
	store.score = 0;
	store.piecesPlaced = 0;
	store.linesCleared = 0;
	store.snapshots = [];
	store.board = Array.from({ length: GRID_WIDTH }, (_, x) =>
		Array.from({ length: GRID_HEIGHT }, (_, y): TetrisCell => {
			const cell = store.grid[x]?.[y];
			return cell && cell.commitsCount > 0 ? { kind: 'contribution', level: cell.level } : { kind: 'empty' };
		})
	);
	store.contributionsLeft = countContributions(store.board);
	pushSnapshot(store);
};

/** A piece square with an empty cell underneath it is left hanging above the ground. */
const isHanging = (board: Board, x: number, y: number) =>
	board[x][y].kind === 'piece' && y < GRID_HEIGHT - 1 && board[x][y + 1].kind === 'empty';

const countHanging = (board: Board) => board.reduce((sum, column, x) => sum + column.filter((_, y) => isHanging(board, x, y)).length, 0);

const hasHangingSquares = (board: Board) => countHanging(board) > 0;

const isTarget = (board: Board, target: Target, x: number, y: number) =>
	target === 'contribution' ? board[x][y].kind === 'contribution' : isHanging(board, x, y);

const countContributions = (board: Board) => board.reduce((sum, column) => sum + column.filter((c) => c.kind === 'contribution').length, 0);

/**
 * Where a piece dropped straight down at `offsetX` comes to rest. Squares left above the top edge are
 * dropped (the board is only 7 rows tall and often full at the top), but a piece always touches something.
 */
const dropPiece = (board: Board, shape: Position[], offsetX: number): Pick<Placement, 'cells' | 'lost' | 'supports'> | null => {
	const fits = (offsetY: number) =>
		shape.every(({ x, y }) => {
			const cx = x + offsetX;
			const cy = y + offsetY;
			if (cx < 0 || cx >= GRID_WIDTH || cy >= GRID_HEIGHT) return false;
			return cy < 0 || board[cx][cy].kind === 'empty';
		});

	const height = Math.max(...shape.map((c) => c.y)) + 1;
	let offsetY = -height;
	if (!fits(offsetY)) return null;
	while (fits(offsetY + 1)) offsetY++;

	const landed = shape.map(({ x, y }) => ({ x: x + offsetX, y: y + offsetY }));
	const isPiece = (x: number, y: number) => landed.some((c) => c.x === x && c.y === y);
	const supports = landed
		.map((c) => ({ x: c.x, y: c.y + 1 }))
		.filter((c) => c.y >= 0 && c.y < GRID_HEIGHT && !isPiece(c.x, c.y) && isFilled(board[c.x][c.y]));
	const cells = landed.filter((c) => c.y >= 0);
	return { cells, lost: landed.length - cells.length, supports };
};

/** Every square in a horizontal line of 5+ filled squares that passes through one of `origins`. */
const findLines = (board: Board, origins: Position[]): Position[] => {
	const found = new Map<string, Position>();
	for (const { x, y } of origins) {
		let from = x;
		let to = x;
		while (from > 0 && isFilled(board[from - 1][y])) from--;
		while (to < GRID_WIDTH - 1 && isFilled(board[to + 1][y])) to++;
		if (to - from + 1 < TETRIS_LINE_LENGTH) continue;
		for (let lineX = from; lineX <= to; lineX++) found.set(`${lineX}:${y}`, { x: lineX, y });
	}
	return [...found.values()];
};

/** An empty square is a dead hole once something sits above it: falling pieces can never reach it. */
const isCovered = (board: Board, x: number, y: number) => {
	for (let above = y - 1; above >= 0; above--) {
		if (board[x][above].kind !== 'empty') return true;
	}
	return false;
};

/**
 * How many more squares must be dropped before the contribution at (cx, cy) can be part of a line.
 * Every empty square in the line also needs support underneath it.
 */
const lineCost = (board: Board, cx: number, cy: number): number => {
	let best = Infinity;

	for (let start = cx - TETRIS_LINE_LENGTH + 1; start <= cx; start++) {
		if (start < 0 || start + TETRIS_LINE_LENGTH > GRID_WIDTH) continue;
		let cost = 0;
		for (let x = start; x < start + TETRIS_LINE_LENGTH && cost < best; x++) {
			if (isFilled(board[x][cy])) continue;
			if (isCovered(board, x, cy)) {
				cost = Infinity;
				break;
			}
			cost++;
			for (let below = cy + 1; below < GRID_HEIGHT && board[x][below].kind === 'empty'; below++) cost++;
		}
		best = Math.min(best, cost);
	}

	return best;
};

/** Sum of target-square costs in the columns a placement can influence (unreachable ones count as a flat penalty). */
const localCost = (board: Board, target: Target, fromX: number, toX: number) => {
	let total = 0;
	for (let x = Math.max(0, fromX); x <= Math.min(GRID_WIDTH - 1, toX); x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			if (!isTarget(board, target, x, y)) continue;
			const cost = lineCost(board, x, y);
			total += Number.isFinite(cost) ? cost : 40;
		}
	}
	return total;
};

const evaluatePlacement = (
	board: Board,
	target: Target,
	{ cells, lost, supports }: Pick<Placement, 'cells' | 'lost' | 'supports'>
): number => {
	const columns = [...cells, ...supports].map((c) => c.x);
	const minX = Math.min(...columns);
	const maxX = Math.max(...columns);
	const reach = TETRIS_LINE_LENGTH;
	const before = localCost(board, target, minX - reach, maxX + reach);

	const after = cloneBoard(board);
	for (const c of cells) after[c.x][c.y] = { kind: 'piece', pieceColor: 0 };
	const cleared = findLines(after, [...cells, ...supports]);
	const clearedTargets = cleared.filter((c) => isTarget(after, target, c.x, c.y)).length;
	for (const c of cleared) after[c.x][c.y] = { kind: 'empty' };

	let newHoles = 0;
	for (const c of cells) {
		if (after[c.x][c.y].kind === 'empty') continue;
		for (let y = c.y + 1; y < GRID_HEIGHT && after[c.x][y].kind === 'empty'; y++) newHoles++;
	}

	const improvement = before - localCost(after, target, minX - reach, maxX + reach);
	const height = cells.length > 0 ? GRID_HEIGHT - Math.min(...cells.map((c) => c.y)) : GRID_HEIGHT;

	return clearedTargets * 1000 + cleared.length * 15 + improvement * 25 - newHoles * 30 - lost * 5 - height;
};

const findBestPlacement = (board: Board, target: Target, pieceIndex: number): Placement | null => {
	let best: Placement | null = null;
	// PIECES lists each orientation in the order it is reached by rotating, so the index is the number of
	// rotations needed. Every piece has at most 4 orientations, so all are reachable within 3 rotations.
	PIECES[pieceIndex].forEach((shape, rotation) => {
		for (let offsetX = 0; offsetX < GRID_WIDTH; offsetX++) {
			const landing = dropPiece(board, shape, offsetX);
			if (!landing) continue;
			// Among equally good moves, the one needing fewer rotations wins.
			const score = evaluatePlacement(board, target, landing) - rotation * 0.5;
			if (!best || score > best.score) best = { ...landing, pieceColor: pieceIndex, rotation, offsetX, score };
		}
	});
	return best;
};

/**
 * The piece falls one row per frame and rotates at most once per frame on the way down, so every rotation is
 * visible. Squares are only drawn over empty cells so the piece never hides what it passes.
 */
const animateFall = (store: TetrisStore, placement: Placement) => {
	if (placement.cells.length === 0) return;
	const orientations = PIECES[placement.pieceColor];
	const landedBottom = Math.max(...placement.cells.map((c) => c.y));
	const fallFrames = landedBottom;
	const totalFrames = Math.max(fallFrames, placement.rotation);

	for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
		// When the drop is too short for all rotations, the piece waits at the top until it has turned.
		const shift = Math.min(fallFrames, totalFrames - frameIndex);
		const shape = orientations[Math.min(frameIndex, placement.rotation)];
		const shapeBottom = Math.max(...shape.map((c) => c.y));
		const frame = cloneBoard(store.board);
		for (const c of shape) {
			const x = c.x + placement.offsetX;
			const y = c.y - shapeBottom + landedBottom - shift;
			if (x < GRID_WIDTH && y >= 0 && frame[x][y].kind === 'empty') {
				frame[x][y] = { kind: 'falling', pieceColor: placement.pieceColor };
			}
		}
		pushSnapshot(store, frame);
	}
};

/** Flash the cleared squares, then remove them. */
const clearLines = (store: TetrisStore, cleared: Position[]) => {
	for (let flash = 0; flash < TETRIS_CLEAR_FLASH_FRAMES; flash++) {
		for (const c of cleared) store.board[c.x][c.y] = { ...store.board[c.x][c.y], kind: 'clearing', flash };
		pushSnapshot(store);
	}

	let clearedContributions = 0;
	for (const c of cleared) {
		const level = store.board[c.x][c.y].level;
		if (level) {
			clearedContributions++;
			store.score += TETRIS_LEVEL_POINTS[Utils.levelToIndex(level)] ?? 10;
		} else {
			store.score += 1;
		}
		store.board[c.x][c.y] = { kind: 'empty' };
	}
	store.linesCleared++;
	store.contributionsLeft -= clearedContributions;
	store.config.pointsIncreasedCallback(store.score);
	pushSnapshot(store);
};

/**
 * Piece squares left hanging after a clear drop one row per frame until they rest on something.
 * Contributions never move. Returns where the moved squares ended up.
 */
const settlePieces = (store: TetrisStore): Position[] => {
	const moved = new Map<string, Position>();
	let anyMoved = true;
	while (anyMoved) {
		anyMoved = false;
		for (let y = GRID_HEIGHT - 2; y >= 0; y--) {
			for (let x = 0; x < GRID_WIDTH; x++) {
				if (store.board[x][y].kind !== 'piece' || store.board[x][y + 1].kind !== 'empty') continue;
				store.board[x][y + 1] = store.board[x][y];
				store.board[x][y] = { kind: 'empty' };
				moved.delete(`${x}:${y}`);
				moved.set(`${x}:${y + 1}`, { x, y: y + 1 });
				anyMoved = true;
			}
		}
		if (anyMoved) pushSnapshot(store);
	}
	return [...moved.values()];
};

/** Drops the piece and resolves every clear it causes. Returns how many squares were cleared. */
const placePiece = (store: TetrisStore, placement: Placement): number => {
	animateFall(store, placement);
	for (const c of placement.cells) store.board[c.x][c.y] = { kind: 'piece', pieceColor: placement.pieceColor };
	pushSnapshot(store);
	store.piecesPlaced++;

	let clearedSquares = 0;
	let cleared = findLines(store.board, [...placement.cells, ...placement.supports]);
	// Chain reaction: squares settling after a clear can complete new lines.
	while (cleared.length > 0) {
		clearedSquares += cleared.length;
		clearLines(store, cleared);
		cleared = findLines(store.board, settlePieces(store));
	}
	return clearedSquares;
};

/** Leftover piece squares slowly fade into the empty board once the game is over. */
const fadeOutLeftovers = (store: TetrisStore) => {
	const leftovers: Position[] = [];
	store.board.forEach((column, x) => column.forEach((cell, y) => cell.kind === 'piece' && leftovers.push({ x, y })));
	if (leftovers.length === 0) return;

	for (let step = 1; step <= TETRIS_FADE_FRAMES; step++) {
		for (const { x, y } of leftovers)
			store.board[x][y] = { ...store.board[x][y], kind: 'fading', fade: step / (TETRIS_FADE_FRAMES + 1) };
		pushSnapshot(store);
	}
	for (const { x, y } of leftovers) store.board[x][y] = { kind: 'empty' };
	pushSnapshot(store);
};

const startGame = async (store: TetrisStore) => {
	resetGameState(store);

	const random = createRandom(store.contributions.reduce((sum, c) => sum + c.count, store.contributionsLeft));
	let idlePieces = 0;

	// The game is won once every contribution is cleared and nothing is left hanging over a gap.
	const isWon = () => store.contributionsLeft === 0 && !hasHangingSquares(store.board);
	while (!isWon() && store.piecesPlaced < TETRIS_MAX_PIECES && idlePieces < TETRIS_MAX_IDLE_PIECES) {
		const target: Target = store.contributionsLeft > 0 ? 'contribution' : 'hanging';
		const placement = findBestPlacement(store.board, target, Math.floor(random() * PIECES.length));
		if (!placement) break;
		const before = target === 'contribution' ? store.contributionsLeft : countHanging(store.board);
		placePiece(store, placement);
		const after = target === 'contribution' ? store.contributionsLeft : countHanging(store.board);
		idlePieces = after < before ? 0 : idlePieces + 1;
	}

	fadeOutLeftovers(store);
	for (let i = 0; i < TETRIS_END_HOLD_FRAMES; i++) pushSnapshot(store);

	const svg = Renderer.generateAnimatedSVG(store);
	store.config.svgCallback(svg);

	if (store.config.gameStatsCallback) {
		store.config.gameStatsCallback({
			totalScore: store.score,
			steps: store.frameCount,
			ghostsEaten: store.linesCleared
		});
	}

	store.config.gameOverCallback();
};

const stopGame = async (store: TetrisStore) => {
	clearInterval(store.gameInterval as number);
};

export const Game = {
	startGame,
	stopGame
};
