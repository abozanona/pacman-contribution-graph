import { AnimationData } from '../../shared/types';
import { Utils } from '../../shared/utils/utils';
import {
	CELL_SIZE,
	DELTA_TIME,
	GAP_SIZE,
	GRID_HEIGHT,
	GRID_WIDTH,
	SNAKE_CELL_RADIUS,
	SNAKE_DURATION_DIVISOR,
	SNAKE_HEADER_HEIGHT,
	SNAKE_MIN_DURATION_MS
} from '../core/constants';
import { SnakeCellState, SnakeStore } from '../types';

const toX = (x: number) => x * (CELL_SIZE + GAP_SIZE);
const toY = (y: number) => y * (CELL_SIZE + GAP_SIZE) + SNAKE_HEADER_HEIGHT;

interface SnakePalette {
	body: string;
	bite: string;
	shed: string;
}

/** The snake wears a colour that stands out against each platform's contribution palette. */
const getSnakePalette = (store: SnakeStore): SnakePalette => {
	switch (store.config.gameTheme) {
		case 'github-dark':
			return { body: '#a371f7', bite: '#f85149', shed: '#3d2f5c' };
		case 'gitlab':
			return { body: '#fc6d26', bite: '#c0392b', shed: '#fdd5c2' };
		case 'gitlab-dark':
			return { body: '#fc6d26', bite: '#ff4d4f', shed: '#5c3a24' };
		default:
			return { body: '#8250df', bite: '#cf222e', shed: '#e3d7fa' };
	}
};

/** Gaps bridged between consecutive body segments, keyed `r:x:y` (to the right of x,y) or `d:x:y` (below x,y). */
const buildConnectedGaps = (store: SnakeStore) =>
	store.snapshots.map(({ body }) => {
		const gaps = new Set<string>();
		for (let i = 1; i < body.length; i++) {
			const a = body[i - 1];
			const b = body[i];
			if (a.y === b.y && Math.abs(a.x - b.x) === 1) gaps.add(`r:${Math.min(a.x, b.x)}:${a.y}`);
			else if (a.x === b.x && Math.abs(a.y - b.y) === 1) gaps.add(`d:${a.x}:${Math.min(a.y, b.y)}`);
		}
		return gaps;
	});

const buildCellFillSeries = (store: SnakeStore, x: number, y: number, colors: Record<SnakeCellState, string>) =>
	store.snapshots.map((snapshot) => colors[snapshot.cells[x][y]]);

const buildMonthLabels = (store: SnakeStore) => {
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

const generateAnimatedSVG = (store: SnakeStore): string => {
	const theme = Utils.getCurrentTheme(store);
	const palette = getSnakePalette(store);
	const width = GRID_WIDTH * (CELL_SIZE + GAP_SIZE);
	const height = GRID_HEIGHT * (CELL_SIZE + GAP_SIZE) + SNAKE_HEADER_HEIGHT;
	const totalFrames = Math.max(store.snapshots.length, 1);
	const durationMs = Math.max((totalFrames * DELTA_TIME) / SNAKE_DURATION_DIVISOR, SNAKE_MIN_DURATION_MS);
	const animate = (attributeName: string, anim: AnimationData | null, calcMode = 'discrete') =>
		anim
			? `<animate attributeName="${attributeName}" calcMode="${calcMode}" dur="${durationMs}ms" repeatCount="indefinite" keyTimes="${anim.keyTimes}" values="${anim.values}"/>`
			: '';

	let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" color-interpolation="sRGB">`;
	svg += `<desc>Snake game inspired by Platane/snk (https://github.com/Platane/snk)</desc>`;
	svg += `<rect width="100%" height="100%" fill="${theme.gridBackground}"/>`;
	svg += buildMonthLabels(store);

	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			const colors: Record<SnakeCellState, string> = {
				food: store.grid[x]?.[y]?.color ?? theme.intensityColors[0],
				empty: theme.intensityColors[0],
				body: palette.body,
				bite: palette.bite,
				shed: palette.shed
			};
			const fillSeries = buildCellFillSeries(store, x, y, colors);
			svg += `<rect x="${toX(x)}" y="${toY(y)}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="${SNAKE_CELL_RADIUS}" fill="${fillSeries[0]}">`;
			svg += animate('fill', generateChangingValuesAnimation(store, fillSeries));
			svg += `</rect>`;
		}
	}

	// Bridge the gap between neighbouring segments so the snake reads as one continuous body.
	const connectedGaps = buildConnectedGaps(store);
	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			for (const direction of ['r', 'd'] as const) {
				const key = `${direction}:${x}:${y}`;
				const opacitySeries = connectedGaps.map((gaps) => (gaps.has(key) ? '1' : '0'));
				if (!opacitySeries.includes('1')) continue;

				const overlap = SNAKE_CELL_RADIUS;
				const rect =
					direction === 'r'
						? { x: toX(x) + CELL_SIZE - overlap, y: toY(y), width: GAP_SIZE + overlap * 2, height: CELL_SIZE }
						: { x: toX(x), y: toY(y) + CELL_SIZE - overlap, width: CELL_SIZE, height: GAP_SIZE + overlap * 2 };
				svg += `<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" fill="${palette.body}" opacity="${opacitySeries[0]}">`;
				svg += animate('opacity', generateChangingValuesAnimation(store, opacitySeries));
				svg += `</rect>`;
			}
		}
	}

	svg += `</svg>`;
	return svg;
};

export const SVG_KEY_TIMES_PRECISION = 4;
const generateChangingValuesAnimation = (store: SnakeStore, changingValues: string[]): AnimationData | null => {
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
