import { GAME_THEMES, GRID_HEIGHT, GRID_WIDTH } from '../../shared/constants';
import { PacmanMovement } from '../movement/pacman-movement';
import { PlayerStyle, StoreType } from '../types';
import { Grid } from '../utils/grid';

const createStore = (): StoreType => {
	const emptyColor = GAME_THEMES.github.intensityColors[0];
	const grid: StoreType['grid'] = Array.from({ length: GRID_WIDTH }, () =>
		Array.from({ length: GRID_HEIGHT }, () => ({ commitsCount: 0, color: emptyColor, level: 'NONE' as const }))
	);
	grid[1][0] = {
		commitsCount: 7,
		color: GAME_THEMES.github.intensityColors[1],
		level: 'FIRST_QUARTILE'
	};

	return {
		frameCount: 0,
		aliveSteps: 0,
		contributions: [],
		pacman: {
			x: 0,
			y: 0,
			direction: 'right',
			points: 0,
			totalPoints: 0,
			deadRemainingDuration: 0,
			powerupRemainingDuration: 0,
			recentPositions: [],
			target: { x: 1, y: 0 },
			ghostsEaten: 0
		},
		ghosts: [],
		grid,
		monthLabels: Array(GRID_WIDTH).fill(''),
		pacmanMouthOpen: true,
		gameInterval: 0,
		gameHistory: [],
		initialColors: grid.map((column) => column.map((cell) => cell.color)),
		cellEvents: [],
		config: {
			platform: 'github',
			username: 'test-user',
			gameTheme: 'github',
			githubSettings: { accessToken: '' },
			playerStyle: PlayerStyle.OPPORTUNISTIC,
			svgCallback: () => {},
			gameOverCallback: () => {},
			pointsIncreasedCallback: jest.fn(() => {
				throw new Error('callback failed');
			})
		},
		useGithubThemeColor: true
	};
};

describe('Pac-Man movement', () => {
	beforeAll(() => {
		Grid.buildWalls();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('finishes consuming a cell when the points callback throws', () => {
		const store = createStore();
		jest.spyOn(console, 'error').mockImplementation(() => {});

		PacmanMovement.movePacman(store);

		expect(store.config.pointsIncreasedCallback).toHaveBeenCalledWith(7);
		expect(store.pacman.totalPoints).toBe(7);
		expect(store.grid[1][0]).toMatchObject({ commitsCount: 0, level: 'NONE' });
		expect(store.cellEvents).toEqual([
			expect.objectContaining({
				frameIndex: 0,
				x: 1,
				y: 0
			})
		]);
	});
});
