import { CELL_SIZE, DELTA_TIME, GAP_SIZE, GHOSTS, GRID_HEIGHT, GRID_WIDTH, PACMAN_COLOR, WALLS } from '../core/constants';
import { AnimationData, GhostName, StoreType } from '../types';
import { Utils } from '../utils/utils';
import { RendererUnits } from './renderer-units';

const SVG_KEY_TIMES_PRECISION = 4;

const generateAnimatedSVG = (store: StoreType) => {
	// Dimensions and duration
	const svgWidth = GRID_WIDTH * (CELL_SIZE + GAP_SIZE);
	const svgHeight = GRID_HEIGHT * (CELL_SIZE + GAP_SIZE) + 30; // Extra height for time counter
	const totalDurationMs = store.gameHistory.length * DELTA_TIME;

	// Basic SVG structure
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

	// Month labels
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
			const cellColorAnimation = generateChangingValuesAnimation(store, generateCellColorValues(store, x, y));
			svg += `<rect id="c-${x}-${y}" x="${cellX}" y="${cellY}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="5" fill="${Utils.getCurrentTheme(store).intensityColors[0]}">
				<animate attributeName="fill" dur="${totalDurationMs}ms" repeatCount="indefinite" 
					values="${cellColorAnimation.values}" 
					keyTimes="${cellColorAnimation.keyTimes}"/>
			</rect>`;
		}
	}

	// Walls
	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			if (WALLS.horizontal[x][y].active) {
				svg += `<rect id="wh-${x}-${y}" x="${x * (CELL_SIZE + GAP_SIZE) - GAP_SIZE}" y="${y * (CELL_SIZE + GAP_SIZE) - GAP_SIZE + 15}" width="${CELL_SIZE + GAP_SIZE}" height="${GAP_SIZE}" rx="5" fill="${Utils.getCurrentTheme(store).wallColor}"></rect>`;
			}
			if (WALLS.vertical[x][y].active) {
				svg += `<rect id="wv-${x}-${y}" x="${x * (CELL_SIZE + GAP_SIZE) - GAP_SIZE}" y="${y * (CELL_SIZE + GAP_SIZE) - GAP_SIZE + 15}" width="${GAP_SIZE}" height="${CELL_SIZE + GAP_SIZE}" rx="5" fill="${Utils.getCurrentTheme(store).wallColor}"></rect>`;
			}
		}
	}

	// Pacman
	const pacmanColorAnimation = generateChangingValuesAnimation(
		store,
		store.gameHistory.map((el) => RendererUnits.generatePacManColors(el.pacman))
	);
	const pacmanPositionAnimation = generateChangingValuesAnimation(store, generatePacManPositions(store));
	const pacmanRotationAnimation = generateChangingValuesAnimation(store, generatePacManRotations(store));
	svg += `<path id="pacman" d="${generatePacManPath(0.55)}" fill="${PACMAN_COLOR}">
		<animate attributeName="fill" dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${pacmanColorAnimation.keyTimes}"
			values="${pacmanColorAnimation.values}"/>
		<animateTransform attributeName="transform" type="translate" dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${pacmanPositionAnimation.keyTimes}"
			values="${pacmanPositionAnimation.values}"
			additive="sum"/>
		<animateTransform attributeName="transform" type="rotate" dur="${totalDurationMs}ms" repeatCount="indefinite"
			keyTimes="${pacmanRotationAnimation.keyTimes}"
			values="${pacmanRotationAnimation.values}"
			additive="sum"/>
		<animate attributeName="d" dur="0.5s" repeatCount="indefinite"
			values="${generatePacManPath(0.55)};${generatePacManPath(0.05)};${generatePacManPath(0.55)}"/>
	</path>`;

	// Process each ghost separately
	store.ghosts.forEach((ghost, index) => {
		// Generate position animation for this ghost
		const ghostPositionAnimation = generateChangingValuesAnimation(store, generateGhostPositions(store, index));

		// Create a group for the ghost
		svg += `<g id="ghost${index}" transform="translate(0,0)">
			<animateTransform attributeName="transform" type="translate" 
				dur="${totalDurationMs}ms" repeatCount="indefinite"
				keyTimes="${ghostPositionAnimation.keyTimes}"
				values="${ghostPositionAnimation.values}"
				additive="replace"/>`;

		// Map all possible state + direction combinations for this ghost
		const stateChanges = mapGhostStateChanges(store, index);

		// For each possible state, create a <use> element with visibility animation
		for (const [state, keyframes] of Object.entries(stateChanges)) {
			// Ignore empty states
			if (keyframes.length === 0) continue;

			// Use the correct ID for reference (blinky-right, scared, etc)
			const href = `#ghost-${state}`;

			// Build the strings for the animation
			const keyTimes = keyframes.map((kf) => kf.time.toFixed(SVG_KEY_TIMES_PRECISION)).join(';');
			const values = keyframes.map((kf) => (kf.visible ? 'visible' : 'hidden')).join(';');

			// Initial visibility
			const initialVisibility = keyframes[0].visible ? 'visible' : 'hidden';

			svg += `<use href="${href}" width="${CELL_SIZE}" height="${CELL_SIZE}" visibility="${initialVisibility}">
				<animate attributeName="visibility" 
					dur="${totalDurationMs}ms" repeatCount="indefinite"
					keyTimes="${keyTimes}"
					values="${values}" />
			</use>`;
		}

		// Close the ghost group
		svg += `</g>`;
	});

	svg += '</svg>';
	return svg;
};

// Helper function to map all ghost state changes
function mapGhostStateChanges(store: StoreType, ghostIndex: number) {
	// A map of states for frames where they are visible
	// Key: "name-direction" or "scared" or "eyes-direction"
	// Value: array of {time: number, visible: boolean}
	const stateChanges: Record<string, { time: number; visible: boolean }[]> = {};

	// Initialize possible states for all ghosts
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

	// Initialize all states as hidden
	allPossibleStates.forEach((state) => {
		stateChanges[state] = [{ time: 0, visible: false }];
	});

	// Get the initial ghost
	const initialGhost = store.ghosts[ghostIndex];
	if (!initialGhost) return stateChanges;

	// Set the initial state correctly
	const initialState = initialGhost.scared
		? 'scared'
		: initialGhost.name === 'eyes'
			? `eyes-${initialGhost.direction || 'right'}`
			: `${initialGhost.name}-${initialGhost.direction || 'right'}`;

	// Mark this state as visible initially
	stateChanges[initialState] = [{ time: 0, visible: true }];

	// Track last state
	let lastState = initialState;

	// Process each frame of the game history
	store.gameHistory.forEach((state, frameIndex) => {
		// If the ghost does not exist in this frame, skip
		if (ghostIndex >= state.ghosts.length) return;

		const ghost = state.ghosts[ghostIndex];
		const currentTime = frameIndex / (store.gameHistory.length - 1);

		// Determine the current state
		const currentState = ghost.scared
			? 'scared'
			: ghost.name === 'eyes'
				? `eyes-${ghost.direction || 'right'}`
				: `${ghost.name}-${ghost.direction || 'right'}`;

		// If the status has changed
		if (currentState !== lastState) {
			// Hide previous state
			stateChanges[lastState].push({ time: currentTime, visible: false });

			// Show new status
			if (!stateChanges[currentState]) {
				stateChanges[currentState] = [{ time: 0, visible: false }];
			}
			stateChanges[currentState].push({ time: currentTime, visible: true });

			// Update the latest status
			lastState = currentState;
		}
	});

	// Ensure the last state remains visible until the end
	stateChanges[lastState].push({ time: 1, visible: true });

	// Ensure all other states are hidden until the end
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

const generatePacManPositions = (store: StoreType): string[] => {
	return store.gameHistory.map((state) => {
		const x = state.pacman.x * (CELL_SIZE + GAP_SIZE);
		const y = state.pacman.y * (CELL_SIZE + GAP_SIZE) + 15;
		return `${x},${y}`;
	});
};

const generatePacManRotations = (store: StoreType): string[] => {
	const pivit = CELL_SIZE / 2;
	return store.gameHistory.map((state) => {
		switch (state.pacman.direction) {
			case 'right':
				return `0 ${pivit} ${pivit}`;
			case 'left':
				return `180 ${pivit} ${pivit}`;
			case 'up':
				return `270 ${pivit} ${pivit}`;
			case 'down':
				return `90 ${pivit} ${pivit}`;
			default:
				return `0 ${pivit} ${pivit}`;
		}
	});
};

const generateCellColorValues = (store: StoreType, x: number, y: number): string[] => {
	return store.gameHistory.map((state) => state.grid[x][y].color);
};

const generateGhostPositions = (store: StoreType, ghostIndex: number): string[] => {
	return store.gameHistory.map((state) => {
		if (ghostIndex >= state.ghosts.length) {
			return '0,0'; // Default value for cases where the ghost does not exist
		}
		const ghost = state.ghosts[ghostIndex];
		const x = ghost.x * (CELL_SIZE + GAP_SIZE);
		const y = ghost.y * (CELL_SIZE + GAP_SIZE) + 15;
		return `${x},${y}`;
	});
};

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

const generateChangingValuesAnimation = (store: StoreType, changingValues: string[]): AnimationData => {
	if (store.gameHistory.length !== changingValues.length) {
		throw new Error(
			`The amount of values (${changingValues.length}) does not match the size of the game history (${store.gameHistory.length})`
		);
	}

	const totalFrames = store.gameHistory.length;
	if (totalFrames === 0) {
		return { keyTimes: '0;1', values: changingValues[0] || '#000;#000' };
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
