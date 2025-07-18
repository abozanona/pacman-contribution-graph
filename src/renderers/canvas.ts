import { CELL_SIZE, GAP_SIZE, GHOSTS, GRID_HEIGHT, GRID_WIDTH, WALLS } from '../core/constants';
import { MusicPlayer } from '../music-player';
import { Ghost, StoreType } from '../types';
import { Utils } from '../utils/utils';
import { RendererUnits } from './renderer-units';

const resizeCanvas = (store: StoreType) => {
	const canvasWidth = GRID_WIDTH * (CELL_SIZE + GAP_SIZE);
	const canvasHeight = GRID_HEIGHT * (CELL_SIZE + GAP_SIZE) + 20; // Adding some space for months on top

	store.config.canvas.width = canvasWidth;
	store.config.canvas.height = canvasHeight;
};

const drawGrid = (store: StoreType) => {
	const ctx = store.config.canvas.getContext('2d')!;
	ctx.fillStyle = Utils.getCurrentTheme(store).gridBackground;
	ctx.fillRect(0, 0, store.config.canvas.width, store.config.canvas.height);

	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			if (store.grid[x][y].level !== 'NONE') {
				const color = store.grid[x][y].color;
				ctx.fillStyle = color;
			} else {
				ctx.fillStyle = Utils.getCurrentTheme(store).intensityColors[0];
			}
			ctx.beginPath();
			store.config.canvas
				.getContext('2d')!
				.roundRect(x * (CELL_SIZE + GAP_SIZE), y * (CELL_SIZE + GAP_SIZE) + 15, CELL_SIZE, CELL_SIZE, 5);
			ctx.fill();
		}
	}

	ctx.fillStyle = Utils.getCurrentTheme(store).wallColor;
	for (let x = 0; x <= GRID_WIDTH; x++) {
		for (let y = 0; y <= GRID_HEIGHT; y++) {
			// Draw horizontal walls
			if (WALLS.horizontal[x][y].active) {
				ctx.fillRect(
					x * (CELL_SIZE + GAP_SIZE) - GAP_SIZE,
					y * (CELL_SIZE + GAP_SIZE) - GAP_SIZE + 15,
					CELL_SIZE + GAP_SIZE,
					GAP_SIZE
				);
				// TODO: For drawing lines labels only
				// ctx.fillStyle = '#000';
				// ctx.fillText(WALLS.horizontal[x][y].id, x * (GAP_SIZE + CELL_SIZE), y * (GAP_SIZE + CELL_SIZE));
			}

			// Draw vertical walls
			if (WALLS.vertical[x][y].active) {
				ctx.fillRect(
					x * (CELL_SIZE + GAP_SIZE) - GAP_SIZE,
					y * (CELL_SIZE + GAP_SIZE) - GAP_SIZE + 15,
					GAP_SIZE,
					CELL_SIZE + GAP_SIZE
				);
				// TODO: For drawing lines labels only
				// ctx.fillStyle = '#000';
				// ctx.fillText(WALLS.vertical[x][y].id, x * (GAP_SIZE + CELL_SIZE), (y + 1) * (GAP_SIZE + CELL_SIZE));
			}
		}
	}

	ctx.fillStyle = Utils.getCurrentTheme(store).textColor;
	ctx.font = '10px Arial';
	ctx.textAlign = 'center';

	let lastMonth = '';

	for (let x = 0; x < GRID_WIDTH; x++) {
		if (store.monthLabels[x] !== lastMonth) {
			const xPos = x * (CELL_SIZE + GAP_SIZE) + CELL_SIZE / 2;
			ctx.fillText(store.monthLabels[x], xPos, 10);
			lastMonth = store.monthLabels[x];
		}
	}
};

const drawPacman = (store: StoreType) => {
	const ctx = store.config.canvas.getContext('2d')!;
	const x = store.pacman.x * (CELL_SIZE + GAP_SIZE) + CELL_SIZE / 2;
	const y = store.pacman.y * (CELL_SIZE + GAP_SIZE) + CELL_SIZE / 2 + 15;
	const radius = CELL_SIZE / 2;

	// Change Pac-Man's color to red if he's on power-up, dead, else yellow
	ctx.fillStyle = RendererUnits.generatePacManColors(store.pacman);

	const mouthAngle = store.pacmanMouthOpen ? 0.35 * Math.PI : 0.1 * Math.PI;

	let startAngle, endAngle;
	switch (store.pacman.direction) {
		case 'up':
			startAngle = 1.5 * Math.PI + mouthAngle;
			endAngle = 1.5 * Math.PI - mouthAngle;
			break;
		case 'down':
			startAngle = 0.5 * Math.PI + mouthAngle;
			endAngle = 0.5 * Math.PI - mouthAngle;
			break;
		case 'left':
			startAngle = Math.PI + mouthAngle;
			endAngle = Math.PI - mouthAngle;
			break;
		case 'right':
		default:
			startAngle = 0 + mouthAngle;
			endAngle = 2 * Math.PI - mouthAngle;
			break;
	}

	ctx.beginPath();
	ctx.arc(x, y, radius, startAngle, endAngle);
	ctx.lineTo(x, y);
	ctx.fill();
};

const preloadedImages: { [key: string]: HTMLImageElement } = {};
const getLoadedImage = (key: string, imgDate: string): HTMLImageElement => {
	if (!preloadedImages[key]) {
		const image = new Image();
		image.src = imgDate;
		preloadedImages[key] = image;
	}
	return preloadedImages[key];
};

const drawGhosts = (store: StoreType) => {
	store.ghosts.forEach((ghost: Ghost) => {
		const x = ghost.x * (CELL_SIZE + GAP_SIZE);
		const y = ghost.y * (CELL_SIZE + GAP_SIZE) + 15;
		const size = CELL_SIZE;

		const ctx = store.config.canvas.getContext('2d')!;
		if (ghost.scared) {
			if ('imgDate' in GHOSTS.scared) {
				ctx.drawImage(getLoadedImage('scared', GHOSTS.scared.imgDate), x, y, size, size);
			}
		} else {
			const ghostData = GHOSTS[ghost.name];
			const direction = ghost.direction as 'up' | 'down' | 'left' | 'right';
			const imgSrc = (ghostData as Record<'up' | 'down' | 'left' | 'right', string>)[direction];

			ctx.drawImage(getLoadedImage(ghost.name + '-' + ghost.direction, imgSrc), x, y, size, size);
		}
	});
};

const renderGameOver = (store: StoreType) => {
	const ctx = store.config.canvas.getContext('2d')!;
	ctx.fillStyle = Utils.getCurrentTheme(store).textColor;
	ctx.font = '20px Arial';
	ctx.textAlign = 'center';
	ctx.fillText('Game Over', store.config.canvas.width / 2, store.config.canvas.height / 2);
};

const drawSoundController = (store: StoreType) => {
	if (!store.config.enableSounds) {
		return;
	}
	const ctx = store.config.canvas.getContext('2d')!;

	const width = 30,
		height = 30,
		left = store.config.canvas.width - width - 10,
		top = 10;
	ctx.fillStyle = `rgba(0, 0, 0, ${MusicPlayer.getInstance().isMuted ? 0.3 : 0.5})`;
	ctx.beginPath();
	ctx.moveTo(left + 10, top + 10);
	ctx.lineTo(left + 20, top + 5);
	ctx.lineTo(left + 20, top + 25);
	ctx.lineTo(left + 10, top + 20);
	ctx.closePath();
	ctx.fill();

	if (!MusicPlayer.getInstance().isMuted) {
		ctx.strokeStyle = `rgba(0, 0, 0, 0.4)`;
		ctx.lineWidth = 2;

		// First wave
		ctx.beginPath();
		ctx.arc(left + 25, top + 15, 5, 0, Math.PI * 2);
		ctx.stroke();

		// Second wave
		ctx.beginPath();
		ctx.arc(left + 25, top + 15, 8, 0, Math.PI * 2);
		ctx.stroke();
	} else {
		// Mute line
		ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(left + 25, top + 5);
		ctx.lineTo(left + 5, top + 25);
		ctx.stroke();
	}
};

const listenToSoundController = (store: StoreType) => {
	if (!store.config.enableSounds) {
		return;
	}
	store.config.canvas.addEventListener('click', function (event) {
		const rect = store.config.canvas.getBoundingClientRect();
		const x = event.clientX - rect.left,
			y = event.clientY - rect.top;
		const width = 30,
			height = 30,
			left = store.config.canvas.width - width - 10,
			top = 10;

		if (x >= left && x <= left + this.width && y >= top && y <= top + this.height) {
			if (MusicPlayer.getInstance().isMuted) {
				MusicPlayer.getInstance().unmute();
			} else {
				MusicPlayer.getInstance().mute();
			}
		}
	});
};

export const Canvas = {
	resizeCanvas,
	drawGrid,
	drawPacman,
	drawGhosts,
	renderGameOver,
	drawSoundController,
	listenToSoundController
};
