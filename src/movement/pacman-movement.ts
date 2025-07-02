import { GRID_HEIGHT, GRID_WIDTH, PACMAN_POWERUP_DURATION } from '../constants';
import { Point2d, StoreType } from '../types';
import { MovementUtils } from './movement-utils';

const RECENT_POSITIONS_LIMIT = 5;

const movePacman = (store: StoreType) => {
	if (store.pacman.deadRemainingDuration) {
		return;
	}

	const hasPowerup = !!store.pacman.powerupRemainingDuration;
	const scaredGhosts = store.ghosts.filter((ghost) => ghost.scared);

	let targetPosition: Point2d;

	if (hasPowerup && scaredGhosts.length > 0) {
		const ghostPosition = findClosestScaredGhost(store);
		if (ghostPosition) {
			targetPosition = ghostPosition;
		} else {
			targetPosition = findOptimalTarget(store);
		}
	} else if (store.pacman.target) {
		if (store.pacman.target.x == store.pacman.x && store.pacman.target.y == store.pacman.y) {
			targetPosition = findOptimalTarget(store);
			store.pacman.target = { x: targetPosition?.x, y: targetPosition?.y };
		} else {
			targetPosition = store.pacman.target;
		}
	} else {
		targetPosition = findOptimalTarget(store);
		store.pacman.target = { x: targetPosition?.x, y: targetPosition?.y };
	}

	const nextPosition = calculateOptimalPath(store, targetPosition);

	if (nextPosition) {
		updatePacmanPosition(store, nextPosition);
	} else {
		makeDesperationMove(store);
	}

	checkAndEatPoint(store);
};

const findClosestScaredGhost = (store: StoreType) => {
	const scaredGhosts = store.ghosts.filter((ghost) => ghost.scared);

	if (scaredGhosts.length === 0) return null;

	return scaredGhosts.reduce(
		(closest, ghost) => {
			const distance = MovementUtils.calculateDistance(ghost.x, ghost.y, store.pacman.x, store.pacman.y);
			return distance < closest.distance ? { x: ghost.x, y: ghost.y, distance } : closest;
		},
		{ x: store.pacman.x, y: store.pacman.y, distance: Infinity }
	);
};

const findOptimalTarget = (store: StoreType) => {
	let pointCells: { x: number; y: number; value: number }[] = [];

	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			if (store.grid[x][y].intensity > 0) {
				const distance = MovementUtils.calculateDistance(x, y, store.pacman.x, store.pacman.y);
				const value = store.grid[x][y].intensity / (distance + 1);
				pointCells.push({ x, y, value });
			}
		}
	}

	pointCells.sort((a, b) => b.value - a.value);
	return pointCells[0];
};

const calculateOptimalPath = (store: StoreType, target: Point2d) => {
	const queue: { x: number; y: number; path: Point2d[]; score: number }[] = [
		{ x: store.pacman.x, y: store.pacman.y, path: [], score: 0 }
	];
	const visited = new Set<string>();
	visited.add(`${store.pacman.x},${store.pacman.y}`);

	const dangerMap = createDangerMap(store);

	while (queue.length > 0) {
		queue.sort((a, b) => b.score - a.score);
		const current = queue.shift()!;
		const { x, y, path } = current;

		if (x === target.x && y === target.y) {
			return path.length > 0 ? path[0] : null;
		}

		const validMoves = MovementUtils.getValidMoves(x, y);

		for (const [dx, dy] of validMoves) {
			const newX = x + dx;
			const newY = y + dy;
			const key = `${newX},${newY}`;

			if (!visited.has(key)) {
				const newPath = [...path, { x: newX, y: newY }];
				const danger = dangerMap.get(key) || 0;
				const pointValue = store.grid[newX][newY].intensity;
				const distanceToTarget = MovementUtils.calculateDistance(newX, newY, target.x, target.y);

				let revisitPenalty = 0;
				if (store.pacman.recentPositions?.includes(key)) {
					revisitPenalty += 100; // Penalize recently visited positions
				}

				queue.push({
					x: newX,
					y: newY,
					path: newPath,
					score: pointValue - danger - distanceToTarget / 10 - revisitPenalty
				});
				visited.add(key);
			}
		}
	}

	return null;
};

const createDangerMap = (store: StoreType) => {
	const dangerMap = new Map<string, number>();
	const hasPowerup = !!store.pacman.powerupRemainingDuration;

	store.ghosts.forEach((ghost) => {
		if (ghost.scared) return;

		for (let dx = -5; dx <= 5; dx++) {
			for (let dy = -5; dy <= 5; dy++) {
				const x = ghost.x + dx;
				const y = ghost.y + dy;

				if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
					const key = `${x},${y}`;
					const distance = Math.abs(dx) + Math.abs(dy);
					const dangerValue = 15 - distance;

					if (dangerValue > 0) {
						const currentDanger = dangerMap.get(key) || 0;
						dangerMap.set(key, Math.max(currentDanger, dangerValue));
					}
				}
			}
		}
	});

	if (hasPowerup) {
		for (const [key, value] of dangerMap.entries()) {
			dangerMap.set(key, value / 5);
		}
	}

	return dangerMap;
};

const makeDesperationMove = (store: StoreType) => {
	const validMoves = MovementUtils.getValidMoves(store.pacman.x, store.pacman.y);

	if (validMoves.length === 0) return;

	const safestMove = validMoves.reduce(
		(safest, [dx, dy]) => {
			const newX = store.pacman.x + dx;
			const newY = store.pacman.y + dy;

			let minGhostDistance = Infinity;

			store.ghosts.forEach((ghost) => {
				if (!ghost.scared) {
					const distance = MovementUtils.calculateDistance(ghost.x, ghost.y, newX, newY);
					minGhostDistance = Math.min(minGhostDistance, distance);
				}
			});

			return minGhostDistance > safest.distance ? { dx, dy, distance: minGhostDistance } : safest;
		},
		{ dx: 0, dy: 0, distance: -Infinity }
	);

	const newX = store.pacman.x + safestMove.dx;
	const newY = store.pacman.y + safestMove.dy;

	updatePacmanPosition(store, { x: newX, y: newY });
};

const updatePacmanPosition = (store: StoreType, position: Point2d) => {
	store.pacman.recentPositions ||= [];
	store.pacman.recentPositions.push(`${position.x},${position.y}`);
	if (store.pacman.recentPositions.length > RECENT_POSITIONS_LIMIT) {
		store.pacman.recentPositions.shift();
	}

	const dx = position.x - store.pacman.x;
	const dy = position.y - store.pacman.y;

	if (dx > 0) store.pacman.direction = 'right';
	else if (dx < 0) store.pacman.direction = 'left';
	else if (dy > 0) store.pacman.direction = 'down';
	else if (dy < 0) store.pacman.direction = 'up';

	let x = position.x;
	let y = position.y;

	// Tunnel wrapping
	if (x < 0) x = GRID_WIDTH - 1;
	if (x >= GRID_WIDTH) x = 0;

	store.pacman.x = x;
	store.pacman.y = y;
};

const checkAndEatPoint = (store: StoreType) => {
	if (store.grid[store.pacman.x][store.pacman.y].intensity > 0) {
		store.pacman.totalPoints += store.grid[store.pacman.x][store.pacman.y].commitsCount;
		store.pacman.points++;
		store.config.pointsIncreasedCallback(store.pacman.totalPoints);
		store.grid[store.pacman.x][store.pacman.y].intensity = 0;

		if (store.pacman.points >= 10) activatePowerUp(store);
	}
};

const activatePowerUp = (store: StoreType) => {
	store.pacman.powerupRemainingDuration = PACMAN_POWERUP_DURATION;
	store.ghosts.forEach((ghost) => (ghost.scared = true));
};

export const PacmanMovement = {
	movePacman
};
