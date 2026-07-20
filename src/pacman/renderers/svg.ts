import { CELL_SIZE, DELTA_TIME, GAP_SIZE, GHOSTS, GRID_HEIGHT, GRID_WIDTH, PACMAN_COLOR, WALLS } from '../core/constants';
import { AnimationData, GhostName, StoreType } from '../types';
import { Utils } from '../../shared/utils/utils';
import { RendererUnits } from './renderer-units';

const SVG_KEY_TIMES_PRECISION = 4;

const generateAnimatedSVG = (store: StoreType) => {
	const svgWidth = GRID_WIDTH * (CELL_SIZE + GAP_SIZE);
	const svgHeight = GRID_HEIGHT * (CELL_SIZE + GAP_SIZE) + 30;
	const totalDurationMs = store.gameHistory.length * DELTA_TIME;
	const animationDurationMs = Math.max(totalDurationMs, DELTA_TIME);

	let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
	svg += `<desc>Generated with pacman-contribution-graph on ${new Date()}</desc>`;
	svg += `<metadata>
		<info>
			<frames>${store.gameHistory.length}</frames>
			<frameRate>${1000 / DELTA_TIME}</frameRate>
			<durationMs>${totalDurationMs}</durationMs>
			<generatedOn>${new Date().toISOString()}</generatedOn>
		</info>
	</metadata>`;
	svg += `<rect width="100%" height="100%" fill="${Utils.getCurrentTheme(store).gridBackground}"/>`;

	svg += generateGhostsPredefinition();

	let lastMonth = '';
	for (let y = 0; y < GRID_WIDTH; y++) {
		if (store.monthLabels[y] !== lastMonth) {
			const xPos = y * (CELL_SIZE + GAP_SIZE) + CELL_SIZE / 2;
			svg += `<text x="${xPos}" y="10" text-anchor="middle" font-size="10" fill="${Utils.getCurrentTheme(store).textColor}">${store.monthLabels[y]}</text>`;
			lastMonth = store.monthLabels[y];
		}
	}

	// Grid
	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			const cellX = x * (CELL_SIZE + GAP_SIZE);
			const cellY = y * (CELL_SIZE + GAP_SIZE) + 15;
			const cellColorAnimation = getCellAnimationData(store, x, y);
			svg += `<rect id="c-${x}-${y}" x="${cellX}" y="${cellY}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="5" fill="${Utils.getCurrentTheme(store).intensityColors[0]}">
				<animate attributeName="fill" dur="${animationDurationMs}ms" repeatCount="indefinite" calcMode="discrete"
					values="${cellColorAnimation.values}" 
					keyTimes="${cellColorAnimation.keyTimes}"/>
			</rect>`;
		}
	}

	// Horizontal walls
	for (let y = 0; y < GRID_HEIGHT; y++) {
		let runStart = null;
		for (let x = 0; x <= GRID_WIDTH; x++) {
			let active = x < GRID_WIDTH && WALLS.horizontal[x][y].active;
			if (active && runStart === null) {
				runStart = x;
			}
			if ((!active || x === GRID_WIDTH) && runStart !== null) {
				let length = x - runStart;
				svg += `<rect id="wh-${runStart}-${y}" x="${runStart * (CELL_SIZE + GAP_SIZE) - GAP_SIZE}" y="${y * (CELL_SIZE + GAP_SIZE) - GAP_SIZE + 15}" width="${length * (CELL_SIZE + GAP_SIZE)}" height="${GAP_SIZE}" fill="${Utils.getCurrentTheme(store).wallColor}"></rect>`;
				runStart = null;
			}
		}
	}

	// Vertical walls
	for (let x = 0; x < GRID_WIDTH; x++) {
		let runStart = null;
		for (let y = 0; y <= GRID_HEIGHT; y++) {
			let active = y < GRID_HEIGHT && WALLS.vertical[x][y].active;
			if (active && runStart === null) {
				runStart = y;
			}
			if ((!active || y === GRID_HEIGHT) && runStart !== null) {
				let length = y - runStart;
				svg += `<rect id="wv-${x}-${runStart}" x="${x * (CELL_SIZE + GAP_SIZE) - GAP_SIZE}" y="${runStart * (CELL_SIZE + GAP_SIZE) - GAP_SIZE + 15}" width="${GAP_SIZE}" height="${length * (CELL_SIZE + GAP_SIZE)}" fill="${Utils.getCurrentTheme(store).wallColor}"></rect>`;
				runStart = null;
			}
		}
	}

	// Pacman
	const pacmanColorAnimation = generateChangingValuesAnimation(
		store,
		store.gameHistory.map((el) => RendererUnits.generatePacManColors(el.pacman)),
		RendererUnits.generatePacManColors(store.pacman)
	);
	const pacmanPositionAnimation = generateChangingValuesAnimation(
		store,
		generatePacManPositions(store),
		generatePacManPosition(store.pacman)
	);
	const pacmanRotationAnimation = generateChangingValuesAnimation(
		store,
		generatePacManRotations(store),
		generatePacManRotation(store.pacman.direction)
	);
	svg += `<path id="pacman" d="${generatePacManPath(0.55)}" fill="${PACMAN_COLOR}">
		<animate attributeName="fill" dur="${animationDurationMs}ms" repeatCount="indefinite"
			keyTimes="${pacmanColorAnimation.keyTimes}"
			values="${pacmanColorAnimation.values}"/>
		<animateTransform attributeName="transform" type="translate" dur="${animationDurationMs}ms" repeatCount="indefinite"
			keyTimes="${pacmanPositionAnimation.keyTimes}"
			values="${pacmanPositionAnimation.values}"
			additive="sum"/>
		<animateTransform attributeName="transform" type="rotate" dur="${animationDurationMs}ms" repeatCount="indefinite"
			keyTimes="${pacmanRotationAnimation.keyTimes}"
			values="${pacmanRotationAnimation.values}"
			calcMode="discrete"
			additive="sum"/>
		<animate attributeName="d" dur="0.5s" repeatCount="indefinite"
			values="${generatePacManPath(0.55)};${generatePacManPath(0.05)};${generatePacManPath(0.55)}"/>
	</path>`;

	store.ghosts.forEach((ghost, index) => {
		const ghostPositionAnimation = generateChangingValuesAnimation(
			store,
			generateGhostPositions(store, index),
			generateGhostPosition(ghost)
		);

		svg += `<g id="ghost${index}" transform="translate(0,0)">
			<animateTransform attributeName="transform" type="translate" 
				dur="${animationDurationMs}ms" repeatCount="indefinite"
				keyTimes="${ghostPositionAnimation.keyTimes}"
				values="${ghostPositionAnimation.values}"
				additive="replace"/>`;

		const stateChanges = mapGhostStateChanges(store, index);

		for (const [state, keyframes] of Object.entries(stateChanges)) {
			if (keyframes.length === 0) continue;

			const href = `#ghost-${state}`;

			const keyTimes = keyframes.map((kf) => kf.time.toFixed(SVG_KEY_TIMES_PRECISION)).join(';');
			const values = keyframes.map((kf) => (kf.visible ? 'visible' : 'hidden')).join(';');

			const initialVisibility = keyframes[0].visible ? 'visible' : 'hidden';

			svg += `<use href="${href}" width="${CELL_SIZE}" height="${CELL_SIZE}" visibility="${initialVisibility}">
				<animate attributeName="visibility" 
					dur="${animationDurationMs}ms" repeatCount="indefinite"
					keyTimes="${keyTimes}"
					values="${values}" />
			</use>`;
		}

		svg += `</g>`;
	});

	svg += '</svg>';
	return svg;
};

function mapGhostStateChanges(store: StoreType, ghostIndex: number) {
	// Maps each "name-direction" / "scared" / "eyes-direction" state to an array
	// of visibility keyframes, so each state can be shown/hidden independently.
	const stateChanges: Record<string, { time: number; visible: boolean }[]> = {};

	const allPossibleStates = [
		'blinky-up',
		'blinky-down',
		'blinky-left',
		'blinky-right',
		'inky-up',
		'inky-down',
		'inky-left',
		'inky-right',
		'pinky-up',
		'pinky-down',
		'pinky-left',
		'pinky-right',
		'clyde-up',
		'clyde-down',
		'clyde-left',
		'clyde-right',
		'eyes-up',
		'eyes-down',
		'eyes-left',
		'eyes-right',
		'scared'
	];

	allPossibleStates.forEach((state) => {
		stateChanges[state] = [{ time: 0, visible: false }];
	});

	const initialGhost = store.ghosts[ghostIndex];
	if (!initialGhost) return stateChanges;

	const initialState = initialGhost.scared
		? 'scared'
		: initialGhost.name === 'eyes'
			? `eyes-${initialGhost.direction || 'right'}`
			: `${initialGhost.name}-${initialGhost.direction || 'right'}`;

	stateChanges[initialState] = [{ time: 0, visible: true }];

	let lastState = initialState;

	store.gameHistory.forEach((state, frameIndex) => {
		if (ghostIndex >= state.ghosts.length) return;

		const ghost = state.ghosts[ghostIndex];
		const currentTime = frameIndex / Math.max(store.gameHistory.length - 1, 1);

		const currentState = ghost.scared
			? 'scared'
			: ghost.name === 'eyes'
				? `eyes-${ghost.direction || 'right'}`
				: `${ghost.name}-${ghost.direction || 'right'}`;

		if (currentState !== lastState) {
			stateChanges[lastState].push({ time: currentTime, visible: false });

			if (!stateChanges[currentState]) {
				stateChanges[currentState] = [{ time: 0, visible: false }];
			}
			stateChanges[currentState].push({ time: currentTime, visible: true });

			lastState = currentState;
		}
	});

	stateChanges[lastState].push({ time: 1, visible: true });

	Object.keys(stateChanges).forEach((state) => {
		if (state !== lastState && stateChanges[state].length > 0) {
			const lastKeyframe = stateChanges[state][stateChanges[state].length - 1];
			if (lastKeyframe.time < 1) {
				stateChanges[state].push({ time: 1, visible: false });
			}
		}
	});

	return stateChanges;
}

const generatePacManPath = (mouthAngle: number) => {
	const radius = CELL_SIZE / 2;
	const startAngle = mouthAngle;
	const endAngle = 2 * Math.PI - mouthAngle;

	return `M ${radius},${radius}
            L ${radius + radius * Math.cos(startAngle)},${radius + radius * Math.sin(startAngle)}
            A ${radius},${radius} 0 1,1 ${radius + radius * Math.cos(endAngle)},${radius + radius * Math.sin(endAngle)}
            Z`;
};

const generatePacManPosition = (pacman: StoreType['pacman']): string => {
	const x = pacman.x * (CELL_SIZE + GAP_SIZE);
	const y = pacman.y * (CELL_SIZE + GAP_SIZE) + 15;
	return `${x},${y}`;
};

const generatePacManPositions = (store: StoreType): string[] => store.gameHistory.map((state) => generatePacManPosition(state.pacman));

const generatePacManRotation = (direction: StoreType['pacman']['direction']): string => {
	const pivot = CELL_SIZE / 2;
	switch (direction) {
		case 'right':
			return `0 ${pivot} ${pivot}`;
		case 'left':
			return `180 ${pivot} ${pivot}`;
		case 'up':
			return `270 ${pivot} ${pivot}`;
		case 'down':
			return `90 ${pivot} ${pivot}`;
	}
};

const generatePacManRotations = (store: StoreType): string[] => {
	// The direction stored in snapshot[i+1] is the direction taken during the slide
	// that begins at keyframe i, so shift one frame forward to keep it in sync.
	return store.gameHistory.map((_, i) => {
		const lookaheadIndex = Math.min(i + 1, store.gameHistory.length - 1);
		return generatePacManRotation(store.gameHistory[lookaheadIndex].pacman.direction);
	});
};

/** Build cell color animation data from the sparse cellEvents list. */
const getCellAnimationData = (store: StoreType, x: number, y: number): AnimationData => {
	const totalFrames = store.gameHistory.length;
	const initialColor = store.initialColors[x]?.[y] ?? Utils.getCurrentTheme(store).intensityColors[0];
	const events = store.cellEvents.filter((e) => e.x === x && e.y === y);

	if (events.length === 0) {
		return { keyTimes: '0;1', values: `${initialColor};${initialColor}` };
	}

	const kTimes: number[] = [0];
	const kValues: string[] = [initialColor];

	for (const ev of events) {
		const t = Number((ev.frameIndex / Math.max(totalFrames - 1, 1)).toFixed(SVG_KEY_TIMES_PRECISION));
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

const generateGhostPosition = (ghost: StoreType['ghosts'][number]): string => {
	const fx = ghost.x + (ghost.subX ?? 0);
	const fy = ghost.y + (ghost.subY ?? 0);
	const x = fx * (CELL_SIZE + GAP_SIZE);
	const y = fy * (CELL_SIZE + GAP_SIZE) + 15;
	return `${x},${y}`;
};

const generateGhostPositions = (store: StoreType, ghostIndex: number): string[] =>
	store.gameHistory.map((state) => (ghostIndex < state.ghosts.length ? generateGhostPosition(state.ghosts[ghostIndex]) : '0,0'));

const generateGhostsPredefinition = () => {
	let defs = `<defs>`;

	// For every regular ghost
	['blinky', 'inky', 'pinky', 'clyde'].forEach((ghostName) => {
		// For each direction
		['up', 'down', 'left', 'right'].forEach((direction) => {
			const ghostObj = GHOSTS[ghostName as GhostName] as Record<string, string>;

			if (direction in ghostObj) {
				defs += `
                <symbol id="ghost-${ghostName}-${direction}" viewBox="0 0 ${CELL_SIZE} ${CELL_SIZE}">
                    <image href="${ghostObj[direction]}" width="${CELL_SIZE}" height="${CELL_SIZE}"/>
                </symbol>
                `;
			}
		});
	});

	// Add the scared ghost
	defs += `
    <symbol id="ghost-scared" viewBox="0 0 ${CELL_SIZE} ${CELL_SIZE}">
        <image href="${(GHOSTS['scared'] as { imgDate: string }).imgDate}" width="${CELL_SIZE}" height="${CELL_SIZE}"/>
    </symbol>`;

	// Add ghost eyes (for each direction)
	['up', 'down', 'left', 'right'].forEach((direction) => {
		if (GHOSTS['eyes'] && direction in (GHOSTS['eyes'] as Record<string, string>)) {
			const eyesObj = GHOSTS['eyes'] as Record<string, string>;
			defs += `
            <symbol id="ghost-eyes-${direction}" viewBox="0 0 ${CELL_SIZE} ${CELL_SIZE}">
                <image href="${eyesObj[direction]}" width="${CELL_SIZE}" height="${CELL_SIZE}"/>
            </symbol>
            `;
		} else {
			// Fallback if direction is not set
			console.warn(`Imagem para eyes-${direction} não encontrada, usando placeholder`);
			defs += `
            <symbol id="ghost-eyes-${direction}" viewBox="0 0 ${CELL_SIZE} ${CELL_SIZE}">
                <circle cx="${CELL_SIZE / 2}" cy="${CELL_SIZE / 2}" r="${CELL_SIZE / 3}" fill="white"/>
            </symbol>
            `;
		}
	});

	defs += `</defs>`;
	return defs;
};

const generateChangingValuesAnimation = (store: StoreType, changingValues: string[], fallbackValue: string): AnimationData => {
	if (store.gameHistory.length !== changingValues.length) {
		throw new Error(
			`The amount of values (${changingValues.length}) does not match the size of the game history (${store.gameHistory.length})`
		);
	}

	const totalFrames = store.gameHistory.length;
	if (totalFrames <= 1) {
		const value = changingValues[0] ?? fallbackValue;
		return { keyTimes: '0;1', values: `${value};${value}` };
	}

	let keyTimes: number[] = [];
	let values: string[] = [];
	let lastValue: string | null = null;
	let lastIndex: number | null = null;

	changingValues.forEach((currentValue, index) => {
		if (currentValue !== lastValue) {
			if (lastValue !== null && lastIndex !== null && index - 1 !== lastIndex) {
				// Add a keyframe right before the value change
				keyTimes.push(Number(((index - 1 / (10 * SVG_KEY_TIMES_PRECISION)) / (totalFrames - 1)).toFixed(SVG_KEY_TIMES_PRECISION)));
				values.push(lastValue);
			}
			// Add the new value keyframe
			keyTimes.push(Number((index / (totalFrames - 1)).toFixed(SVG_KEY_TIMES_PRECISION)));
			values.push(currentValue);
			lastValue = currentValue;
			lastIndex = index;
		}
	});

	// Ensure the last frame is always included
	if (keyTimes.length === 0 || keyTimes[keyTimes.length - 1] !== 1) {
		// If there are no keyframes, add start and end frames
		if (keyTimes.length === 0) {
			keyTimes.push(0, 1);
			values.push(changingValues[0] || '#000', changingValues[changingValues.length - 1] || '#000');
		} else {
			keyTimes.push(1);
			values.push(lastValue || changingValues[changingValues.length - 1] || '#000');
		}
	}

	return {
		keyTimes: keyTimes.join(';'),
		values: values.join(';')
	};
};

export const SVG = {
	generateAnimatedSVG
};
