import { GAME_THEMES, GRID_HEIGHT, GRID_WIDTH } from '../../shared/constants';
import { SVG } from '../renderers/svg';
import { Ghost, Pacman, PlayerStyle, StoreType } from '../types';

const createPacman = (overrides: Partial<Pacman> = {}): Pacman => ({
	x: 0,
	y: 0,
	direction: 'right',
	points: 0,
	totalPoints: 0,
	deadRemainingDuration: 0,
	powerupRemainingDuration: 0,
	recentPositions: [],
	ghostsEaten: 0,
	...overrides
});

const createGhost = (overrides: Partial<Ghost> = {}): Ghost => ({
	x: 2,
	y: 1,
	name: 'blinky',
	direction: 'left',
	scared: false,
	inHouse: false,
	respawnCounter: 0,
	freezeCounter: 0,
	justReleasedFromHouse: false,
	...overrides
});

const createStore = (gameHistory: StoreType['gameHistory'], ghosts: Ghost[] = []): StoreType => {
	const emptyColor = GAME_THEMES.github.intensityColors[0];
	const grid = Array.from({ length: GRID_WIDTH }, () =>
		Array.from({ length: GRID_HEIGHT }, () => ({ commitsCount: 0, color: emptyColor, level: 'NONE' as const }))
	);

	return {
		frameCount: gameHistory.length,
		aliveSteps: gameHistory.length,
		contributions: [],
		pacman: gameHistory[gameHistory.length - 1]?.pacman ?? createPacman(),
		ghosts,
		grid,
		monthLabels: Array(GRID_WIDTH).fill(''),
		pacmanMouthOpen: true,
		gameInterval: 0,
		gameHistory,
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

const expectValidAnimationKeyframes = (svg: string) => {
	const animationPattern = /<animate(?:Transform)?\b[\s\S]*?\/>/g;
	let animation: RegExpExecArray | null;
	while ((animation = animationPattern.exec(svg)) !== null) {
		const keyTimesValue = animation[0].match(/keyTimes="([^"]+)"/)?.[1];
		const valuesValue = animation[0].match(/values="([^"]+)"/)?.[1];
		if (!keyTimesValue || !valuesValue) continue;

		const keyTimes = keyTimesValue.split(';').map(Number);
		const values = valuesValue.split(';');

		expect(keyTimes.every(Number.isFinite)).toBe(true);
		expect(keyTimes[0]).toBe(0);
		expect(keyTimes[keyTimes.length - 1]).toBe(1);
		expect(keyTimes.every((time, index) => index === 0 || time >= keyTimes[index - 1])).toBe(true);
		expect(values).toHaveLength(keyTimes.length);
	}
};

describe('Pac-Man SVG short histories', () => {
	it('uses valid static Pac-Man values for an empty history', () => {
		const svg = SVG.generateAnimatedSVG(createStore([], [createGhost()]));

		expectValidAnimationKeyframes(svg);
		expect(svg).toContain('<durationMs>0</durationMs>');
		expect(svg).not.toContain('dur="0ms"');
		expect(svg).not.toContain('NaN');
		expect(svg).not.toContain('Infinity');
		expect(svg).not.toContain('undefined');
		expect(svg).not.toContain('values="#000;#000"');
		expect(svg).toContain('values="yellow;yellow"');
		expect(svg).toContain('values="0,15;0,15"');
		expect(svg).toContain('values="0 10 10;0 10 10"');
		expect(svg).toContain('values="44,37;44,37"');
		expect(svg.match(/<use href="#ghost-/g)).toHaveLength(1);
		expect(svg).toContain('<symbol id="ghost-inky-up"');
		expect(svg).not.toContain('<use href="#ghost-inky-up"');
	});

	it('duplicates the only frame value instead of dividing by zero', () => {
		const historyGhost = createGhost({ direction: 'up' });
		const currentGhost = createGhost({ direction: 'left' });
		const pacman = createPacman({ x: 1, y: 2, direction: 'up' });
		const svg = SVG.generateAnimatedSVG(
			createStore(
				[
					{
						pacman,
						ghosts: [historyGhost]
					}
				],
				[currentGhost]
			)
		);

		expectValidAnimationKeyframes(svg);
		expect(svg).toContain('<durationMs>200</durationMs>');
		expect(svg).not.toContain('NaN');
		expect(svg).toContain('values="22,59;22,59"');
		expect(svg).toContain('values="270 10 10;270 10 10"');
		expect(svg).toContain('values="44,37;44,37"');
	});

	it('omits animations for cells whose color never changes', () => {
		const firstPacman = createPacman();
		const secondPacman = createPacman({ x: 1 });
		const store = createStore([
			{ pacman: firstPacman, ghosts: [] },
			{ pacman: secondPacman, ghosts: [] }
		]);
		store.cellEvents.push({ frameIndex: 1, x: 1, y: 1, color: '#ffffff' });

		const svg = SVG.generateAnimatedSVG(store);
		const staticCell = svg.match(/<rect id="c-0-0"[\s\S]*?<\/rect>/)?.[0];
		const animatedCell = svg.match(/<rect id="c-1-1"[\s\S]*?<\/rect>/)?.[0];

		expect(staticCell).toBeDefined();
		expect(staticCell).not.toContain('<animate');
		expect(animatedCell).toContain('<animate attributeName="fill"');
		expect(animatedCell).toContain('values="#ebedf0;#ffffff"');
	});

	it('keeps multi-frame position timing unchanged', () => {
		const firstPacman = createPacman();
		const secondPacman = createPacman({ x: 1 });
		const svg = SVG.generateAnimatedSVG(
			createStore([
				{ pacman: firstPacman, ghosts: [] },
				{ pacman: secondPacman, ghosts: [] }
			])
		);

		expectValidAnimationKeyframes(svg);
		expect(svg).toContain('<durationMs>400</durationMs>');
		expect(svg).not.toContain('NaN');
		expect(svg).not.toContain('<defs>');
		expect(svg).toMatch(/type="translate"[\s\S]*?keyTimes="0;1"[\s\S]*?values="0,15;22,15"/);
	});
});
