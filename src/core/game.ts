import { GhostsMovement } from '../movement/ghosts-movement';
import { PacmanMovement } from '../movement/pacman-movement';
import { MusicPlayer, Sound } from '../music-player';
import { Canvas } from '../renderers/canvas';
import { SVG } from '../renderers/svg';
import { GhostName, StoreType } from '../types';
import { Utils } from '../utils/utils';
import { DELTA_TIME, PACMAN_DEATH_DURATION } from './constants';

/* ---------- positioning helpers ---------- */

const placePellets = (store: StoreType) => {
	store.pellets = [];
	store.grid.forEach((row, y) => {
		row.forEach((cell, x) => {
			if (cell.commitsCount > 0 && Math.random() > 0.7) {
				store.pellets.push({ x, y });
			}
		});
	});
};

const placePacman = (store: StoreType) => {
	if (!store.config.useCustomStartPositions) {
		// Original fixed position
		store.pacman = {
			x: 1,
			y: 1,
			direction: 'right',
			points: 0,
			totalPoints: 0,
			deadRemainingDuration: 0,
			powerupRemainingDuration: 0,
			recentPositions: []
		};
	} else {
		// Custom position logic
		const validPositions: { x: number; y: number }[] = [];
		store.grid.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (cell.commitsCount > 0) validPositions.push({ x, y });
			});
		});

		if (validPositions.length > 0) {
			const pos = validPositions[Math.floor(Math.random() * validPositions.length)];
			store.pacman = {
				x: pos.x,
				y: pos.y,
				direction: 'right',
				points: 0,
				totalPoints: 0,
				deadRemainingDuration: 0,
				powerupRemainingDuration: 0,
				recentPositions: []
			};
		}
	}
};

const placeGhosts = (store: StoreType) => {
	store.ghosts = [];

	if (!store.config.useCustomStartPositions) {
		// Classic ghost house formation (center-top)
		const ghostHouseY = 3;
		const houseCenterX = Math.floor(store.grid[0].length / 2);

		store.ghosts = [
			{
				x: houseCenterX,
				y: ghostHouseY,
				name: 'blinky' as GhostName,
				direction: 'left',
				scared: false,
				target: undefined,
				inHouse: false,
				respawnCounter: 0,
				freezeCounter: 0,
				justReleasedFromHouse: false
			},
			{
				x: houseCenterX - 1,
				y: ghostHouseY,
				name: 'inky' as GhostName,
				direction: 'up',
				scared: false,
				target: undefined,
				inHouse: true,
				respawnCounter: 0,
				freezeCounter: 10,
				justReleasedFromHouse: false
			},
			{
				x: houseCenterX + 1,
				y: ghostHouseY,
				name: 'pinky' as GhostName,
				direction: 'down',
				scared: false,
				target: undefined,
				inHouse: true,
				respawnCounter: 0,
				freezeCounter: 20,
				justReleasedFromHouse: false
			},
			{
				x: houseCenterX,
				y: ghostHouseY - 1,
				name: 'clyde' as GhostName,
				direction: 'up',
				scared: false,
				target: undefined,
				inHouse: true,
				respawnCounter: 0,
				freezeCounter: 30,
				justReleasedFromHouse: false
			}
		];
	} else {
		// Ghost house with contribution validation
		const ghostHouseY = 3;
		const houseCenterX = Math.floor(store.grid[0].length / 2);

		const ghostHousePositions = [
			{ x: houseCenterX, y: ghostHouseY },
			{ x: houseCenterX - 1, y: ghostHouseY },
			{ x: houseCenterX + 1, y: ghostHouseY },
			{ x: houseCenterX, y: ghostHouseY - 1 }
		];

		// Filter to only valid contribution cells
		const validPositions = ghostHousePositions.filter((pos) => store.grid[pos.y]?.[pos.x].commitsCount > 0);

		// Fill ghosts with valid positions first, then fallback to center
		store.ghosts = ['blinky', 'inky', 'pinky', 'clyde'].map((name, index) => ({
			...(validPositions[index] || { x: houseCenterX, y: ghostHouseY }),
			name: name as GhostName,
			direction: 'left',
			scared: false,
			target: undefined,
			inHouse: index !== 0,
			respawnCounter: 0,
			freezeCounter: index * 10,
			justReleasedFromHouse: false
		}));
	}
};

/* ---------- main cycle ---------- */

const stopGame = async (store: StoreType) => {
	clearInterval(store.gameInterval as number);
};

const startGame = async (store: StoreType) => {
	if (store.config.outputFormat == 'canvas') {
		store.config.canvas = store.config.canvas;
		Canvas.resizeCanvas(store);
		Canvas.listenToSoundController(store);
	}

	store.frameCount = 0;
	store.gameHistory = []; // keeps clean
	store.ghosts.forEach((g) => (g.scared = false));

	store.grid = Utils.createGridFromData(store);

	const remainingCells = () => store.grid.some((row) => row.some((cell) => cell.commitsCount > 0));

	if (remainingCells()) {
		placePacman(store);
		placeGhosts(store);
	}

	if (store.config.outputFormat == 'canvas') Canvas.drawGrid(store);

	if (store.config.outputFormat == 'canvas') {
		if (!store.config.enableSounds) {
			MusicPlayer.getInstance().mute();
		}
		await MusicPlayer.getInstance().preloadSounds();
		MusicPlayer.getInstance().startDefaultSound();
		await MusicPlayer.getInstance().play(Sound.BEGINNING);
	}

	if (store.config.outputFormat === 'svg') {
		while (remainingCells()) {
			await updateGame(store);
		}
		// snapshot final
		await updateGame(store);
	} else {
		clearInterval(store.gameInterval as number);
		store.gameInterval = setInterval(() => updateGame(store), DELTA_TIME * store.config.gameSpeed) as unknown as number;
	}
};

/* ---------- utilities ---------- */

const resetPacman = (store: StoreType) => {
	store.pacman.x = 27;
	store.pacman.y = 7;
	store.pacman.direction = 'right';
	store.pacman.recentPositions = [];
};

export const determineGhostName = (index: number): GhostName => {
	const names: GhostName[] = ['blinky', 'inky', 'pinky', 'clyde'];
	return names[index % names.length];
};

/* ---------- update per frame ---------- */

const updateGame = async (store: StoreType) => {
	store.frameCount++;

	/* ---- FRAME-SKIP restored ---- */
	if (store.frameCount % store.config.gameSpeed !== 0) {
		pushSnapshot(store);
		return;
	}

	/* -------- pacman timers -------- */
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
				if (g.name !== 'eyes') g.scared = false;
			});
			store.pacman.points = 0;
		}
	}

	/* -- ghost respawn -- */
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

	/* -------- end of game -------- */
	const remaining = store.grid.some((row) => row.some((c) => c.commitsCount > 0));
	if (!remaining) {
		if (store.config.outputFormat === 'svg') {
			const svg = SVG.generateAnimatedSVG(store);
			store.config.svgCallback(svg);
		}
		if (store.config.outputFormat == 'canvas') {
			Canvas.renderGameOver(store);
			MusicPlayer.getInstance()
				.play(Sound.BEGINNING)
				.then(() => MusicPlayer.getInstance().stopDefaultSound());
		}
		store.config.gameOverCallback();
		return;
	}

	/* -------- movements -------- */
	PacmanMovement.movePacman(store);

	const cell = store.grid[store.pacman.x]?.[store.pacman.y];
	if (cell && cell.level === 'FOURTH_QUARTILE' && store.pacman.powerupRemainingDuration === 0) {
		store.pacman.powerupRemainingDuration = 30;
		store.ghosts.forEach((g) => {
			if (g.name !== 'eyes') g.scared = true;
		});
	}

	checkCollisions(store);

	if (store.pacman.deadRemainingDuration === 0) {
		GhostsMovement.moveGhosts(store);
		checkCollisions(store);
	}

	store.pacmanMouthOpen = !store.pacmanMouthOpen;

	/* ---- single snapshot per frame ---- */
	pushSnapshot(store);

	if (store.config.outputFormat == 'canvas') Canvas.drawGrid(store);
	if (store.config.outputFormat == 'canvas') Canvas.drawPacman(store);
	if (store.config.outputFormat == 'canvas') Canvas.drawGhosts(store);
	if (store.config.outputFormat == 'canvas') Canvas.drawSoundController(store);
};

/* ---------- snapshot helper ---------- */
const pushSnapshot = (store: StoreType) => {
	store.gameHistory.push({
		pacman: { ...store.pacman },
		ghosts: store.ghosts.map((g) => ({ ...g })),
		grid: store.grid.map((row) => row.map((col) => ({ ...col })))
	});
};

/* ---------- collisions & house ---------- */

const checkCollisions = (store: StoreType) => {
	if (store.pacman.deadRemainingDuration) return;

	store.ghosts.forEach((ghost) => {
		// If the ghost is eyes, there should be no collision
		if (ghost.name === 'eyes') return;

		if (ghost.x === store.pacman.x && ghost.y === store.pacman.y) {
			if (store.pacman.powerupRemainingDuration && ghost.scared) {
				ghost.originalName = ghost.name;
				ghost.name = 'eyes';
				ghost.scared = false;
				ghost.target = { x: 26, y: 3 };
				store.pacman.points += 10;
			} else {
				store.pacman.points = 0;
				store.pacman.powerupRemainingDuration = 0;
				if (store.pacman.deadRemainingDuration === 0) {
					store.pacman.deadRemainingDuration = PACMAN_DEATH_DURATION;
				}
			}
		}
	});
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
