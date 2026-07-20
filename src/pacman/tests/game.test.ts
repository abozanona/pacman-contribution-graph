import { GAME_THEMES } from '../../shared/constants';
import { GhostsMovement } from '../movement/ghosts-movement';
import { PacmanMovement } from '../movement/pacman-movement';
import { SVG } from '../renderers/svg';
import { PlayerStyle, StoreType } from '../types';
import { Game } from '../core/game';

const createStore = (withContribution: boolean): StoreType => ({
	frameCount: 0,
	aliveSteps: 0,
	contributions: withContribution
		? [
				{
					date: new Date(),
					count: 1,
					color: GAME_THEMES.github.intensityColors[1],
					level: 'FIRST_QUARTILE'
				}
			]
		: [],
	pacman: {
		x: 0,
		y: 0,
		direction: 'right',
		points: 0,
		totalPoints: 0,
		deadRemainingDuration: 0,
		powerupRemainingDuration: 0,
		recentPositions: [],
		ghostsEaten: 0
	},
	ghosts: [],
	grid: [],
	monthLabels: [],
	pacmanMouthOpen: true,
	gameInterval: 0,
	gameHistory: [],
	initialColors: [],
	cellEvents: [],
	config: {
		platform: 'github',
		username: 'test-user',
		gameTheme: 'github',
		githubSettings: { accessToken: '' },
		playerStyle: PlayerStyle.OPPORTUNISTIC,
		svgCallback: jest.fn(),
		gameOverCallback: jest.fn(),
		pointsIncreasedCallback: jest.fn()
	},
	useGithubThemeColor: true
});

describe('Pac-Man game completion', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('finalizes the game when the frame limit is reached with cells remaining', async () => {
		const store = createStore(true);
		const callbackOrder: string[] = [];
		const svgCallback = jest.fn(() => callbackOrder.push('svg'));
		const gameStatsCallback = jest.fn(() => callbackOrder.push('stats'));
		const gameOverCallback = jest.fn(() => callbackOrder.push('gameOver'));
		store.config.svgCallback = svgCallback;
		store.config.gameStatsCallback = gameStatsCallback;
		store.config.gameOverCallback = gameOverCallback;

		jest.spyOn(PacmanMovement, 'movePacman').mockImplementation(() => {});
		jest.spyOn(GhostsMovement, 'moveGhosts').mockImplementation(() => {});
		jest.spyOn(SVG, 'generateAnimatedSVG').mockReturnValue('<svg/>');

		await Game.startGame(store);

		expect(store.gameHistory).toHaveLength(3000);
		expect(store.frameCount).toBe(3000);
		expect(store.grid.flat().some((cell) => cell.commitsCount > 0)).toBe(true);
		expect(SVG.generateAnimatedSVG).toHaveBeenCalledTimes(1);
		expect(svgCallback).toHaveBeenCalledWith('<svg/>');
		expect(gameStatsCallback).toHaveBeenLastCalledWith({ totalScore: 0, steps: 3000, ghostsEaten: 0 });
		expect(gameOverCallback).toHaveBeenCalledTimes(1);
		expect(callbackOrder.slice(-3)).toEqual(['svg', 'stats', 'gameOver']);
	});

	it('continues to finalize an empty grid through the normal completion path', async () => {
		const store = createStore(false);
		const svgCallback = store.config.svgCallback as jest.Mock;
		const gameOverCallback = store.config.gameOverCallback as jest.Mock;

		jest.spyOn(SVG, 'generateAnimatedSVG').mockReturnValue('<svg/>');

		await Game.startGame(store);

		expect(store.gameHistory).toHaveLength(0);
		expect(store.frameCount).toBe(1);
		expect(svgCallback).toHaveBeenCalledWith('<svg/>');
		expect(gameOverCallback).toHaveBeenCalledTimes(1);
	});
});
