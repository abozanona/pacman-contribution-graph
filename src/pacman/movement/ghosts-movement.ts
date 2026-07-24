import { GRID_HEIGHT, GRID_WIDTH } from '../core/constants';
import { Ghost, Point2d, StoreType } from '../types';
import { MovementUtils } from './movement-utils';

// Constants for ghost behavior
const SCATTER_MODE_DURATION = 7; // Duration of "scatter" mode in seconds (frames)
const CHASE_MODE_DURATION = 20; // Duration of "chase" mode in seconds (frames)
const SCATTER_CORNERS: Record<string, Point2d> = {
	blinky: { x: GRID_WIDTH - 3, y: 0 }, // Top right corner
	pinky: { x: 0, y: 0 }, // Top left corner
	inky: { x: GRID_WIDTH - 3, y: GRID_HEIGHT - 1 }, // Bottom right corner
	clyde: { x: 0, y: GRID_HEIGHT - 1 } // Bottom left corner
};

// Global status of game modes
let currentMode = 'scatter';
let modeTimer = 0;
let dotsRemaining = 0;

const resetGameMode = () => {
	currentMode = 'scatter';
	modeTimer = 0;
	dotsRemaining = 0;
};

const moveGhosts = (store: StoreType) => {
	// Calculate the total number of points remaining to define the behavior
	dotsRemaining = countRemainingDots(store);

	// Update game mode (scatter or chase)
	updateGameMode(store);

	for (const ghost of store.ghosts) {
		// Special logic for ghosts inside the house
		if (ghost.inHouse) {
			moveGhostInHouse(ghost, store);
			continue;
		}

		if (ghost.name === 'eyes') {
			ghost.scared = false;
		}

		// Main movement logic
		if (ghost.scared) {
			moveScaredGhost(ghost, store);
		} else if (ghost.name === 'eyes') {
			moveEyesToHome(ghost, store);
		} else {
			// Choose behavior based on current mode
			if (currentMode === 'scatter') {
				moveGhostToScatterTarget(ghost, store);
			} else {
				moveGhostWithPersonality(ghost, store);
			}
		}
	}
};

// Function to count remaining points on the grid
const countRemainingDots = (store: StoreType): number => {
	let count = 0;
	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			if (store.grid[x][y].level !== 'NONE') {
				count++;
			}
		}
	}
	return count;
};

// Updates game mode between "scatter" and "chase"
const updateGameMode = (store: StoreType) => {
	// If Pac-Man is powered up, do not change the mode
	if (store.pacman.powerupRemainingDuration > 0) return;

	// Increment the current mode timer
	modeTimer++;

	// Check if it's time to change mode
	const modeDuration = currentMode === 'scatter' ? SCATTER_MODE_DURATION : CHASE_MODE_DURATION;

	if (modeTimer >= modeDuration * (1000 / 200)) {
		// Converting to frames (assuming 200ms per frame)
		// Switch between scatter and chase
		currentMode = currentMode === 'scatter' ? 'chase' : 'scatter';
		modeTimer = 0;

		// Reverse ghost direction when changing mode
		store.ghosts.forEach((ghost) => {
			if (!ghost.inHouse && ghost.name !== 'eyes' && !ghost.scared) {
				reverseDirection(ghost);
			}
		});
	}
};

// Function to reverse the direction of a ghost
const reverseDirection = (ghost: Ghost) => {
	switch (ghost.direction) {
		case 'up':
			ghost.direction = 'down';
			break;
		case 'down':
			ghost.direction = 'up';
			break;
		case 'left':
			ghost.direction = 'right';
			break;
		case 'right':
			ghost.direction = 'left';
			break;
	}
};

const moveGhostInHouse = (ghost: Ghost, store: StoreType) => {
	// If the ghost is being released, allow it to leave the house.
	if (ghost.justReleasedFromHouse) {
		// The ghost can only leave through the door, which is at position x=26
		if (ghost.x === 26) {
			ghost.y = 2; // Door position
			ghost.direction = 'up';
			ghost.inHouse = false;
			ghost.justReleasedFromHouse = false;
		} else {
			// If not in the door position, move towards it.
			if (ghost.x < 26) {
				ghost.x += 1;
				ghost.direction = 'right';
			} else if (ghost.x > 26) {
				ghost.x -= 1;
				ghost.direction = 'left';
			}
		}
		return;
	}

	// If the ghost is in the process of respawn, just decrement the counter
	if (ghost.respawnCounter && ghost.respawnCounter > 0) {
		ghost.respawnCounter--;
		// When the counter reaches zero, restore the ghost
		if (ghost.respawnCounter === 0) {
			if (ghost.originalName) {
				ghost.name = ghost.originalName;
				ghost.inHouse = false;
				ghost.scared = store.pacman.powerupRemainingDuration > 0;
			}
		}
		return;
	}

	// Vertical movement inside the house
	const topWall = 3; // The position y=2 is where the door is
	const bottomWall = 4;

	// If it is going up and hits the upper limit
	if (ghost.direction === 'up' && ghost.y <= topWall) {
		ghost.direction = 'down';
		ghost.y = topWall; // Make sure it doesn't go over the wall
	}
	// If it is going down and hits the lower limit
	else if (ghost.direction === 'down' && ghost.y >= bottomWall - 1) {
		ghost.direction = 'up';
		ghost.y = bottomWall - 1; // Make sure it doesn't go over the wall
	}

	// Apply movement in the current direction (discrete movement instead of fractional)
	if (ghost.direction === 'up') {
		ghost.y -= 1; // Move up in whole increments
	} else {
		ghost.y += 1; // Move down in whole increments
	}

	// If the move resulted in an invalid position, reverse
	if (ghost.y < topWall || ghost.y >= bottomWall) {
		// Revert to previous position
		ghost.y = ghost.direction === 'up' ? topWall : bottomWall - 1;
		// Change direction
		ghost.direction = ghost.direction === 'up' ? 'down' : 'up';
	}
};

// Move to "scatter" mode - each ghost goes to its corner
const moveGhostToScatterTarget = (ghost: Ghost, store: StoreType) => {
	const target = SCATTER_CORNERS[ghost.name] || SCATTER_CORNERS['blinky'];
	ghost.target = target;

	// At the corner, step to an adjacent cell so BFS loops the ghost back next frame
	if (ghost.x === target.x && ghost.y === target.y) {
		const moves = MovementUtils.getValidMoves(ghost.x, ghost.y);
		if (moves.length > 0) {
			const [dx, dy] = moves[0];
			ghost.x += dx;
			ghost.y += dy;
			if (dx > 0) ghost.direction = 'right';
			else if (dx < 0) ghost.direction = 'left';
			else if (dy > 0) ghost.direction = 'down';
			else if (dy < 0) ghost.direction = 'up';
		}
		return;
	}

	const nextMove = BFSTargetLocation(ghost.x, ghost.y, target.x, target.y, ghost.direction);
	if (nextMove) {
		ghost.x = nextMove.x;
		ghost.y = nextMove.y;

		if (nextMove.direction) {
			ghost.direction = nextMove.direction;
		}
	}
};

// When scared, ghosts move randomly but with some intelligence
const moveScaredGhost = (ghost: Ghost, store: StoreType) => {
	// Ghosts move at half speed during power-up (one cell per two frames)
	const SCARED_SPEED = 0.5;
	const subX = ghost.subX ?? 0;
	const subY = ghost.subY ?? 0;
	const atBoundary = subX === 0 && subY === 0;

	if (!atBoundary) {
		const dirX = subX > 0 ? 1 : subX < 0 ? -1 : 0;
		const dirY = subY > 0 ? 1 : subY < 0 ? -1 : 0;
		ghost.subX = subX + dirX * SCARED_SPEED;
		ghost.subY = subY + dirY * SCARED_SPEED;
		if ((ghost.subX ?? 0) >= 1) {
			ghost.x += 1;
			ghost.subX = 0;
		} else if ((ghost.subX ?? 0) <= -1) {
			ghost.x -= 1;
			ghost.subX = 0;
		}
		if ((ghost.subY ?? 0) >= 1) {
			ghost.y += 1;
			ghost.subY = 0;
		} else if ((ghost.subY ?? 0) <= -1) {
			ghost.y -= 1;
			ghost.subY = 0;
		}
		const nowAtBoundary = (ghost.subX ?? 0) === 0 && (ghost.subY ?? 0) === 0;
		if (nowAtBoundary && store.pacman.powerupRemainingDuration === 0) {
			ghost.scared = false;
		}
		return;
	}

	if (store.pacman.powerupRemainingDuration === 0) {
		ghost.scared = false;
		return;
	}

	// Check if you already have a target or if you have already reached the current target
	if (!ghost.target || (ghost.x === ghost.target.x && ghost.y === ghost.target.y)) {
		ghost.target = getRandomDestination(ghost.x, ghost.y);
	}

	const validMoves = getValidMovesWithoutReverse(ghost);
	if (validMoves.length === 0) return;

	// Move toward target but with some randomness to appear "scared"
	const dx = ghost.target.x - ghost.x;
	const dy = ghost.target.y - ghost.y;

	// Filter moves that generally go toward the target but with randomness
	let possibleMoves = validMoves;

	// 50% chance to choose a completely random move
	if (Math.random() < 0.5) {
		// Choose any valid move
	} else {
		// Try to choose a move that goes in the direction of the target.
		const goodMoves = validMoves.filter((move) => {
			const moveX = move[0];
			const moveY = move[1];
			return (dx > 0 && moveX > 0) || (dx < 0 && moveX < 0) || (dy > 0 && moveY > 0) || (dy < 0 && moveY < 0);
		});

		// If there are "good" moves, use them.
		if (goodMoves.length > 0) {
			possibleMoves = goodMoves;
		}
	}

	// Choose a random move from the possible moves
	const [moveX, moveY] = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

	// Update ghost direction based on movement
	if (moveX > 0) ghost.direction = 'right';
	else if (moveX < 0) ghost.direction = 'left';
	else if (moveY > 0) ghost.direction = 'down';
	else if (moveY < 0) ghost.direction = 'up';

	ghost.subX = moveX * SCARED_SPEED;
	ghost.subY = moveY * SCARED_SPEED;
};

// Function to get valid moves that are not reversals of the current direction
const getValidMovesWithoutReverse = (ghost: Ghost): [number, number][] => {
	const validMoves = MovementUtils.getValidMoves(ghost.x, ghost.y);

	// Do not allow the ghost to reverse its direction unless it is the only way
	return validMoves.filter((move) => {
		const [dx, dy] = move;

		// Checks whether the movement would be a reversal of the current direction
		if (
			(ghost.direction === 'right' && dx < 0) ||
			(ghost.direction === 'left' && dx > 0) ||
			(ghost.direction === 'up' && dy > 0) ||
			(ghost.direction === 'down' && dy < 0)
		) {
			return false;
		}

		return true;
	});
};

// Special movement for eyes to return home
const moveEyesToHome = (ghost: Ghost, store: StoreType) => {
	const respawnPosition = { x: 26, y: 3 }; // Center of the ghost house

	// Check if you are already close to/inside the house
	if (Math.abs(ghost.x - respawnPosition.x) <= 1 && Math.abs(ghost.y - respawnPosition.y) <= 1) {
		// Adjust to the exact respawn position and start the respawn process
		ghost.x = respawnPosition.x;
		ghost.y = respawnPosition.y;
		ghost.inHouse = true;
		ghost.respawnCounter = 1; // Time to respawn
		return;
	}

	// Eyes move faster than normal ghosts
	const nextMove = MovementUtils.findNextStepDijkstra({ x: ghost.x, y: ghost.y }, respawnPosition);

	if (nextMove) {
		// Calculate direction based on movement
		const dx = nextMove.x - ghost.x;
		const dy = nextMove.y - ghost.y;

		// Update direction based on actual movement
		if (dx > 0) ghost.direction = 'right';
		else if (dx < 0) ghost.direction = 'left';
		else if (dy > 0) ghost.direction = 'down';
		else if (dy < 0) ghost.direction = 'up';

		// Update position
		ghost.x = nextMove.x;
		ghost.y = nextMove.y;
	} else {
		// If you can't find a path, use BFSTargetedLocation as a fallback
		const alternativeMove = BFSTargetLocation(
			ghost.x,
			ghost.y,
			respawnPosition.x,
			respawnPosition.y,
			ghost.direction as 'right' | 'left' | 'up' | 'down'
		);

		if (alternativeMove) {
			ghost.x = alternativeMove.x;
			ghost.y = alternativeMove.y;

			if (alternativeMove.direction) {
				ghost.direction = alternativeMove.direction;
			}
		}
	}
};

// Specific movement for each ghost personality
const moveGhostWithPersonality = (ghost: Ghost, store: StoreType) => {
	// If the ghost is respawning (eyes only), use expert logic
	if (ghost.name === 'eyes') {
		moveEyesToHome(ghost, store);
		return;
	}

	// Target calculation based on ghost personality
	const target = calculateGhostTarget(ghost, store);
	ghost.target = target;

	// Finds the next move using BFS, respecting no-reversal rules
	const nextMove = BFSTargetLocation(ghost.x, ghost.y, target.x, target.y, ghost.direction);
	if (nextMove) {
		ghost.x = nextMove.x;
		ghost.y = nextMove.y;

		if (nextMove.direction) {
			ghost.direction = nextMove.direction;
		}
	}
};

// Improved version of BFS that respects the no-reversion rule
const BFSTargetLocation = (
	startX: number,
	startY: number,
	targetX: number,
	targetY: number,
	currentDirection?: 'right' | 'left' | 'up' | 'down'
): { x: number; y: number; direction?: 'right' | 'left' | 'up' | 'down' } | null => {
	// If we are already on target, no need to move
	if (startX === targetX && startY === targetY) return null;

	// Define a specific type for queue and path items
	type PathNode = {
		x: number;
		y: number;
		pathDirection?: 'right' | 'left' | 'up' | 'down';
	};

	type QueueItem = {
		x: number;
		y: number;
		firstStep?: PathNode;
		direction: 'right' | 'left' | 'up' | 'down' | string;
	};

	const queue: QueueItem[] = [{ x: startX, y: startY, direction: currentDirection || 'right' }];
	let queueHead = 0;
	const visited = new Set<string>();
	visited.add(`${startX},${startY}`);

	while (queueHead < queue.length) {
		const current = queue[queueHead++];
		const { x, y, firstStep, direction } = current;

		// Get valid moves
		const validMoves = MovementUtils.getValidMoves(x, y);

		// Filter out moves that would reverse the current direction
		const filteredMoves = validMoves.filter((move) => {
			const [dx, dy] = move;

			// If we have no defined direction, allow any movement
			if (!direction) return true;

			// Check if it would be a reversal
			if (
				(direction === 'right' && dx < 0) ||
				(direction === 'left' && dx > 0) ||
				(direction === 'up' && dy > 0) ||
				(direction === 'down' && dy < 0)
			) {
				// If there is only one valid move and it would be a reversal, allow it anyway
				return validMoves.length === 1;
			}

			return true;
		});

		for (const [dx, dy] of filteredMoves) {
			const newX = x + dx;
			const newY = y + dy;
			const key = `${newX},${newY}`;

			if (visited.has(key)) continue;
			visited.add(key);

			// Determine the new direction
			let newDirection: 'right' | 'left' | 'up' | 'down';
			if (dx > 0) newDirection = 'right';
			else if (dx < 0) newDirection = 'left';
			else if (dy > 0) newDirection = 'down';
			else if (dy < 0) newDirection = 'up';
			else newDirection = direction as 'right' | 'left' | 'up' | 'down';

			const pathNode: PathNode = {
				x: newX,
				y: newY,
				pathDirection: newDirection
			};

			const nextFirstStep = firstStep ?? pathNode;

			if (newX === targetX && newY === targetY) {
				// Return the first position of the path with the direction
				return {
					x: nextFirstStep.x,
					y: nextFirstStep.y,
					direction: nextFirstStep.pathDirection
				};
			}

			queue.push({ x: newX, y: newY, firstStep: nextFirstStep, direction: newDirection });
		}
	}

	// If we don't find a path, check if there is any valid movement
	const validMoves = MovementUtils.getValidMoves(startX, startY);
	if (validMoves.length > 0) {
		// Choose a random move if we can't find a path
		const [dx, dy] = validMoves[Math.floor(Math.random() * validMoves.length)];
		let direction: 'right' | 'left' | 'up' | 'down' = currentDirection as 'right' | 'left' | 'up' | 'down';

		if (dx > 0) direction = 'right';
		else if (dx < 0) direction = 'left';
		else if (dy > 0) direction = 'down';
		else if (dy < 0) direction = 'up';

		return {
			x: startX + dx,
			y: startY + dy,
			direction
		};
	}

	// If there is no valid movement, do not move
	return null;
};

// Calculates the fate for each ghost based on their personality
const calculateGhostTarget = (ghost: Ghost, store: StoreType): Point2d => {
	const { pacman } = store;
	let pacDirection = getPacmanDirection(store);

	// Adjust Blinky's speed based on remaining points (becomes more aggressive)
	let speedMultiplier = 1;
	if (ghost.name === 'blinky') {
		// When there are few points left, Blinky becomes faster ("Elroy mode")
		const totalDots = GRID_WIDTH * GRID_HEIGHT;
		const dotsEaten = totalDots - dotsRemaining;
		const percentageEaten = dotsEaten / totalDots;

		if (percentageEaten > 0.7) {
			speedMultiplier = 1.2; // 20% faster
		}
		if (percentageEaten > 0.9) {
			speedMultiplier = 1.4; // 40% faster
		}

		// Apply speed multiplier if chasing Pac-Man
		if (Math.random() < 0.8 * speedMultiplier) {
			// Blinky aims directly at Pac-Man
			return { x: pacman.x, y: pacman.y };
		}
	}

	switch (ghost.name) {
		case 'blinky': // Red - Aim directly at Pac-Man
			return { x: pacman.x, y: pacman.y };

		case 'pinky': // Pink - tries to ambush Pac-Man by positioning herself in front of him
			const lookAhead = 4; // 4 cells ahead of Pac-Man

			// Special calculation for the original "bug": when Pac-Man looks up,
			// the calculation also adds 4 cells to the left
			let targetX = pacman.x;
			let targetY = pacman.y;

			if (pacman.direction === 'up') {
				// Reproducing the original bug
				targetX = pacman.x - 4;
				targetY = pacman.y - 4;
			} else {
				targetX = pacman.x + pacDirection[0] * lookAhead;
				targetY = pacman.y + pacDirection[1] * lookAhead;
			}

			// Ensure the target is within the grid
			targetX = Math.min(Math.max(targetX, 0), GRID_WIDTH - 1);
			targetY = Math.min(Math.max(targetY, 0), GRID_HEIGHT - 1);

			return { x: targetX, y: targetY };

		case 'inky': // Blue - Coordinated behavior with Blinky
			const blinky = store.ghosts.find((g) => g.name === 'blinky');

			// Landmark: 2 cells ahead of Pac-Man
			let twoAhead = {
				x: pacman.x + pacDirection[0] * 2,
				y: pacman.y + pacDirection[1] * 2
			};

			// Again, reproducing the Pinky bug upwards
			if (pacman.direction === 'up') {
				twoAhead.x = pacman.x - 2;
				twoAhead.y = pacman.y - 2;
			}

			// If Blinky exists, calculate the vector from it
			if (blinky) {
				// Fold Blinky's vector to the reference point
				const vectorX = twoAhead.x - blinky.x;
				const vectorY = twoAhead.y - blinky.y;

				twoAhead = {
					x: twoAhead.x + vectorX,
					y: twoAhead.y + vectorY
				};
			}

			// Ensure the target is within the grid
			twoAhead.x = Math.min(Math.max(twoAhead.x, 0), GRID_WIDTH - 1);
			twoAhead.y = Math.min(Math.max(twoAhead.y, 0), GRID_HEIGHT - 1);

			return twoAhead;

		case 'clyde': // Orange - Toggles between chasing and random
			const distanceToPacman = MovementUtils.calculateDistance(ghost.x, ghost.y, pacman.x, pacman.y);

			// Clyde's special behavior: if he's too close, he runs away to his corner
			if (distanceToPacman < 8) {
				return SCATTER_CORNERS['clyde']; // Go to your corner when close
			} else {
				// When far away, chases Pac-Man directly
				return { x: pacman.x, y: pacman.y };
			}

		default:
			// Default behavior: Aim at Pac-Man
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

// Get a random destination for spooked ghosts
const getRandomDestination = (x: number, y: number) => {
	const maxDistance = 8;
	const randomX = x + Math.floor(Math.random() * (2 * maxDistance + 1)) - maxDistance;
	const randomY = y + Math.floor(Math.random() * (2 * maxDistance + 1)) - maxDistance;
	return {
		x: Math.max(0, Math.min(randomX, GRID_WIDTH - 1)),
		y: Math.max(0, Math.min(randomY, GRID_HEIGHT - 1))
	};
};

export const GhostsMovement = {
	moveGhosts,
	resetGameMode
};
