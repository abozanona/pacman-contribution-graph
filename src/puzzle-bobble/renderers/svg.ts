import { AnimationData } from '../../shared/types';
import { Utils } from '../../shared/utils/utils';
import {
	BUBBLE_RADIUS,
	CANNON_AREA_HEIGHT,
	CELL_SIZE,
	DELTA_TIME,
	GAP_SIZE,
	GRID_HEIGHT,
	GRID_WIDTH,
	PB_ANIM_SPEED_FACTOR,
	PB_COLORS,
	POP_BURST_FRAMES
} from '../core/constants';
import { PBStoreType } from '../types';

const SVG_PRECISION = 4;

/** Center SVG-x of grid column */
const toSvgCx = (col: number) => col * (CELL_SIZE + GAP_SIZE) + CELL_SIZE / 2;
/** Center SVG-y of grid row */
const toSvgCy = (row: number) => row * (CELL_SIZE + GAP_SIZE) + 15 + CELL_SIZE / 2;

/* ────────────────── Animation helpers ────────────────── */

interface AnimTrack {
	keyTimes: number[];
	values: string[];
}

const trackPush = (track: AnimTrack, t: number, v: string) => {
	if (track.keyTimes.length === 0 || t !== track.keyTimes[track.keyTimes.length - 1]) {
		track.keyTimes.push(t);
		track.values.push(v);
	} else {
		track.values[track.values.length - 1] = v;
	}
};

const finishTrack = (track: AnimTrack): AnimationData => {
	if (track.keyTimes[track.keyTimes.length - 1] !== 1) {
		track.keyTimes.push(1);
		track.values.push(track.values[track.values.length - 1]);
	}
	return {
		keyTimes: track.keyTimes.join(';'),
		values: track.values.join(';')
	};
};

const t = (frameIdx: number, totalFrames: number) => Number((frameIdx / Math.max(totalFrames - 1, 1)).toFixed(SVG_PRECISION));

/* ────────────────── Cell animation ────────────────── */

const getCellAnimData = (store: PBStoreType, x: number, y: number, noneColor: string): AnimationData => {
	const totalFrames = store.gameHistory.length;
	const initialColor = store.initialColors[x]?.[y] ?? noneColor;
	const events = store.cellEvents.filter((e) => e.x === x && e.y === y);

	if (events.length === 0) {
		return { keyTimes: '0;1', values: `${initialColor};${initialColor}` };
	}

	const track: AnimTrack = { keyTimes: [0], values: [initialColor] };

	for (const ev of events) {
		const ti = t(ev.frameIndex, totalFrames);
		trackPush(track, ti, ev.color);
	}

	return finishTrack(track);
};

/* ────────────────── Bubble flight tracking ────────────────── */

interface BubbleFlight {
	id: number;
	colorIndex: number;
	startFrame: number;
	endFrame: number;
	xPositions: number[];
	yPositions: number[];
}

const extractBubbleFlights = (store: PBStoreType): BubbleFlight[] => {
	const flights: BubbleFlight[] = [];
	const active = new Map<number, { colorIndex: number; startFrame: number; xs: number[]; ys: number[] }>();

	for (let f = 0; f < store.gameHistory.length; f++) {
		const ab = store.gameHistory[f].activeBubble;

		// Close flights no longer active
		for (const [id, flight] of active) {
			if (!ab || ab.id !== id) {
				flights.push({
					id,
					colorIndex: flight.colorIndex,
					startFrame: flight.startFrame,
					endFrame: f - 1,
					xPositions: flight.xs,
					yPositions: flight.ys
				});
				active.delete(id);
			}
		}

		if (ab && ab.active) {
			if (!active.has(ab.id)) {
				active.set(ab.id, { colorIndex: ab.colorIndex, startFrame: f, xs: [ab.x], ys: [ab.y] });
			} else {
				const fl = active.get(ab.id)!;
				fl.xs.push(ab.x);
				fl.ys.push(ab.y);
			}
		}
	}

	for (const [id, flight] of active) {
		flights.push({
			id,
			colorIndex: flight.colorIndex,
			startFrame: flight.startFrame,
			endFrame: store.gameHistory.length - 1,
			xPositions: flight.xs,
			yPositions: flight.ys
		});
	}

	return flights;
};

/* ────────────────── Main SVG generator ────────────────── */

const generateAnimatedSVG = (store: PBStoreType): string => {
	const svgWidth = GRID_WIDTH * (CELL_SIZE + GAP_SIZE);
	const svgHeight = GRID_HEIGHT * (CELL_SIZE + GAP_SIZE) + 15 + CANNON_AREA_HEIGHT;

	const totalFrames = store.gameHistory.length;
	const totalDurationMs = Math.max((totalFrames * DELTA_TIME) / PB_ANIM_SPEED_FACTOR, 1000);
	const dur = `${totalDurationMs}ms`;

	const theme = Utils.getCurrentTheme(store);
	const noneColor = theme.intensityColors[0];

	// SVG canvas
	let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
	svg += `<desc>Generated with puzzle-bobble-contribution-graph on ${new Date()}</desc>`;

	// Background
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

	// ── Grid cells as circles (bubbles) ──────────────────────────────────
	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			const cx = toSvgCx(x);
			const cy = toSvgCy(y);
			const anim = getCellAnimData(store, x, y, noneColor);
			svg += `<circle cx="${cx}" cy="${cy}" r="${BUBBLE_RADIUS}" fill="${noneColor}">
				<animate attributeName="fill" calcMode="discrete" dur="${dur}" repeatCount="indefinite"
					values="${anim.values}" keyTimes="${anim.keyTimes}"/>
			</circle>`;
		}
	}

	// ── Flying bubbles (shots from cannon) ───────────────────────────────
	if (totalFrames >= 2) {
		const flights = extractBubbleFlights(store);
		for (const flight of flights) {
			const tStart = Number((flight.startFrame / (totalFrames - 1)).toFixed(SVG_PRECISION));
			const tEnd = Number((Math.min(flight.endFrame + 1, totalFrames - 1) / (totalFrames - 1)).toFixed(SVG_PRECISION));
			const color = (PB_COLORS[flight.colorIndex] ?? PB_COLORS[0]) as string;

			// Opacity (discrete)
			let opKt: string, opVals: string;
			if (tStart <= 0 && tEnd >= 1) {
				opKt = '0;1';
				opVals = '1;1';
			} else if (tStart <= 0) {
				opKt = `0;${tEnd};${tEnd};1`;
				opVals = '1;1;0;0';
			} else if (tEnd >= 1) {
				opKt = `0;${tStart};${tStart};1`;
				opVals = '0;0;1;1';
			} else {
				opKt = `0;${tStart};${tStart};${tEnd};${tEnd};1`;
				opVals = '0;0;1;1;0;0';
			}

			// Position keyTimes/values (linear)
			const posKts: number[] = [];
			const posVals: string[] = [];

			const firstX = flight.xPositions[0].toFixed(1);
			const firstY = flight.yPositions[0].toFixed(1);
			if (flight.startFrame > 0) {
				posKts.push(0);
				posVals.push(`${firstX},${firstY}`);
			}
			for (let i = 0; i < flight.xPositions.length; i++) {
				const fi = flight.startFrame + i;
				const ti = Number((fi / (totalFrames - 1)).toFixed(SVG_PRECISION));
				const px = flight.xPositions[i].toFixed(1);
				const py = flight.yPositions[i].toFixed(1);
				if (posKts.length === 0 || ti !== posKts[posKts.length - 1]) {
					posKts.push(ti);
					posVals.push(`${px},${py}`);
				}
			}
			if (posKts[posKts.length - 1] !== 1) {
				const lx = flight.xPositions[flight.xPositions.length - 1].toFixed(1);
				const ly = flight.yPositions[flight.yPositions.length - 1].toFixed(1);
				posKts.push(1);
				posVals.push(`${lx},${ly}`);
			}

			svg += `<circle cx="0" cy="0" r="${BUBBLE_RADIUS}" fill="${color}" opacity="0" stroke="white" stroke-width="1" stroke-opacity="0.4">
				<animate attributeName="opacity" calcMode="discrete" dur="${dur}" repeatCount="indefinite"
					keyTimes="${opKt}" values="${opVals}"/>
				<animateTransform attributeName="transform" type="translate" calcMode="linear"
					dur="${dur}" repeatCount="indefinite"
					keyTimes="${posKts.join(';')}" values="${posVals.join(';')}"/>
			</circle>`;
		}
	}

	// ── Pop burst effects ────────────────────────────────────────────────
	if (totalFrames >= 2) {
		for (const pop of store.popEvents) {
			const tS = Number((pop.frameIndex / (totalFrames - 1)).toFixed(SVG_PRECISION));
			const tE = Number((Math.min(pop.frameIndex + POP_BURST_FRAMES, totalFrames - 1) / (totalFrames - 1)).toFixed(SVG_PRECISION));
			if (tE <= tS) continue;
			const kt = `0;${tS};${tS};${tE};1`;
			const opVals = `0;0;1;0;0`;

			for (const { x, y } of pop.cells) {
				const cx = toSvgCx(x).toFixed(1);
				const cy = toSvgCy(y).toFixed(1);
				// Expanding ring
				svg += `<circle cx="${cx}" cy="${cy}" r="4" fill="none" stroke="${pop.color}" stroke-width="2" opacity="0">
					<animate attributeName="r"            calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="4;4;4;${CELL_SIZE};${CELL_SIZE}"/>
					<animate attributeName="stroke-width" calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="2;2;2;0;0"/>
					<animate attributeName="opacity"      calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${opVals}"/>
				</circle>`;
			}
		}
	}

	// ── Cannon ────────────────────────────────────────────────────────────
	if (totalFrames >= 2) {
		const gridBottomY = GRID_HEIGHT * (CELL_SIZE + GAP_SIZE) + 15;
		const cannonCx = (svgWidth / 2).toFixed(1);
		const cannonCy = (gridBottomY + 30).toFixed(1);

		// Barrel: a line rotated by cannon angle
		// Collect angle keyTimes/values
		const cannonTrack: AnimTrack = { keyTimes: [], values: [] };
		for (let f = 0; f < store.gameHistory.length; f++) {
			const ti = t(f, totalFrames);
			const angleDeg = store.gameHistory[f].cannon.angleDeg;
			// SVG rotation: 0° = right, so we rotate from 90°-angleDeg
			const svgRot = (90 - angleDeg).toFixed(1);
			trackPush(cannonTrack, ti, `${svgRot} ${cannonCx} ${cannonCy}`);
		}
		const cannonAnim = finishTrack(cannonTrack);

		const barrelLen = 22;
		const bx2 = Number(cannonCx);
		const by1 = Number(cannonCy);
		const by2 = by1 - barrelLen;

		// Base circle — fill animates to match current bubble color
		const baseColorTrack: AnimTrack = { keyTimes: [], values: [] };
		for (let f = 0; f < store.gameHistory.length; f++) {
			const ti = t(f, totalFrames);
			const ci = store.gameHistory[f].currentBubbleColorIndex;
			trackPush(baseColorTrack, ti, (PB_COLORS[ci] ?? PB_COLORS[0]) as string);
		}
		const baseColorAnim = finishTrack(baseColorTrack);
		const baseInitColor = (PB_COLORS[store.gameHistory[0]?.currentBubbleColorIndex ?? 0] ?? PB_COLORS[0]) as string;
		svg += `<circle cx="${cannonCx}" cy="${cannonCy}" r="10" fill="${baseInitColor}" stroke="white" stroke-width="2">
			<animate attributeName="fill" calcMode="discrete" dur="${dur}" repeatCount="indefinite"
				values="${baseColorAnim.values}" keyTimes="${baseColorAnim.keyTimes}"/>
			<animateTransform attributeName="transform" type="rotate" calcMode="linear"
				dur="${dur}" repeatCount="indefinite"
				keyTimes="${cannonAnim.keyTimes}" values="${cannonAnim.values}"/>
		</circle>`;

		// Barrel (rotates with linear interpolation so the sweep is visible)
		svg += `<line x1="${bx2}" y1="${by1}" x2="${bx2}" y2="${by2}" stroke="#cccccc" stroke-width="6" stroke-linecap="round">
			<animateTransform attributeName="transform" type="rotate" calcMode="linear"
				dur="${dur}" repeatCount="indefinite"
				keyTimes="${cannonAnim.keyTimes}" values="${cannonAnim.values}"/>
		</line>`;

		// ── Next bubble indicator ────────────────────────────────────────
		const nextTrack: AnimTrack = { keyTimes: [], values: [] };
		for (let f = 0; f < store.gameHistory.length; f++) {
			const ti = t(f, totalFrames);
			const nci = store.gameHistory[f].nextBubbleColorIndex;
			trackPush(nextTrack, ti, (PB_COLORS[nci] ?? PB_COLORS[0]) as string);
		}
		const nextAnim = finishTrack(nextTrack);
		const nextCx = (Number(cannonCx) + 28).toFixed(1);
		const nextCy = cannonCy;
		const nextInitColor = (PB_COLORS[store.gameHistory[0]?.nextBubbleColorIndex ?? 0] ?? PB_COLORS[0]) as string;
		svg += `<text x="${nextCx}" y="${(Number(cannonCy) - 16).toFixed(1)}" text-anchor="middle" font-size="8" fill="${theme.textColor}" opacity="0.8">NEXT</text>`;
		svg += `<circle cx="${nextCx}" cy="${nextCy}" r="${BUBBLE_RADIUS}" fill="${nextInitColor}" stroke="white" stroke-width="1" stroke-opacity="0.5">
			<animate attributeName="fill" calcMode="discrete" dur="${dur}" repeatCount="indefinite"
				values="${nextAnim.values}" keyTimes="${nextAnim.keyTimes}"/>
		</circle>`;
	}

	svg += '</svg>';
	return svg;
};

export const PuzzleBobblesVG = { generateAnimatedSVG };
