import { AnimationData } from '../../shared/types';
import { Utils } from '../../shared/utils/utils';
import {
	BULLET_IMAGE_DATA,
	CELL_SIZE,
	DELTA_TIME,
	EXPLOSION_FRAMES,
	GAP_SIZE,
	GRID_HEIGHT,
	GRID_WIDTH,
	SHIP_IMAGE_DATA,
	SHIP_Y
} from '../core/constants';
import { GalagaStoreType } from '../types';

const SVG_PRECISION = 4;

/** Convert a grid-unit x coordinate to SVG pixels */
const toSvgX = (gx: number) => gx * (CELL_SIZE + GAP_SIZE);
/** Convert a grid-unit y coordinate to SVG pixels (offset by month-label area) */
const toSvgY = (gy: number) => gy * (CELL_SIZE + GAP_SIZE) + 15;

/* ────────────────── Bullet flight tracking ────────────────── */

interface BulletFlight {
	id: number;
	x: number; // column center x in grid units (constant)
	startFrame: number;
	endFrame: number;
	yPositions: number[]; // grid-unit y per frame in [startFrame, endFrame]
}

/**
 * Extract individual bullet trajectories from the game history.
 * Bullets are matched across frames by their unique `id`.
 */
const extractBulletFlights = (store: GalagaStoreType): BulletFlight[] => {
	const flights: BulletFlight[] = [];
	const active = new Map<number, { x: number; startFrame: number; yPositions: number[] }>();

	for (let f = 0; f < store.gameHistory.length; f++) {
		const bullets = store.gameHistory[f].bullets.filter((b) => b.active);
		const currentIds = new Set(bullets.map((b) => b.id));

		// Bullets no longer present → close their flights
		for (const [id, flight] of active) {
			if (!currentIds.has(id)) {
				flights.push({
					id,
					x: flight.x,
					startFrame: flight.startFrame,
					endFrame: f - 1,
					yPositions: flight.yPositions
				});
				active.delete(id);
			}
		}

		// New bullets → open flights
		for (const bullet of bullets) {
			if (!active.has(bullet.id)) {
				active.set(bullet.id, { x: bullet.x, startFrame: f, yPositions: [bullet.y] });
			} else {
				active.get(bullet.id)!.yPositions.push(bullet.y);
			}
		}
	}

	// Flush any flights still open at end
	for (const [id, flight] of active) {
		flights.push({
			id,
			x: flight.x,
			startFrame: flight.startFrame,
			endFrame: store.gameHistory.length - 1,
			yPositions: flight.yPositions
		});
	}

	return flights;
};

/* ────────────────── Main SVG generator ────────────────── */

const generateAnimatedSVG = (store: GalagaStoreType): string => {
	const svgWidth = GRID_WIDTH * (CELL_SIZE + GAP_SIZE);
	const shipAreaHeight = 90;
	const svgHeight = GRID_HEIGHT * (CELL_SIZE + GAP_SIZE) + 15 + shipAreaHeight;

	const totalFrames = store.gameHistory.length;
	const totalDurationMs = Math.max((totalFrames * DELTA_TIME) / 2, 1000);

	const theme = Utils.getCurrentTheme(store);
	const shipSvgY = toSvgY(SHIP_Y);

	let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
	svg += `<desc>Generated with galaga-contribution-graph on ${new Date()}</desc>`;
	svg += `<rect width="100%" height="100%" fill="#000000"/>`;

	// ── Galaxy starfield ──────────────────────────────────────────────────
	{
		let starSeed = 12345;
		const starRng = () => {
			starSeed = (starSeed * 1664525 + 1013904223) >>> 0;
			return starSeed / 0xffffffff;
		};
		for (let i = 0; i < 120; i++) {
			const scx = (starRng() * svgWidth).toFixed(1);
			const sr = (0.4 + starRng() * 1.6).toFixed(1);
			const sop = (0.3 + starRng() * 0.7).toFixed(2);
			const spd = Math.floor(2500 + starRng() * 5500);
			const sph = Math.floor(starRng() * spd);
			svg += `<circle cx="${scx}" cy="0" r="${sr}" fill="white" opacity="${sop}"><animate attributeName="cy" from="-2" to="${svgHeight + 2}" dur="${spd}ms" begin="-${sph}ms" repeatCount="indefinite"/></circle>`;
		}
	}

	// ── Month labels ─────────────────────────────────────────────────────
	if (store.config.showMonthLabels !== false) {
		let lastMonth = '';
		for (let x = 0; x < GRID_WIDTH; x++) {
			if (store.monthLabels[x] !== lastMonth) {
				const xPos = x * (CELL_SIZE + GAP_SIZE) + CELL_SIZE / 2;
				svg += `<text x="${xPos}" y="10" text-anchor="middle" font-size="10" fill="#aaaaaa">${store.monthLabels[x]}</text>`;
				lastMonth = store.monthLabels[x];
			}
		}
	}

	// ── Grid cells (enemy formation) ─────────────────────────────────────
	const noneColor = theme.intensityColors[0];
	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			const cellX = toSvgX(x);
			const cellY = toSvgY(y);
			const colorAnim = getCellAnimationData(store, x, y);
			const cellValues = colorAnim.values
				.split(';')
				.map((c) => (c === noneColor ? 'transparent' : c))
				.join(';');
			svg += `<rect x="${cellX}" y="${cellY}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="3" fill="transparent">
				<animate attributeName="fill" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite"
					values="${cellValues}" keyTimes="${colorAnim.keyTimes}"/>
			</rect>`;
		}
	}

	// ── Bullets ───────────────────────────────────────────────────────────
	if (totalFrames >= 2) {
		const flights = extractBulletFlights(store);
		for (const flight of flights) {
			const svgX = toSvgX(flight.x);
			const tStart = Number((flight.startFrame / (totalFrames - 1)).toFixed(SVG_PRECISION));
			const tEndNext = Number((Math.min(flight.endFrame + 1, totalFrames - 1) / (totalFrames - 1)).toFixed(SVG_PRECISION));

			// Build opacity keyTimes/values (discrete: 0 outside flight, 1 inside)
			let opKeyTimes: string, opValues: string;
			if (tStart <= 0 && tEndNext >= 1) {
				opKeyTimes = '0;1';
				opValues = '1;1';
			} else if (tStart <= 0) {
				opKeyTimes = `0;${tEndNext};${tEndNext};1`;
				opValues = `1;1;0;0`;
			} else if (tEndNext >= 1) {
				opKeyTimes = `0;${tStart};${tStart};1`;
				opValues = `0;0;1;1`;
			} else {
				opKeyTimes = `0;${tStart};${tStart};${tEndNext};${tEndNext};1`;
				opValues = `0;0;1;1;0;0`;
			}

			// Build position keyTimes/values (compact, only records changes)
			const posKeyTimes: number[] = [];
			const posValues: string[] = [];

			const firstSvgY = toSvgY(flight.yPositions[0]).toFixed(1);
			const lastSvgY = toSvgY(flight.yPositions[flight.yPositions.length - 1]).toFixed(1);

			if (flight.startFrame > 0) {
				posKeyTimes.push(0);
				posValues.push(`${svgX.toFixed(1)},${firstSvgY}`);
			}

			for (let i = 0; i < flight.yPositions.length; i++) {
				const frameIdx = flight.startFrame + i;
				const t = Number((frameIdx / (totalFrames - 1)).toFixed(SVG_PRECISION));
				const svgY = toSvgY(flight.yPositions[i]).toFixed(1);
				if (posKeyTimes.length === 0 || t !== posKeyTimes[posKeyTimes.length - 1]) {
					posKeyTimes.push(t);
					posValues.push(`${svgX.toFixed(1)},${svgY}`);
				}
			}

			if (posKeyTimes[posKeyTimes.length - 1] !== 1) {
				posKeyTimes.push(1);
				posValues.push(`${svgX.toFixed(1)},${lastSvgY}`);
			}

			// Bullet image: 16x20px, centered on bullet x, top at y=0
			svg += `<image x="-5" y="-13" width="10" height="13" href="${BULLET_IMAGE_DATA}" opacity="0" preserveAspectRatio="xMidYMid meet">
				<animate attributeName="opacity" calcMode="discrete" dur="${totalDurationMs}ms" repeatCount="indefinite"
					keyTimes="${opKeyTimes}" values="${opValues}"/>
				<animateTransform attributeName="transform" type="translate" calcMode="linear"
					dur="${totalDurationMs}ms" repeatCount="indefinite"
					keyTimes="${posKeyTimes.join(';')}" values="${posValues.join(';')}"/>
			</image>`;
		}
	}

	// ── Explosions ────────────────────────────────────────────────────────
	if (totalFrames >= 2) {
		for (const exp of store.explosionEvents) {
			const cx = (toSvgX(exp.x) + CELL_SIZE / 2).toFixed(1);
			const cy = (toSvgY(exp.y) + CELL_SIZE / 2).toFixed(1);
			const tS = Number((exp.frameIndex / (totalFrames - 1)).toFixed(SVG_PRECISION));
			const tE = Number((Math.min(exp.frameIndex + EXPLOSION_FRAMES, totalFrames - 1) / (totalFrames - 1)).toFixed(SVG_PRECISION));
			if (tE <= tS) continue;

			// keyTimes with a duplicate at tS so opacity jumps in (no pre-fade)
			const kt = `0;${tS};${tS};${tE};1`;
			const opVals = `0;0;1;0;0`;
			const dur = `${totalDurationMs}ms`;

			// Expanding ring
			svg += `<circle cx="${cx}" cy="${cy}" r="2" fill="none" stroke="${exp.color}" stroke-width="3" opacity="0">
				<animate attributeName="r"            calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="2;2;2;${CELL_SIZE};${CELL_SIZE}"/>
				<animate attributeName="stroke-width" calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="3;3;3;0;0"/>
				<animate attributeName="opacity"      calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${opVals}"/>
			</circle>`;

			// 4 sparks flying outward
			const sparks = [
				{ dx: 0, dy: -11 },
				{ dx: 0, dy: 11 },
				{ dx: -11, dy: 0 },
				{ dx: 11, dy: 0 }
			];
			for (const { dx, dy } of sparks) {
				const tx = (Number(cx) + dx).toFixed(1);
				const ty = (Number(cy) + dy).toFixed(1);
				svg += `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${exp.color}" opacity="0">
					<animate attributeName="cx"      calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${cx};${cx};${cx};${tx};${tx}"/>
					<animate attributeName="cy"      calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${cy};${cy};${cy};${ty};${ty}"/>
					<animate attributeName="r"       calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="2.5;2.5;2.5;0;0"/>
					<animate attributeName="opacity" calcMode="linear" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${opVals}"/>
				</circle>`;
			}
		}
	}

	// ── Ship ──────────────────────────────────────────────────────────────
	const shipPositions = store.gameHistory.map((f) => {
		const sx = toSvgX(f.ship.x);
		return `${sx.toFixed(1)},${shipSvgY.toFixed(1)}`;
	});
	const shipAnim = buildChangingValuesAnimation(store, shipPositions);

	svg += `<image x="-16" y="-35" width="32" height="35" href="${SHIP_IMAGE_DATA}" preserveAspectRatio="xMidYMid meet">
		<animateTransform attributeName="transform" type="translate" calcMode="linear"
			dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${shipAnim.keyTimes}"
			values="${shipAnim.values}"/>
	</image>`;

	svg += '</svg>';
	return svg;
};

/* ────────────────── Animation helpers ────────────────── */

const getCellAnimationData = (store: GalagaStoreType, x: number, y: number): AnimationData => {
	const totalFrames = store.gameHistory.length;
	const initialColor = store.initialColors[x]?.[y] ?? '#ebedf0';
	const events = store.cellEvents.filter((e) => e.x === x && e.y === y);

	if (events.length === 0) {
		return { keyTimes: '0;1', values: `${initialColor};${initialColor}` };
	}

	const kTimes: number[] = [0];
	const kValues: string[] = [initialColor];

	for (const ev of events) {
		const t = Number((ev.frameIndex / Math.max(totalFrames - 1, 1)).toFixed(SVG_PRECISION));
		if (t !== kTimes[kTimes.length - 1]) {
			kTimes.push(t);
			kValues.push(ev.color);
		} else {
			kValues[kValues.length - 1] = ev.color;
		}
	}

	if (kTimes[kTimes.length - 1] !== 1) {
		kTimes.push(1);
		kValues.push(kValues[kValues.length - 1]);
	}

	return { keyTimes: kTimes.join(';'), values: kValues.join(';') };
};

const buildChangingValuesAnimation = (store: GalagaStoreType, values: string[]): AnimationData => {
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

export const GalagaSVG = { generateAnimatedSVG };
