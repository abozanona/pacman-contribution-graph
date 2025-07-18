import { GRID_HEIGHT, GRID_WIDTH, PACMAN_POWERUP_DURATION } from '../core/constants';
import { PlayerStyle, Point2d, StoreType } from '../types';
import { Utils } from '../utils/utils';
import { MovementUtils } from './movement-utils';

const RECENT_POSITIONS_LIMIT = 5;

const movePacman = (store: StoreType) => {
	if (store.pacman.deadRemainingDuration) return;

	const hasPowerup = !!store.pacman.powerupRemainingDuration;
	const scaredGhosts = store.ghosts.filter((ghost) => ghost.scared);

	let targetPosition: Point2d;

	// Find a target position, ensuring it's never undefined
	try {
		if (hasPowerup && scaredGhosts.length > 0) {
			const ghostPosition = findClosestScaredGhost(store);
			targetPosition = ghostPosition ?? findOptimalTarget(store);
		} else if (store.pacman.target) {
			if (store.pacman.x === store.pacman.target.x && store.pacman.y === store.pacman.target.y) {
				targetPosition = findOptimalTarget(store);
				store.pacman.target = targetPosition;
			} else {
				targetPosition = store.pacman.target;
			}
		} else {
			targetPosition = findOptimalTarget(store);
			store.pacman.target = targetPosition;
		}

		// Safety check to ensure targetPosition is never undefined
		if (!targetPosition) {
			targetPosition = { x: store.pacman.x, y: store.pacman.y };
		}

		const nextPosition = calculateOptimalPath(store, targetPosition);
		nextPosition ? updatePacmanPosition(store, nextPosition) : makeDesperationMove(store);

		checkAndEatPoint(store);
	} catch (error) {
		console.error('Error in movePacman:', error);
		// If all else fails, don't move
	}
};

const findClosestScaredGhost = (store: StoreType) => {
	const scaredGhosts = store.ghosts.filter((g) => g.scared);
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
	const pointCells: { x: number; y: number; value: number }[] = [];

	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			const cell = store.grid[x][y];
			if (cell.level !== 'NONE') {
				const distance = MovementUtils.calculateDistance(x, y, store.pacman.x, store.pacman.y);
				const value = cell.commitsCount / (distance + 1);
				pointCells.push({ x, y, value });
			}
		}
	}

	pointCells.sort((a, b) => b.value - a.value);

	// Check if there are any cells with points left
	if (pointCells.length === 0) {
		// Return Pac-Man's current position as fallback
		return { x: store.pacman.x, y: store.pacman.y, value: 0 };
	}

	return pointCells[0];
};

const calculateOptimalPath = (store: StoreType, target: Point2d) => {
	const queue: { x: number; y: number; path: Point2d[]; score: number }[] = [
		{ x: store.pacman.x, y: store.pacman.y, path: [], score: 0 }
	];
	const visited = new Set<string>([`${store.pacman.x},${store.pacman.y}`]);
	const dangerMap = createDangerMap(store);

	const maxDangerValue = 15;

	// Set weights according to player style - more extreme values
	let safetyWeight = 0.5; // standard weight for safety
	let pointWeight = 0.5; // standard weight for points

	switch (store.config.playerStyle) {
		case PlayerStyle.CONSERVATIVE:
			safetyWeight = 3.0; // Much higher values to ensure conservative behavior
			pointWeight = 0.1;
			break;
		case PlayerStyle.AGGRESSIVE:
			safetyWeight = 0.3;
			pointWeight = 2.0;
			break;
		case PlayerStyle.OPPORTUNISTIC:
		default:
			safetyWeight = 0.8;
			pointWeight = 0.8;
			break;
	}

	// Calculate the distance to the nearest ghost
	let closestGhostDistance = Infinity;
	store.ghosts.forEach((ghost) => {
		if (!ghost.scared) {
			const dist = MovementUtils.calculateDistance(store.pacman.x, store.pacman.y, ghost.x, ghost.y);
			closestGhostDistance = Math.min(closestGhostDistance, dist);
		}
	});

	// Narrower danger threshold for conservative
	const dangerThreshold = store.config.playerStyle === PlayerStyle.CONSERVATIVE ? 5 : 7;
	const dangerNearby = closestGhostDistance < dangerThreshold;

	// Adjust weights further if there is danger and it is conservative
	if (store.config.playerStyle === PlayerStyle.CONSERVATIVE && dangerNearby) {
		safetyWeight *= 5; // Dramatically increase the safety weight in dangerous situations
	}

	while (queue.length > 0) {
		queue.sort((a, b) => b.score - a.score);
		const current = queue.shift()!;
		const { x, y, path } = current;

		if (x === target.x && y === target.y) {
			// Upon arrival at the destination, analyze the behavior
			if (path.length > 0) {
				let totalSafetyScore = 0;
				let totalPointScore = 0;

				path.forEach((point) => {
					const key = `${point.x},${point.y}`;
					const danger = dangerMap.get(key) || 0;
					const points = store.grid[point.x][point.y].commitsCount;

					totalSafetyScore -= danger * safetyWeight;
					totalPointScore += points * pointWeight;
				});

				return path[0];
			}
			return null;
		}

		for (const [dx, dy] of MovementUtils.getValidMoves(x, y)) {
			const newX = x + dx;
			const newY = y + dy;
			const key = `${newX},${newY}`;

			if (!visited.has(key)) {
				const newPath = [...path, { x: newX, y: newY }];
				const danger = dangerMap.get(key) || 0;
				const pointValue = store.grid[newX][newY].commitsCount;
				const distanceToTarget = MovementUtils.calculateDistance(newX, newY, target.x, target.y);
				const revisitPenalty = store.pacman.recentPositions?.includes(key) ? 100 : 0;

				let safetyScore, pointScore, finalScore;

				// Completely inverted punctuation logic for conservative style
				if (store.config.playerStyle === PlayerStyle.CONSERVATIVE) {
					// For conservative: danger is MUCH more important than points
					safetyScore = (maxDangerValue - danger) * safetyWeight;

					// Severe penalties for dangerous cells
					if (danger >= 5) {
						safetyScore -= 100; // Severe penalty for dangerous cells
					} else {
						// Bonus for safe cells
						safetyScore += 50;
					}

					pointScore = pointValue * pointWeight;
					const distanceScore = -distanceToTarget / 10;

					// Score components are different for conservative
					finalScore = safetyScore * 5 + pointScore + distanceScore - revisitPenalty;
				} else {
					// Default logic for other styles
					safetyScore = (maxDangerValue - danger) * safetyWeight;
					pointScore = pointValue * pointWeight;
					const distanceScore = -distanceToTarget / 10;

					finalScore = safetyScore + pointScore + distanceScore - revisitPenalty;
				}
				queue.push({
					x: newX,
					y: newY,
					path: newPath,
					score: finalScore
				});

				visited.add(key);
			}
		}
	}

	return null;
};

const createDangerMap = (store: StoreType) => {
	const map = new Map<string, number>();
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
					const value = 15 - distance;

					if (value > 0) {
						const current = map.get(key) || 0;
						map.set(key, Math.max(current, value));
					}
				}
			}
		}
	});

	if (hasPowerup) {
		for (const [key, value] of map.entries()) {
			map.set(key, value / 5);
		}
	}

	return map;
};

const makeDesperationMove = (store: StoreType) => {
	const validMoves = MovementUtils.getValidMoves(store.pacman.x, store.pacman.y);
	if (validMoves.length === 0) return;

	const safest = validMoves.reduce(
		(best, [dx, dy]) => {
			const newX = store.pacman.x + dx;
			const newY = store.pacman.y + dy;
			let minDist = Infinity;

			store.ghosts.forEach((ghost) => {
				if (!ghost.scared) {
					const dist = MovementUtils.calculateDistance(ghost.x, ghost.y, newX, newY);
					minDist = Math.min(minDist, dist);
				}
			});

			return minDist > best.distance ? { dx, dy, distance: minDist } : best;
		},
		{ dx: 0, dy: 0, distance: -Infinity }
	);

	updatePacmanPosition(store, {
		x: store.pacman.x + safest.dx,
		y: store.pacman.y + safest.dy
	});
};

const updatePacmanPosition = (store: StoreType, position: Point2d) => {
	store.pacman.recentPositions ||= [];
	store.pacman.recentPositions.push(`${position.x},${position.y}`);
	if (store.pacman.recentPositions.length > RECENT_POSITIONS_LIMIT) {
		store.pacman.recentPositions.shift();
	}

	const dx = position.x - store.pacman.x;
	const dy = position.y - store.pacman.y;

	store.pacman.direction = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : dy < 0 ? 'up' : store.pacman.direction;

	let x = position.x;
	let y = position.y;

	// Tunnel wrapping
	if (x < 0) x = GRID_WIDTH - 1;
	if (x >= GRID_WIDTH) x = 0;

	store.pacman.x = x;
	store.pacman.y = y;
};

const checkAndEatPoint = (store: StoreType) => {
	const cell = store.grid[store.pacman.x][store.pacman.y];
	if (cell.level !== 'NONE') {
		store.pacman.totalPoints += cell.commitsCount;
		store.pacman.points++;
		store.config.pointsIncreasedCallback(store.pacman.totalPoints);

		const theme = Utils.getCurrentTheme(store);
		// Power-up activated in the cell
		if (cell.level === 'FOURTH_QUARTILE') {
			activatePowerUp(store);
		}

		// "Delete" point from cell
		cell.level = 'NONE';
		cell.color = theme.intensityColors[0];
		cell.commitsCount = 0;
	}
};

const activatePowerUp = (store: StoreType) => {
	store.pacman.powerupRemainingDuration = PACMAN_POWERUP_DURATION;
	store.ghosts.forEach((ghost) => {
		ghost.scared = true;
		// Reverse direction
		if (ghost.direction) {
			if (ghost.direction === 'left') ghost.direction = 'right';
			else if (ghost.direction === 'right') ghost.direction = 'left';
			else if (ghost.direction === 'up') ghost.direction = 'down';
			else if (ghost.direction === 'down') ghost.direction = 'up';
		}
	});
};

export const PacmanMovement = {
	movePacman
};
