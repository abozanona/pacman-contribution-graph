import { AnimationData } from '../../shared/types';
import { Utils } from '../../shared/utils/utils';
import {
	BALL_RADIUS,
	BALL_SHADOW_COLOR,
	CELL_SIZE,
	DELTA_TIME,
	GAP_SIZE,
	GRID_HEIGHT,
	GRID_WIDTH,
	PADDLE_HEIGHT,
	PADDLE_WIDTH,
	PADDLE_Y
} from '../core/constants';
import { BreakoutStoreType } from '../types';

const SVG_PRECISION = 4;

/** Convert a grid-unit x coordinate to SVG pixels */
const toSvgX = (gx: number) => gx * (CELL_SIZE + GAP_SIZE);
/** Convert a grid-unit y coordinate to SVG pixels (offset by month-label area) */
const toSvgY = (gy: number) => gy * (CELL_SIZE + GAP_SIZE) + 15;

const generateAnimatedSVG = (store: BreakoutStoreType): string => {
	const svgWidth = GRID_WIDTH * (CELL_SIZE + GAP_SIZE);
	// Extra height: 15px month labels + grid + 40px paddle area
	const paddleAreaHeight = 40;
	const svgHeight = GRID_HEIGHT * (CELL_SIZE + GAP_SIZE) + 15 + paddleAreaHeight;
	const totalDurationMs = (store.gameHistory.length * DELTA_TIME) / 2;

	const theme = Utils.getCurrentTheme(store);

	let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
	svg += `<desc>Generated with breakout-contribution-graph on ${new Date()}</desc>`;
	svg += `<metadata>
		<info>
			<frames>${store.gameHistory.length}</frames>
			<frameRate>${1000 / DELTA_TIME}</frameRate>
			<durationMs>${totalDurationMs}</durationMs>
			<generatedOn>${new Date().toISOString()}</generatedOn>
		</info>
	</metadata>`;
	svg += `<rect width="100%" height="100%" fill="${theme.gridBackground}"/>`;

	// ── Month labels ─────────────────────────────────────────────────────
	if (store.config.showMonthLabels !== false) {
		let lastMonth = '';
		for (let x = 0; x < GRID_WIDTH; x++) {
			if (store.monthLabels[x] !== lastMonth) {
				const xPos = x * (CELL_SIZE + GAP_SIZE) + CELL_SIZE / 2;
				svg += `<text x="${xPos}" y="10" text-anchor="middle" font-size="10" fill="${theme.textColor}">${store.monthLabels[x]}</text>`;
				lastMonth = store.monthLabels[x];
			}
		}
	}

	// ── Grid cells (bricks) ───────────────────────────────────────────────
	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			const cellX = toSvgX(x);
			const cellY = toSvgY(y);
			const colorAnim = getCellAnimationData(store, x, y);
			svg += `<rect id="c-${x}-${y}" x="${cellX}" y="${cellY}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="3" fill="${theme.intensityColors[0]}">
				<animate attributeName="fill" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite"
					values="${colorAnim.values}" keyTimes="${colorAnim.keyTimes}"/>
			</rect>`;
		}
	}

	// ── Ball ──────────────────────────────────────────────────────────────
	const ballR = Math.round(BALL_RADIUS * (CELL_SIZE + GAP_SIZE));
	const ballPosAnim = buildChangingValuesAnimation(store, getBallPositions(store));

	// cx/cy are 0 so animateTransform translate values are absolute SVG coords
	svg += `<circle id="ball" cx="0" cy="0" r="${ballR}" fill="${theme.wallColor}" stroke="${BALL_SHADOW_COLOR}" stroke-width="1">
		<animateTransform attributeName="transform" type="translate"
			calcMode="linear"
			dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${ballPosAnim.keyTimes}"
			values="${ballPosAnim.values}"/>
	</circle>`;

	// ── Paddle ────────────────────────────────────────────────────────────
	const paddleSvgY = toSvgY(PADDLE_Y);
	const paddleW = Math.round(PADDLE_WIDTH * (CELL_SIZE + GAP_SIZE) - GAP_SIZE);
	const paddleH = Math.round(PADDLE_HEIGHT * (CELL_SIZE + GAP_SIZE));
	const paddlePosAnim = buildChangingValuesAnimation(store, getPaddlePositions(store));

	// x=0 so animateTransform translate values drive the horizontal position
	svg += `<rect id="paddle" x="0" y="${paddleSvgY}" width="${paddleW}" height="${paddleH}" rx="3" fill="${theme.wallColor}">
		<animateTransform attributeName="transform" type="translate"
			calcMode="linear"
			dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${paddlePosAnim.keyTimes}"
			values="${paddlePosAnim.values}"/>
	</rect>`;

	svg += '</svg>';
	return svg;
};

/* ────────────────── Animation helpers ────────────────── */

/**
 * Build cell color animation data directly from brickEvents.
 * Much cheaper than per-frame grid snapshots: only records actual changes.
 */
const getCellAnimationData = (store: BreakoutStoreType, x: number, y: number): AnimationData => {
	const totalFrames = store.gameHistory.length;
	const initialColor = store.initialColors[x]?.[y] ?? '#ebedf0';
	const events = store.brickEvents.filter((e) => e.x === x && e.y === y);

	if (events.length === 0) {
		return { keyTimes: '0;1', values: `${initialColor};${initialColor}` };
	}

	const kTimes: number[] = [0];
	const kValues: string[] = [initialColor];

	for (const ev of events) {
		const t = Number((ev.frameIndex / Math.max(totalFrames - 1, 1)).toFixed(SVG_PRECISION));
		// Avoid duplicate keyTimes (two events in the same frame)
		if (t !== kTimes[kTimes.length - 1]) {
			kTimes.push(t);
			kValues.push(ev.color);
		} else {
			kValues[kValues.length - 1] = ev.color; // overwrite same-frame event
		}
	}

	if (kTimes[kTimes.length - 1] !== 1) {
		kTimes.push(1);
		kValues.push(kValues[kValues.length - 1]);
	}

	return { keyTimes: kTimes.join(';'), values: kValues.join(';') };
};

const getBallPositions = (store: BreakoutStoreType): string[] =>
	store.gameHistory.map((frame) => {
		const svgX = toSvgX(frame.ball.x);
		const svgY = toSvgY(frame.ball.y);
		return `${svgX},${svgY}`;
	});

const getPaddlePositions = (store: BreakoutStoreType): string[] => store.gameHistory.map((frame) => `${toSvgX(frame.paddle.x)},0`);

/**
 * Compresses an array of per-frame values into a compact SVG animation
 * (keyTimes + values), skipping redundant frames.
 */
const buildChangingValuesAnimation = (store: BreakoutStoreType, values: string[]): AnimationData => {
	const totalFrames = store.gameHistory.length;
	if (totalFrames === 0) {
		const v = values[0] ?? '0,0';
		return { keyTimes: '0;1', values: `${v};${v}` };
	}

	const keyTimes: number[] = [];
	const keyValues: string[] = [];
	let lastValue: string | null = null;
	let lastIndex: number | null = null;

	values.forEach((curr, idx) => {
		if (curr !== lastValue) {
			if (lastValue !== null && lastIndex !== null && idx - 1 !== lastIndex) {
				keyTimes.push(Number(((idx - 1) / (totalFrames - 1)).toFixed(SVG_PRECISION)));
				keyValues.push(lastValue);
			}
			keyTimes.push(Number((idx / (totalFrames - 1)).toFixed(SVG_PRECISION)));
			keyValues.push(curr);
			lastValue = curr;
			lastIndex = idx;
		}
	});

	if (keyTimes.length === 0 || keyTimes[keyTimes.length - 1] !== 1) {
		if (keyTimes.length === 0) {
			keyTimes.push(0, 1);
			keyValues.push(values[0] ?? '0,0', values[values.length - 1] ?? '0,0');
		} else {
			keyTimes.push(1);
			keyValues.push(lastValue ?? values[values.length - 1] ?? '0,0');
		}
	}

	return { keyTimes: keyTimes.join(';'), values: keyValues.join(';') };
};

export const BreakoutSVG = { generateAnimatedSVG };
