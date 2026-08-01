import { AnimationData } from '../../shared/types';
import { Utils } from '../../shared/utils/utils';
import {
	CELL_SIZE,
	DELTA_TIME,
	GAP_SIZE,
	GRID_HEIGHT,
	GRID_WIDTH,
	MINESWEEPER_CELL_RADIUS,
	MINESWEEPER_DURATION_DIVISOR,
	MINESWEEPER_HEADER_HEIGHT,
	MINESWEEPER_MIN_DURATION_MS
} from '../core/constants';
import { MinesweeperCell, MinesweeperStore } from '../types';

const toX = (x: number) => x * (CELL_SIZE + GAP_SIZE);
const toY = (y: number) => y * (CELL_SIZE + GAP_SIZE) + MINESWEEPER_HEADER_HEIGHT;

const colorForNumber = (n: number): string => {
	switch (n) {
		case 1:
			return '#1f4acc';
		case 2:
			return '#1b7f37';
		case 3:
			return '#b01e1e';
		case 4:
			return '#5b2ca3';
		case 5:
			return '#7d1a1a';
		case 6:
			return '#00838f';
		case 7:
			return '#111111';
		case 8:
			return '#495057';
		default:
			return '#495057';
	}
};

const getCellAt = (store: MinesweeperStore, frameIndex: number, x: number, y: number): MinesweeperCell =>
	store.snapshots[Math.min(frameIndex, store.snapshots.length - 1)].board[x][y];

const buildCellFillSeries = (
	store: MinesweeperStore,
	x: number,
	y: number,
	closedColor: string,
	openColor: string,
	explosionColor: string
) => {
	const values: string[] = [];
	for (let i = 0; i < store.snapshots.length; i++) {
		const cell = getCellAt(store, i, x, y);
		if (cell.exploded || cell.highlightMine) {
			values.push(explosionColor);
		} else if (cell.revealed) {
			values.push(openColor);
		} else {
			values.push(closedColor);
		}
	}
	return values;
};

const buildFlagOpacitySeries = (store: MinesweeperStore, x: number, y: number) => {
	const values: string[] = [];
	for (let i = 0; i < store.snapshots.length; i++) {
		const cell = getCellAt(store, i, x, y);
		values.push(cell.flagged ? '1' : '0');
	}
	return values;
};

const buildMineOpacitySeries = (store: MinesweeperStore, x: number, y: number) => {
	const values: string[] = [];
	for (let i = 0; i < store.snapshots.length; i++) {
		const cell = getCellAt(store, i, x, y);
		values.push(cell.exploded || cell.showMine ? '1' : '0');
	}
	return values;
};

const getExplosionTriggerFrames = (store: MinesweeperStore) => {
	const triggers: number[] = [];
	for (let i = 1; i < store.snapshots.length; i++) {
		let triggered = false;
		for (let x = 0; x < GRID_WIDTH && !triggered; x++) {
			for (let y = 0; y < GRID_HEIGHT; y++) {
				const prevCell = store.snapshots[i - 1].board[x][y];
				const currentCell = store.snapshots[i].board[x][y];
				if (!prevCell.exploded && currentCell.exploded) {
					triggered = true;
					break;
				}
			}
		}

		if (triggered) triggers.push(i);
	}
	return triggers;
};

const buildMineShakeTransformSeries = (store: MinesweeperStore, x: number, y: number, triggerFrames: number[]) => {
	const values: string[] = [];
	const pattern: Array<{ x: number; y: number }> = [
		{ x: 0, y: 0 },
		{ x: 1.3, y: -1.1 },
		{ x: -1.2, y: 1.1 },
		{ x: 0.9, y: 0.6 },
		{ x: 0, y: 0 }
	];

	for (let i = 0; i < store.snapshots.length; i++) {
		const cell = getCellAt(store, i, x, y);
		if (!cell.exploded) {
			values.push('translate(0 0)');
			continue;
		}

		let offsetX = 0;
		let offsetY = 0;
		for (const triggerFrame of triggerFrames) {
			const localIndex = i - triggerFrame;
			if (localIndex >= 0 && localIndex < pattern.length) {
				offsetX += pattern[localIndex].x;
				offsetY += pattern[localIndex].y;
			}
		}

		values.push(`translate(${offsetX.toFixed(2)} ${offsetY.toFixed(2)})`);
	}

	return values;
};

const buildMinePulseOpacitySeries = (store: MinesweeperStore, x: number, y: number, triggerFrames: number[]) => {
	const values: string[] = [];
	const visibleFramesAfterTrigger = 4;

	for (let i = 0; i < store.snapshots.length; i++) {
		const cell = getCellAt(store, i, x, y);
		if (!cell.exploded) {
			values.push('0');
			continue;
		}

		const visible = triggerFrames.some((triggerFrame) => i >= triggerFrame && i < triggerFrame + visibleFramesAfterTrigger);
		values.push(visible ? '1' : '0');
	}

	return values;
};

const buildNumberOpacitySeries = (store: MinesweeperStore, x: number, y: number) => {
	const values: string[] = [];
	for (let i = 0; i < store.snapshots.length; i++) {
		const cell = getCellAt(store, i, x, y);
		const shouldShowNumber = cell.showNumber ?? (cell.revealed && cell.adjacentMines > 0);
		values.push(shouldShowNumber ? '1' : '0');
	}
	return values;
};

const buildNumberTextSeries = (store: MinesweeperStore, x: number, y: number) => {
	const values: string[] = [];
	for (let i = 0; i < store.snapshots.length; i++) {
		const cell = getCellAt(store, i, x, y);
		values.push(String(cell.adjacentMines));
	}
	return values;
};

const buildCursorTransformSeries = (store: MinesweeperStore) => {
	const values: string[] = [];
	for (const snapshot of store.snapshots) {
		values.push(`${toX(snapshot.mouse.x) + 3} ${toY(snapshot.mouse.y) + 3}`);
	}
	return values;
};

const buildMonthLabels = (store: MinesweeperStore) => {
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

const generateAnimatedSVG = (store: MinesweeperStore): string => {
	const theme = Utils.getCurrentTheme(store);
	const width = GRID_WIDTH * (CELL_SIZE + GAP_SIZE);
	const height = GRID_HEIGHT * (CELL_SIZE + GAP_SIZE) + MINESWEEPER_HEADER_HEIGHT;
	const totalFrames = Math.max(store.snapshots.length, 1);
	const durationMs = Math.max((totalFrames * DELTA_TIME) / MINESWEEPER_DURATION_DIVISOR, MINESWEEPER_MIN_DURATION_MS);

	const closedColor = theme.intensityColors[0];
	const openColor = theme.gridBackground === '#ffffff' ? '#d7dde5' : '#2b3642';
	const explosionColor = '#f28b82';
	const flagColor = '#d94841';
	const explosionTriggerFrames = getExplosionTriggerFrames(store);

	let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" color-interpolation="sRGB">`;
	svg += `<rect width="100%" height="100%" fill="${theme.gridBackground}"/>`;
	svg += buildMonthLabels(store);

	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			const cell = store.board[x][y];
			const fillSeries = buildCellFillSeries(store, x, y, closedColor, openColor, explosionColor);
			const fillAnim = generateChangingValuesAnimation(store, fillSeries);
			const flagAnim = generateChangingValuesAnimation(store, buildFlagOpacitySeries(store, x, y));
			const mineAnim = generateChangingValuesAnimation(store, buildMineOpacitySeries(store, x, y));
			const minePulseAnim = generateChangingValuesAnimation(store, buildMinePulseOpacitySeries(store, x, y, explosionTriggerFrames));
			const mineShakeAnim = generateChangingValuesAnimation(
				store,
				buildMineShakeTransformSeries(store, x, y, explosionTriggerFrames)
			);
			const numberOpacityAnim = generateChangingValuesAnimation(store, buildNumberOpacitySeries(store, x, y));
			const numberTextAnim = generateChangingValuesAnimation(store, buildNumberTextSeries(store, x, y));

			svg += `<g id="cell-${x}-${y}">`;
			svg += `<rect x="${toX(x)}" y="${toY(y)}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="${MINESWEEPER_CELL_RADIUS}" fill="${fillSeries[0]}" stroke="${theme.wallColor}" stroke-opacity="0.18">`;
			if (fillAnim) {
				svg += `<animate attributeName="fill" calcMode="discrete" dur="${durationMs}ms" repeatCount="indefinite" keyTimes="${fillAnim.keyTimes}" values="${fillAnim.values}"/>`;
			}
			svg += `</rect>`;

			svg += `<text x="${toX(x) + CELL_SIZE / 2}" y="${toY(y) + CELL_SIZE * 0.68}" text-anchor="middle" font-size="12" font-weight="700" font-family="Verdana, sans-serif" fill="${colorForNumber(cell.adjacentMines)}" opacity="0">${cell.adjacentMines}`;
			if (numberTextAnim) {
				svg += `<animate attributeName="textContent" calcMode="discrete" dur="${durationMs}ms" repeatCount="indefinite" keyTimes="${numberTextAnim.keyTimes}" values="${numberTextAnim.values}"/>`;
			}
			if (numberOpacityAnim) {
				svg += `<animate attributeName="opacity" calcMode="discrete" dur="${durationMs}ms" repeatCount="indefinite" keyTimes="${numberOpacityAnim.keyTimes}" values="${numberOpacityAnim.values}"/>`;
			}
			svg += `</text>`;

			svg += `<g opacity="0">`;
			if (flagAnim) {
				svg += `<animate attributeName="opacity" calcMode="discrete" dur="${durationMs}ms" repeatCount="indefinite" keyTimes="${flagAnim.keyTimes}" values="${flagAnim.values}"/>`;
			}
			svg += `<line x1="${toX(x) + CELL_SIZE * 0.34}" y1="${toY(y) + CELL_SIZE * 0.24}" x2="${toX(x) + CELL_SIZE * 0.34}" y2="${toY(y) + CELL_SIZE * 0.78}" stroke="${theme.wallColor}" stroke-width="1.4"/>`;
			svg += `<polygon points="${toX(x) + CELL_SIZE * 0.36},${toY(y) + CELL_SIZE * 0.28} ${toX(x) + CELL_SIZE * 0.72},${toY(y) + CELL_SIZE * 0.43} ${toX(x) + CELL_SIZE * 0.36},${toY(y) + CELL_SIZE * 0.56}" fill="${flagColor}"/>`;
			svg += `</g>`;

			svg += `<g opacity="0" transform="translate(0 0)">`;
			if (minePulseAnim) {
				svg += `<animate attributeName="opacity" calcMode="discrete" dur="${durationMs}ms" repeatCount="indefinite" keyTimes="${minePulseAnim.keyTimes}" values="${minePulseAnim.values}"/>`;
			} else if (mineAnim) {
				svg += `<animate attributeName="opacity" calcMode="discrete" dur="${durationMs}ms" repeatCount="indefinite" keyTimes="${mineAnim.keyTimes}" values="${mineAnim.values}"/>`;
			}
			if (mineShakeAnim) {
				svg += `<animateTransform attributeName="transform" type="translate" calcMode="discrete" dur="${durationMs}ms" repeatCount="indefinite" keyTimes="${mineShakeAnim.keyTimes}" values="${mineShakeAnim.values.replace(/translate\(|\)/g, '')}"/>`;
			}
			svg += `<circle cx="${toX(x) + CELL_SIZE * 0.5}" cy="${toY(y) + CELL_SIZE * 0.5}" r="${CELL_SIZE * 0.18}" fill="#202124"/>`;
			svg += `<line x1="${toX(x) + CELL_SIZE * 0.5}" y1="${toY(y) + CELL_SIZE * 0.16}" x2="${toX(x) + CELL_SIZE * 0.5}" y2="${toY(y) + CELL_SIZE * 0.84}" stroke="#202124" stroke-width="1"/>`;
			svg += `<line x1="${toX(x) + CELL_SIZE * 0.16}" y1="${toY(y) + CELL_SIZE * 0.5}" x2="${toX(x) + CELL_SIZE * 0.84}" y2="${toY(y) + CELL_SIZE * 0.5}" stroke="#202124" stroke-width="1"/>`;
			svg += `<line x1="${toX(x) + CELL_SIZE * 0.24}" y1="${toY(y) + CELL_SIZE * 0.24}" x2="${toX(x) + CELL_SIZE * 0.76}" y2="${toY(y) + CELL_SIZE * 0.76}" stroke="#202124" stroke-width="1"/>`;
			svg += `<line x1="${toX(x) + CELL_SIZE * 0.24}" y1="${toY(y) + CELL_SIZE * 0.76}" x2="${toX(x) + CELL_SIZE * 0.76}" y2="${toY(y) + CELL_SIZE * 0.24}" stroke="#202124" stroke-width="1"/>`;
			svg += `</g>`;

			svg += `</g>`;
		}
	}

	const cursorAnim = generateChangingValuesAnimation(store, buildCursorTransformSeries(store));
	svg += `<g transform="translate(${toX(store.mouse.x) + 3} ${toY(store.mouse.y) + 3})">`;
	if (cursorAnim) {
		svg += `<animateTransform attributeName="transform" type="translate" calcMode="linear" dur="${durationMs}ms" repeatCount="indefinite" keyTimes="${cursorAnim.keyTimes}" values="${cursorAnim.values}"/>`;
	}
	svg += `<path d="M0 0 L8 4 L4 5.5 L6.3 10.5 L4.8 11.3 L2.5 6.2 L0.7 8 Z" fill="#f7f7f7" stroke="#111" stroke-width="0.8"/>`;
	svg += `</g>`;

	svg += `</svg>`;
	return svg;
};

export const SVG_KEY_TIMES_PRECISION = 4;
const generateChangingValuesAnimation = (store: MinesweeperStore, changingValues: string[]): AnimationData | null => {
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
