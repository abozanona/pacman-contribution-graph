import { AnimationData } from '../../shared/types';
import { Utils } from '../../shared/utils/utils';
import {
	CELL_SIZE,
	DELTA_TIME,
	GAP_SIZE,
	GRID_HEIGHT,
	GRID_WIDTH,
	TETRIS_CELL_RADIUS,
	TETRIS_DURATION_DIVISOR,
	TETRIS_HEADER_HEIGHT,
	TETRIS_MIN_DURATION_MS
} from '../core/constants';
import { TetrisCell, TetrisStore } from '../types';

const toX = (x: number) => x * (CELL_SIZE + GAP_SIZE);
const toY = (y: number) => y * (CELL_SIZE + GAP_SIZE) + TETRIS_HEADER_HEIGHT;

interface TetrisPalette {
	pieces: string[];
	flash: string[];
}

/** Piece colours avoid the green/blue of the contribution palettes so the two never blend together. */
const getTetrisPalette = (store: TetrisStore): TetrisPalette => {
	const isDark = store.config.gameTheme.endsWith('-dark');
	return isDark
		? {
				pieces: ['#a371f7', '#f0883e', '#db61a2', '#e3b341', '#f85149', '#56d4dd', '#ff9bce'],
				flash: ['#ffffff', '#f0f6fc']
			}
		: {
				pieces: ['#8250df', '#e16f24', '#bf3989', '#d4a72c', '#cf222e', '#1b7c83', '#a475f9'],
				flash: ['#ffd33d', '#fff8c5']
			};
};

const mixColors = (from: string, to: string, t: number): string => {
	const channel = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
	return (
		'#' +
		[0, 1, 2]
			.map((i) =>
				Math.round(channel(from, i) + (channel(to, i) - channel(from, i)) * t)
					.toString(16)
					.padStart(2, '0')
			)
			.join('')
	);
};

const cellColor = (store: TetrisStore, palette: TetrisPalette, cell: TetrisCell, x: number, y: number, emptyColor: string): string => {
	switch (cell.kind) {
		case 'contribution':
			return store.grid[x]?.[y]?.color ?? emptyColor;
		case 'piece':
		case 'falling':
			return palette.pieces[(cell.pieceColor ?? 0) % palette.pieces.length];
		case 'fading':
			return mixColors(palette.pieces[(cell.pieceColor ?? 0) % palette.pieces.length], emptyColor, cell.fade ?? 1);
		case 'clearing':
			return palette.flash[(cell.flash ?? 0) % palette.flash.length];
		default:
			return emptyColor;
	}
};

const buildMonthLabels = (store: TetrisStore) => {
	if (store.config.showMonthLabels === false) return '';
	let labels = '';
	let last = '';
	const theme = Utils.getCurrentTheme(store);
	for (let x = 0; x < GRID_WIDTH; x++) {
		const month = store.monthLabels[x] ?? '';
		if (!month || month === last) continue;
		labels += `<text x="${toX(x) + CELL_SIZE / 2}" y="16" text-anchor="middle" font-size="10" fill="${theme.textColor}">${month}</text>`;
		last = month;
	}
	return labels;
};

const generateAnimatedSVG = (store: TetrisStore): string => {
	const theme = Utils.getCurrentTheme(store);
	const palette = getTetrisPalette(store);
	const width = GRID_WIDTH * (CELL_SIZE + GAP_SIZE);
	const height = GRID_HEIGHT * (CELL_SIZE + GAP_SIZE) + TETRIS_HEADER_HEIGHT;
	const totalFrames = Math.max(store.snapshots.length, 1);
	const durationMs = Math.max((totalFrames * DELTA_TIME) / TETRIS_DURATION_DIVISOR, TETRIS_MIN_DURATION_MS);

	let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" color-interpolation="sRGB">`;
	svg += `<rect width="100%" height="100%" fill="${theme.gridBackground}"/>`;
	svg += buildMonthLabels(store);

	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			const fillSeries = store.snapshots.map((snapshot) =>
				cellColor(store, palette, snapshot.cells[x][y], x, y, theme.intensityColors[0])
			);
			const fillAnim = generateChangingValuesAnimation(store, fillSeries);
			svg += `<rect x="${toX(x)}" y="${toY(y)}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="${TETRIS_CELL_RADIUS}" fill="${fillSeries[0]}">`;
			if (fillAnim) {
				svg += `<animate attributeName="fill" calcMode="discrete" dur="${durationMs}ms" repeatCount="indefinite" keyTimes="${fillAnim.keyTimes}" values="${fillAnim.values}"/>`;
			}
			svg += `</rect>`;
		}
	}

	svg += `</svg>`;
	return svg;
};

export const SVG_KEY_TIMES_PRECISION = 4;
const generateChangingValuesAnimation = (store: TetrisStore, changingValues: string[]): AnimationData | null => {
	const totalFrames = store.snapshots.length;
	if (totalFrames <= 1) {
		return null;
	}

	let keyTimes: number[] = [];
	let values: string[] = [];
	let lastValue: string | null = null;
	let lastIndex: number | null = null;

	changingValues.forEach((currentValue, index) => {
		if (currentValue !== lastValue) {
			if (lastValue !== null && lastIndex !== null && index - 1 !== lastIndex) {
				keyTimes.push(Number(((index - 0.1) / (totalFrames - 1)).toFixed(SVG_KEY_TIMES_PRECISION)));
				values.push(lastValue);
			}

			keyTimes.push(Number((index / (totalFrames - 1)).toFixed(SVG_KEY_TIMES_PRECISION)));
			values.push(currentValue);
			lastValue = currentValue;
			lastIndex = index;
		}
	});

	if (keyTimes.length === 0) {
		return null;
	}

	if (keyTimes[keyTimes.length - 1] !== 1) {
		keyTimes.push(1);
		values.push(lastValue || changingValues[changingValues.length - 1]);
	}

	return {
		keyTimes: keyTimes.join(';'),
		values: values.join(';')
	};
};

export const Renderer = {
	generateAnimatedSVG
};
