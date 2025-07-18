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

	const nextMove = BFSTargetLocation(ghost.x, ghost.y, target.x, target.y, ghost.direction);
	if (nextMove) {
		ghost.x = nextMove.x;
		ghost.y = nextMove.y;

		if (nextMove.direction) {
			ghost.direction = nextMove.direction;
		}
	}
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
	// Check if you already have a target or if you have already reached the current target
	if (!ghost.target || (ghost.x === ghost.target.x && ghost.y === ghost.target.y)) {
		ghost.target = getRandomDestination(ghost.x, ghost.y);
	}

	const validMoves = getValidMovesWithoutReverse(ghost, store);
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

	// If Pacman has power-up, ghosts move slower (60% slower)
	if (store.pacman.powerupRemainingDuration && Math.random() < 0.6) return;

	// Update ghost direction based on movement
	if (moveX > 0) ghost.direction = 'right';
	else if (moveX < 0) ghost.direction = 'left';
	else if (moveY > 0) ghost.direction = 'down';
	else if (moveY < 0) ghost.direction = 'up';

	ghost.x += moveX;
	ghost.y += moveY;
};

// Function to get valid moves that are not reversals of the current direction
const getValidMovesWithoutReverse = (ghost: Ghost, store: StoreType): [number, number][] => {
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
		path: PathNode[];
		direction: 'right' | 'left' | 'up' | 'down' | string;
	};

	const queue: QueueItem[] = [{ x: startX, y: startY, path: [], direction: currentDirection || 'right' }];
	const visited = new Set<string>();
	visited.add(`${startX},${startY}`);

	while (queue.length > 0) {
		const current = queue.shift()!;
		const { x, y, path, direction } = current;

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

			const newPath = [...path, pathNode];

			if (newX === targetX && newY === targetY) {
				// Return the first position of the path with the direction
				return newPath.length > 0
					? {
							x: newPath[0].x,
							y: newPath[0].y,
							direction: newPath[0].pathDirection
						}
					: null;
			}

			queue.push({ x: newX, y: newY, path: newPath, direction: newDirection });
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
	const randomY = y + Math.floor(Math.random() * (2 * maxDistance + 1)) - maxDistance;
	return {
		x: Math.max(0, Math.min(randomX, GRID_WIDTH - 1)),
		y: Math.max(0, Math.min(randomY, GRID_HEIGHT - 1))
	};
};

export const GhostsMovement = {
	moveGhosts
};
