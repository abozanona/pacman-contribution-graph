import { GRID_HEIGHT, GRID_WIDTH } from '../constants';
import { Ghost, Point2d, StoreType } from '../types';
import { MovementUtils } from './movement-utils';

// Update to check real contribution grid for valid moves
const moveGhosts = (store: StoreType) => {
	store.ghosts.forEach((ghost) => {
		if (ghost.scared || Math.random() < 0.15) {
			moveScaredGhost(ghost, store);
		} else {
			moveGhostWithPersonality(ghost, store);
		}
	});
};

// Update valid move check to use contribution grid
const getValidMoves = (x: number, y: number, store: StoreType) => {
	const moves = [];

	// Right
	if (x < GRID_WIDTH - 1 && store.contributionGrid[y][x + 1] > 0) moves.push([1, 0]);

	// Left
	if (x > 0 && store.contributionGrid[y][x - 1] > 0) moves.push([-1, 0]);

	// Down
	if (y < GRID_HEIGHT - 1 && store.contributionGrid[y + 1][x] > 0) moves.push([0, 1]);

	// Up
	if (y > 0 && store.contributionGrid[y - 1][x] > 0) moves.push([0, -1]);

	return moves;
};

// Update moveScaredGhost to use the new getValidMoves
const moveScaredGhost = (ghost: Ghost, store: StoreType) => {
	if (!ghost.target || (ghost.x === ghost.target.x && ghost.y === ghost.target.y)) {
		ghost.target = getRandomDestination(ghost.x, ghost.y);
	}

	const validMoves = getValidMoves(ghost.x, ghost.y, store);
	if (validMoves.length === 0) return;

	// Move toward target but with some randomness to appear "scared"
	const dx = ghost.target.x - ghost.x;
	const dy = ghost.target.y - ghost.y;

	// Filter moves that generally go toward the target
	let possibleMoves = validMoves.filter((move) => {
		const moveX = move[0];
		const moveY = move[1];
		return (dx > 0 && moveX > 0) || (dx < 0 && moveX < 0) || (dy > 0 && moveY > 0) || (dy < 0 && moveY < 0);
	});

	// If no valid moves toward target, use any valid move
	if (possibleMoves.length === 0) {
		possibleMoves = validMoves;
	}

	// Choose a random move from the possible moves
	const [moveX, moveY] = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

	// If Pacman has power-up, ghosts move slower
	if (store.pacman.powerupRemainingDuration && Math.random() < 0.5) return;

	ghost.x += moveX;
	ghost.y += moveY;
};

// Update BFSTargetLocation to use the new getValidMoves
const BFSTargetLocation = (startX: number, startY: number, targetX: number, targetY: number, store: StoreType): Point2d | null => {
	// If we're already at the target, no need to move
	if (startX === targetX && startY === targetY) return null;

	const queue: { x: number; y: number; path: Point2d[] }[] = [{ x: startX, y: startY, path: [] }];
	const visited = new Set<string>();
	visited.add(`${startX},${startY}`);

	while (queue.length > 0) {
		const current = queue.shift()!;
		const { x, y, path } = current;

		const validMoves = getValidMoves(x, y, store);

		for (const [dx, dy] of validMoves) {
			const newX = x + dx;
			const newY = y + dy;
			const key = `${newX},${newY}`;

			if (visited.has(key)) continue;
			visited.add(key);

			const newPath = [...path, { x: newX, y: newY }];

			if (newX === targetX && newY === targetY) {
				return newPath.length > 0 ? newPath[0] : null;
			}

			queue.push({ x: newX, y: newY, path: newPath });
		}
	}

	// If no path found, no need to move
	return null;
};

// Update moveGhostWithPersonality to pass store to BFS
const moveGhostWithPersonality = (ghost: Ghost, store: StoreType) => {
	const target = calculateGhostTarget(ghost, store);
	ghost.target = target;

	const nextMove = BFSTargetLocation(ghost.x, ghost.y, target.x, target.y, store);
	if (nextMove) {
		ghost.x = nextMove.x;
		ghost.y = nextMove.y;
	}
};

// Calculate ghost target based on personality
const calculateGhostTarget = (ghost: Ghost, store: StoreType): Point2d => {
	const { pacman } = store;
	let pacDirection = [0, 0];
	switch (ghost.name) {
		case 'blinky': // Red ghost - directly targets Pacman
			return { x: pacman.x, y: pacman.y };

		case 'pinky': // Pink ghost - targets 4 spaces ahead of Pacman
			pacDirection = getPacmanDirection(store);

			const lookAhead = 4;
			let fourAhead = {
				x: pacman.x + pacDirection[0] * lookAhead,
				y: pacman.y + pacDirection[1] * lookAhead
			};

			fourAhead.x = Math.min(Math.max(fourAhead.x, 0), GRID_WIDTH - 1);
			fourAhead.y = Math.min(Math.max(fourAhead.y, 0), GRID_HEIGHT - 1);
			return fourAhead;

		case 'inky': // Blue ghost - complex targeting based on Blinky's position
			const blinky = store.ghosts.find((g) => g.name === 'blinky');
			pacDirection = getPacmanDirection(store);

			// Target is 2 spaces ahead of Pacman
			let twoAhead = {
				x: pacman.x + pacDirection[0] * 2,
				y: pacman.y + pacDirection[1] * 2
			};

			// Then double the vector from Blinky to that position
			if (blinky) {
				twoAhead = {
					x: twoAhead.x + (twoAhead.x - blinky.x),
					y: twoAhead.y + (twoAhead.y - blinky.y)
				};
			}
			twoAhead.x = Math.min(Math.max(twoAhead.x, 0), GRID_WIDTH - 1);
			twoAhead.y = Math.min(Math.max(twoAhead.y, 0), GRID_HEIGHT - 1);
			return twoAhead;

		case 'clyde': // Orange ghost - targets Pacman when far, runs away when close
			const distanceToPacman = MovementUtils.calculateDistance(ghost.x, ghost.y, pacman.x, pacman.y);
			if (distanceToPacman > 8) {
				return { x: pacman.x, y: pacman.y };
			} else {
				return { x: 0, y: GRID_HEIGHT - 1 };
			}

		default:
			// Default behavior targets Pacman directly
			return { x: pacman.x, y: pacman.y };
	}
};

const getPacmanDirection = (store: StoreType): [number, number] => {
	switch (store.pacman.direction) {
		case 'right':
			return [1, 0];
		case 'left':
			return [-1, 0];
		case 'up':
			return [0, -1];
		case 'down':
			return [0, 1];
		default:
			return [0, 0];
	}
};

// Get a random destination for scared ghosts
const getRandomDestination = (x: number, y: number) => {
	const maxDistance = 8;
	const randomX = x + Math.floor(Math.random() * (2 * maxDistance + 1)) - maxDistance;
	const randomY = y + Math.floor(Math.random() * (2 * maxDistance + 1)) - maxDistance;	return {
		x: Math.max(0, Math.min(randomX, GRID_WIDTH - 1)),
		y: Math.max(0, Math.min(randomY, GRID_HEIGHT - 1))
	};
};

export const GhostsMovement = {
	moveGhosts
};
