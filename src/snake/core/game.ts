import { Utils } from '../../shared/utils/utils';
import { Renderer } from '../renderers/svg';
import { Position, SnakeCellState, SnakeStore } from '../types';
import {
	blockedCells,
	canReachTail,
	distanceBetween,
	findNearest,
	getNeighbors,
	keyOf,
	reachableArea,
	samePosition,
	simulateWalk
} from './ai';
import {
	GRID_HEIGHT,
	GRID_WIDTH,
	SNAKE_BITE_FRAMES,
	SNAKE_END_HOLD_FRAMES,
	SNAKE_INITIAL_LENGTH,
	SNAKE_LEVEL_POINTS,
	SNAKE_MAX_IDLE_STEPS,
	SNAKE_MAX_STEPS,
	SNAKE_SHED_FRAMES
} from './constants';

type Effect = { state: SnakeCellState; untilFrame: number };

const effects = new WeakMap<SnakeStore, Map<number, Effect>>();

const hasFood = (store: SnakeStore, p: Position) => store.cells[p.x][p.y] === 'food';

const levelIndex = (store: SnakeStore, p: Position) => Utils.levelToIndex(store.grid[p.x][p.y].level);

const resetGameState = (store: SnakeStore) => {
	store.frameCount = 0;
	store.score = 0;
	store.bites = 0;
	store.pendingGrowth = 0;
	store.meals = [];
	store.activeMeals = {};
	store.snapshots = [];
	effects.set(store, new Map());

	store.cells = Array.from({ length: GRID_WIDTH }, (_, x) =>
		Array.from({ length: GRID_HEIGHT }, (_, y) => ((store.grid[x]?.[y]?.commitsCount ?? 0) > 0 ? 'food' : 'empty'))
	);

	// The snake slithers in from the left edge, in the middle row (Wednesday).
	const row = Math.floor(GRID_HEIGHT / 2);
	store.body = Array.from({ length: SNAKE_INITIAL_LENGTH }, (_, i) => ({ x: SNAKE_INITIAL_LENGTH - 1 - i, y: row }));
	for (const segment of store.body) store.cells[segment.x][segment.y] = 'empty';

	pushSnapshot(store);
};

const isGrowing = (store: SnakeStore) =>
	store.pendingGrowth > 0 ||
	Object.entries(store.activeMeals).some(
		([mealIndex, bodyIndex]) => store.meals[+mealIndex].grows && bodyIndex + 2 >= store.body.length - 1
	);

const buildCellStates = (store: SnakeStore): SnakeCellState[][] => {
	const cells = store.cells.map((column) => [...column]);
	const activeEffects = effects.get(store) as Map<number, Effect>;
	for (const [key, effect] of activeEffects) {
		if (effect.untilFrame < store.snapshots.length) {
			activeEffects.delete(key);
			continue;
		}
		if (effect.state === 'shed') cells[key % GRID_WIDTH][Math.floor(key / GRID_WIDTH)] = 'shed';
	}
	for (const segment of store.body) cells[segment.x][segment.y] = 'body';
	for (const [key, effect] of activeEffects) {
		if (effect.state === 'bite') cells[key % GRID_WIDTH][Math.floor(key / GRID_WIDTH)] = 'bite';
	}
	return cells;
};

const pushSnapshot = (store: SnakeStore) => {
	store.snapshots.push({
		body: store.body.map((p) => ({ ...p })),
		cells: buildCellStates(store),
		score: store.score,
		meals: { ...store.activeMeals }
	});
	store.frameCount = store.snapshots.length - 1;
};

/** Meals travel two body segments per frame, so the bulge visibly slides one cell per frame towards the tail. */
const digest = (store: SnakeStore) => {
	for (const [mealIndex, bodyIndex] of Object.entries(store.activeMeals)) {
		const next = bodyIndex + 2;
		if (next >= store.body.length) {
			if (store.meals[+mealIndex].grows) store.pendingGrowth++;
			delete store.activeMeals[+mealIndex];
		} else {
			store.activeMeals[+mealIndex] = next;
		}
	}
};

const moveTo = (store: SnakeStore, target: Position) => {
	digest(store);

	const biteIndex = store.body.findIndex((segment, i) => i > 0 && samePosition(segment, target));
	if (biteIndex > 0 && !(biteIndex === store.body.length - 1 && store.pendingGrowth === 0)) {
		biteSelf(store, biteIndex);
		return;
	}

	store.body.unshift({ ...target });
	if (store.pendingGrowth > 0) {
		store.pendingGrowth--;
	} else {
		store.body.pop();
	}

	if (hasFood(store, target)) {
		const level = levelIndex(store, target);
		store.score += SNAKE_LEVEL_POINTS[level] ?? 1;
		store.meals.push({
			frameIndex: store.snapshots.length,
			x: target.x,
			y: target.y,
			color: store.grid[target.x][target.y].color,
			level: store.grid[target.x][target.y].level,
			grows: level === SNAKE_LEVEL_POINTS.length - 1
		});
		store.activeMeals[store.meals.length - 1] = 0;
		store.cells[target.x][target.y] = 'empty';
		store.config.pointsIncreasedCallback(store.score);
	}
};

/** Cornered: the snake bites itself, flashes red and sheds everything behind the bite. */
const biteSelf = (store: SnakeStore, biteIndex: number) => {
	const activeEffects = effects.get(store) as Map<number, Effect>;
	const frame = store.snapshots.length;
	const target = store.body[biteIndex];
	const shed = store.body.slice(biteIndex + 1);

	store.body = [{ ...target }, ...store.body.slice(0, biteIndex)];
	store.pendingGrowth = 0;
	store.bites++;

	activeEffects.set(keyOf(target), { state: 'bite', untilFrame: frame + SNAKE_BITE_FRAMES });
	for (const segment of shed) {
		activeEffects.set(keyOf(segment), { state: 'shed', untilFrame: frame + SNAKE_SHED_FRAMES });
	}
	for (const [mealIndex, bodyIndex] of Object.entries(store.activeMeals)) {
		if (bodyIndex >= store.body.length) delete store.activeMeals[+mealIndex];
	}
};

const pickFoodPath = (store: SnakeStore, requireSafe: boolean): Position[] | null => {
	const head = store.body[0];
	const paths = findNearest(head, blockedCells(store.body, isGrowing(store)), (p) => hasFood(store, p));
	// Among equally close meals, the darkest (juiciest) one wins.
	paths.sort((a, b) => levelIndex(store, b[b.length - 1]) - levelIndex(store, a[a.length - 1]));

	for (const path of paths) {
		if (!requireSafe) return path;
		if (canReachTail(simulateWalk(store.body, path, store.pendingGrowth))) return path;
	}
	return null;
};

/** No safe meal in sight: wander while keeping the tail in reach, taking the longest way round. */
const pickWanderMove = (store: SnakeStore): Position | null => {
	const growing = isGrowing(store);
	const blocked = blockedCells(store.body, growing);
	const candidates = getNeighbors(store.body[0]).filter((p) => !blocked.has(keyOf(p)));

	let best: Position | null = null;
	let bestScore = -Infinity;
	for (const candidate of candidates) {
		const nextBody = simulateWalk(store.body, [candidate], growing ? 1 : 0);
		const tail = nextBody[nextBody.length - 1];
		const safe = canReachTail(nextBody);
		const distance = distanceBetween(candidate, tail, blockedCells(nextBody, false));
		const area = reachableArea(candidate, blockedCells(nextBody, false));
		const score = (safe ? 10000 : 0) + area * 10 + distance;
		if (score > bestScore) {
			bestScore = score;
			best = candidate;
		}
	}
	return best;
};

const pickBiteTarget = (store: SnakeStore): Position => {
	const head = store.body[0];
	const options = getNeighbors(head)
		.map((p) => ({ p, index: store.body.findIndex((segment) => samePosition(segment, p)) }))
		.filter((o) => o.index > 0)
		.sort((a, b) => b.index - a.index);
	return options[0].p;
};

const remainingFood = (store: SnakeStore) => store.cells.reduce((sum, column) => sum + column.filter((c) => c === 'food').length, 0);

const playSingleTurn = (store: SnakeStore, idleSteps: number): boolean => {
	const hungry = idleSteps > SNAKE_MAX_IDLE_STEPS;
	const path = pickFoodPath(store, true) ?? (hungry ? pickFoodPath(store, false) : null);
	const next = path?.[0] ?? pickWanderMove(store) ?? pickBiteTarget(store);
	const foodBefore = remainingFood(store);
	moveTo(store, next);
	pushSnapshot(store);
	return remainingFood(store) < foodBefore;
};

const appendEndHoldFrames = (store: SnakeStore) => {
	for (let i = 0; i < SNAKE_END_HOLD_FRAMES; i++) {
		digest(store);
		if (store.pendingGrowth > 0) {
			store.body.push({ ...store.body[store.body.length - 1] });
			store.pendingGrowth--;
		}
		pushSnapshot(store);
	}
};

const startGame = async (store: SnakeStore) => {
	resetGameState(store);

	const maxSteps = store.config.maxFrames ? Math.min(store.config.maxFrames, SNAKE_MAX_STEPS) : SNAKE_MAX_STEPS;
	let idleSteps = 0;
	let steps = 0;
	while (remainingFood(store) > 0 && steps < maxSteps) {
		idleSteps = playSingleTurn(store, idleSteps) ? 0 : idleSteps + 1;
		steps++;
	}

	appendEndHoldFrames(store);

	const svg = Renderer.generateAnimatedSVG(store);
	store.config.svgCallback(svg);

	if (store.config.gameStatsCallback) {
		store.config.gameStatsCallback({
			totalScore: store.score,
			steps: store.frameCount,
			ghostsEaten: store.bites
		});
	}

	store.config.gameOverCallback();
};

const stopGame = async (store: SnakeStore) => {
	clearInterval(store.gameInterval as number);
};

export const Game = {
	startGame,
	stopGame
};
