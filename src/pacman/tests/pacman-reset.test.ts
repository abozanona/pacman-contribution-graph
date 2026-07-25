import { GAME_THEMES } from '../../shared/constants';
import { GhostsMovement } from '../movement/ghosts-movement';
import { PacmanMovement } from '../movement/pacman-movement';
import { SVG } from '../renderers/svg';
import { Game } from '../core/game';
import { Store } from '../core/store';
import { PlayerStyle, Point2d, StoreType } from '../types';

const createStore = (): StoreType => {
	const store = JSON.parse(JSON.stringify(Store)) as StoreType;
	store.contributions = [
		{
			date: new Date(),
			count: 1,
			color: GAME_THEMES.github.intensityColors[1],
			level: 'FIRST_QUARTILE'
		}
	];
	store.config = {
		platform: 'github',
		username: 'test-user',
		gameTheme: 'github',
		githubSettings: { accessToken: '' },
		playerStyle: PlayerStyle.OPPORTUNISTIC,
		svgCallback: jest.fn(),
		gameOverCallback: jest.fn(),
		pointsIncreasedCallback: jest.fn()
	};
	return store;
};

describe('Pac-Man reset', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('clears the previous target after a death', async () => {
		const store = createStore();
		let moveCount = 0;
		let targetAfterReset: Point2d | undefined;

		jest.spyOn(PacmanMovement, 'movePacman').mockImplementation((currentStore) => {
			moveCount++;
			if (moveCount === 1) {
				currentStore.pacman.target = { x: 10, y: 6 };
				currentStore.pacman.deadRemainingDuration = 1;
				return;
			}

			targetAfterReset = currentStore.pacman.target;
			currentStore.grid.flat().forEach((cell) => {
				cell.commitsCount = 0;
				cell.level = 'NONE';
			});
		});
		jest.spyOn(GhostsMovement, 'moveGhosts').mockImplementation(() => {});
		jest.spyOn(SVG, 'generateAnimatedSVG').mockReturnValue('<svg/>');

		await Game.startGame(store);

		expect(targetAfterReset).toBeUndefined();
		expect(store.pacman.x).toBe(27);
		expect(store.pacman.y).toBe(7);
	});
});
