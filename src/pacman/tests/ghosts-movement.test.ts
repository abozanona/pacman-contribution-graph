import { GAME_THEMES, GRID_HEIGHT, GRID_WIDTH } from '../../shared/constants';
import { Grid } from '../utils/grid';
import { GhostsMovement } from '../movement/ghosts-movement';
import { Ghost, GhostName, PlayerStyle, StoreType } from '../types';

type Direction = Ghost['direction'];

const createGhost = (name: GhostName, x: number, y: number, direction: Direction): Ghost => ({
	x,
	y,
	name,
	direction,
	scared: false,
	inHouse: false,
	respawnCounter: 0,
	freezeCounter: 0,
	justReleasedFromHouse: false
});

const createStore = (ghost: Ghost): StoreType => {
	const emptyColor = GAME_THEMES.github.intensityColors[0];
	const grid = Array.from({ length: GRID_WIDTH }, () =>
		Array.from({ length: GRID_HEIGHT }, () => ({ commitsCount: 0, color: emptyColor, level: 'NONE' as const }))
	);

	return {
		frameCount: 0,
		aliveSteps: 0,
		contributions: [],
		pacman: {
			x: 27,
			y: 6,
			direction: 'right',
			points: 0,
			totalPoints: 0,
			deadRemainingDuration: 0,
			powerupRemainingDuration: 0,
			recentPositions: [],
			ghostsEaten: 0
		},
		ghosts: [ghost],
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
			pointsIncreasedCallback: () => {}
		},
		useGithubThemeColor: true
	};
};

describe('Pac-Man ghost pathfinding', () => {
	beforeAll(() => {
		Grid.buildWalls();
	});

	beforeEach(() => {
		GhostsMovement.resetGameMode();
	});

	it.each<{
		name: string;
		ghostName: GhostName;
		start: [number, number];
		direction: Direction;
		expected: [number, number, Direction];
	}>([
		{
			name: 'keeps the first step of a deep path',
			ghostName: 'blinky',
			start: [10, 6],
			direction: 'right',
			expected: [11, 6, 'right']
		},
		{
			name: 'preserves path ordering when reverse movement is excluded',
			ghostName: 'blinky',
			start: [10, 6],
			direction: 'left',
			expected: [10, 5, 'up']
		},
		{
			name: 'moves toward the scatter target when already facing it',
			ghostName: 'clyde',
			start: [1, 5],
			direction: 'right',
			expected: [2, 5, 'right']
		},
		{
			name: 'takes the direct step when it is not a reversal',
			ghostName: 'clyde',
			start: [1, 5],
			direction: 'left',
			expected: [0, 5, 'left']
		}
	])('$name', ({ ghostName, start, direction, expected }) => {
		const ghost = createGhost(ghostName, start[0], start[1], direction);
		const store = createStore(ghost);

		GhostsMovement.moveGhosts(store);

		expect([ghost.x, ghost.y, ghost.direction]).toEqual(expected);
	});

	it('finishes a scared half-step before becoming dangerous again', () => {
		const ghost = createGhost('blinky', 10, 6, 'right');
		ghost.scared = true;
		ghost.subX = 0.5;
		const store = createStore(ghost);
		store.pacman.powerupRemainingDuration = 0;

		GhostsMovement.moveGhosts(store);

		expect(ghost).toMatchObject({
			x: 11,
			y: 6,
			scared: false,
			subX: 0,
			subY: 0
		});
	});
});
