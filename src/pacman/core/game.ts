import { Utils } from '../../shared/utils/utils';
import { GhostsMovement } from '../movement/ghosts-movement';
import { PacmanMovement } from '../movement/pacman-movement';
import { SVG } from '../renderers/svg';
import { GhostName, StoreType } from '../types';
import { PACMAN_DEATH_DURATION } from './constants';

/* ---------- positioning helpers ---------- */

const placePacman = (store: StoreType) => {
	store.pacman = {
		x: 0,
		y: 0,
		direction: 'right',
		points: 0,
		totalPoints: 0,
		deadRemainingDuration: 0,
		powerupRemainingDuration: 0,
		recentPositions: [],
		ghostsEaten: 0
	};
};

const placeGhosts = (store: StoreType) => {
	store.ghosts = [
		{
			x: 26,
			y: 2,
			name: 'blinky',
			direction: 'left',
			scared: false,
			target: undefined,
			inHouse: false,
			respawnCounter: 0,
			freezeCounter: 0,
			justReleasedFromHouse: false
		},
		{
			x: 25,
			y: 3,
			name: 'inky',
			direction: 'up',
			scared: false,
			target: undefined,
			inHouse: true,
			respawnCounter: 0,
			freezeCounter: 10,
			justReleasedFromHouse: false
		},
		{
			x: 26,
			y: 3,
			name: 'pinky',
			direction: 'down',
			scared: false,
			target: undefined,
			inHouse: true,
			respawnCounter: 0,
			freezeCounter: 20,
			justReleasedFromHouse: false
		},
		{
			x: 27,
			y: 3,
			name: 'clyde',
			direction: 'up',
			scared: false,
			target: undefined,
			inHouse: true,
			respawnCounter: 0,
			freezeCounter: 30,
			justReleasedFromHouse: false
		}
	];

	store.ghosts.forEach((g) => {
		g.justReleasedFromHouse = false;
		g.respawnCounter = 0;

		if (g.inHouse) {
			if (g.name === 'inky') g.direction = 'up';
			else if (g.name === 'pinky') g.direction = 'down';
			else if (g.name === 'clyde') g.direction = 'up';
		}
	});
};

/* ---------- main cycle ---------- */

const stopGame = async (store: StoreType) => {
	clearInterval(store.gameInterval as number);
};

const finalizeGame = (store: StoreType) => {
	const svg = SVG.generateAnimatedSVG(store);
	store.config.svgCallback(svg);
	if (store.config.gameStatsCallback) {
		store.config.gameStatsCallback({
			totalScore: store.pacman.totalPoints,
			steps: store.aliveSteps,
			ghostsEaten: store.pacman.ghostsEaten ?? 0
		});
	}
	store.config.gameOverCallback();
};

const startGame = async (store: StoreType) => {
	store.frameCount = 0;
	store.aliveSteps = 0;
	store.gameHistory = [];
	store.cellEvents = [];
	store.ghosts.forEach((g) => (g.scared = false));
	GhostsMovement.resetGameMode();

	store.grid = Utils.createGridFromData(store);
	store.initialColors = store.grid.map((col) => col.map((cell) => cell.color));

	const remainingCells = () => store.grid.some((row) => row.some((cell) => cell.commitsCount > 0));

	if (remainingCells()) {
		placePacman(store);
		placeGhosts(store);
	}

	const MAX_FRAMES = 3000;

	while (remainingCells() && store.gameHistory.length < MAX_FRAMES) {
		await updateGame(store);
	}

	if (remainingCells()) {
		finalizeGame(store);
		return;
	}

	await updateGame(store);
};

/* ---------- utilities ---------- */

const resetPacman = (store: StoreType) => {
	store.pacman.x = 27;
	store.pacman.y = 7;
	store.pacman.direction = 'right';
	store.pacman.recentPositions = [];
	store.pacman.target = undefined;
};

export const determineGhostName = (index: number): GhostName => {
	const names: GhostName[] = ['blinky', 'inky', 'pinky', 'clyde'];
	return names[index % names.length];
};

/* ---------- update per frame ---------- */

const updateGame = async (store: StoreType) => {
	store.frameCount++;

	if (store.pacman.deadRemainingDuration > 0) {
		store.pacman.deadRemainingDuration--;
		if (store.pacman.deadRemainingDuration === 0) {
			resetPacman(store);
			placeGhosts(store);
		}
	}

	if (store.pacman.powerupRemainingDuration > 0) {
		store.pacman.powerupRemainingDuration--;
		if (store.pacman.powerupRemainingDuration === 0) {
			store.ghosts.forEach((g) => {
				if (g.name === 'eyes') return;
				const atBoundary = (g.subX ?? 0) === 0 && (g.subY ?? 0) === 0;
				if (atBoundary) {
					g.scared = false;
				}
			});
			store.pacman.points = 0;
		}
	}

	store.ghosts.forEach((ghost) => {
		if (ghost.inHouse && ghost.respawnCounter && ghost.respawnCounter > 0) {
			ghost.respawnCounter--;
			if (ghost.respawnCounter === 0) {
				ghost.name = ghost.originalName || determineGhostName(store.ghosts.indexOf(ghost));
				ghost.inHouse = false;
				ghost.scared = store.pacman.powerupRemainingDuration > 0;
				ghost.justReleasedFromHouse = true;
			}
		}
		if (ghost.freezeCounter) {
			ghost.freezeCounter--;
			if (ghost.freezeCounter === 0) {
				releaseGhostFromHouse(store, ghost.name);
			}
		}
	});

	const remaining = store.grid.some((row) => row.some((c) => c.commitsCount > 0));
	if (!remaining) {
		finalizeGame(store);
		return;
	}

	PacmanMovement.movePacman(store);

	checkCollisions(store);

	if (store.pacman.deadRemainingDuration === 0) {
		GhostsMovement.moveGhosts(store);
		checkCollisions(store);
	}

	store.pacmanMouthOpen = !store.pacmanMouthOpen;

	if (store.pacman.deadRemainingDuration === 0) {
		store.aliveSteps++;
	}

	pushSnapshot(store);
};

/* ---------- snapshot helper ---------- */
const pushSnapshot = (store: StoreType) => {
	store.gameHistory.push({
		pacman: { ...store.pacman, recentPositions: [...store.pacman.recentPositions] },
		ghosts: store.ghosts.map((g) => ({ ...g }))
	});
};

/* ---------- collisions & house ---------- */

const checkCollisions = (store: StoreType) => {
	if (store.pacman.deadRemainingDuration) return;

	for (const ghost of store.ghosts) {
		if (ghost.name === 'eyes') continue;

		if (ghost.x === store.pacman.x && ghost.y === store.pacman.y) {
			if (ghost.scared) {
				ghost.originalName = ghost.name;
				ghost.name = 'eyes';
				ghost.scared = false;
				ghost.target = { x: 26, y: 3 };
				ghost.subX = 0;
				ghost.subY = 0;
				store.pacman.points += 10;
				store.pacman.ghostsEaten = (store.pacman.ghostsEaten ?? 0) + 1;
			} else {
				store.pacman.points = 0;
				store.pacman.powerupRemainingDuration = 0;
				if (store.pacman.deadRemainingDuration === 0) {
					store.pacman.deadRemainingDuration = PACMAN_DEATH_DURATION;
				}
				return;
			}
		}
	}
};

const releaseGhostFromHouse = (store: StoreType, name: GhostName) => {
	const ghost = store.ghosts.find((g) => g.name === name && g.inHouse);
	if (ghost) {
		ghost.justReleasedFromHouse = true;
		ghost.y = 2;
		ghost.direction = 'up';
	}
};

export const Game = {
	startGame,
	stopGame
};
