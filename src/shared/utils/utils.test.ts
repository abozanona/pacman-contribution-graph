import { GAME_THEMES, GRID_WIDTH } from '../constants';
import type { BaseStore } from '../types';
import { Utils } from './utils';

const SUNDAY = new Date('2026-07-26T12:00:00.000Z');

const createStore = (): BaseStore => ({
	config: {
		platform: 'github',
		username: 'test-user',
		gameTheme: 'github',
		svgCallback: jest.fn(),
		gameOverCallback: jest.fn(),
		pointsIncreasedCallback: jest.fn()
	},
	contributions: [
		{
			date: SUNDAY,
			count: 3,
			color: GAME_THEMES.github.intensityColors[2],
			level: 'SECOND_QUARTILE'
		}
	],
	grid: [],
	monthLabels: []
});

describe('buildGrid', () => {
	afterEach(() => {
		jest.useRealTimers();
	});

	it('includes a current-day contribution when the grid ends on Sunday', () => {
		jest.useFakeTimers();
		jest.setSystemTime(SUNDAY);
		const store = createStore();

		Utils.buildGrid(store);

		expect(store.grid).toHaveLength(GRID_WIDTH);
		expect(store.grid[GRID_WIDTH - 1][0]).toEqual({
			commitsCount: 3,
			color: GAME_THEMES.github.intensityColors[2],
			level: 'SECOND_QUARTILE'
		});
	});
});

describe('buildMonthLabels', () => {
	afterEach(() => {
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	it('uses UTC month boundaries regardless of the runtime timezone', () => {
		const toLocaleString = Date.prototype.toLocaleString;
		jest.spyOn(Date.prototype, 'toLocaleString').mockImplementation(function (this: Date, locales, options) {
			return toLocaleString.call(this, locales, {
				...options,
				timeZone: options?.timeZone ?? 'America/Los_Angeles'
			});
		});
		jest.useFakeTimers();
		jest.setSystemTime(SUNDAY);
		const store = createStore();

		Utils.buildMonthLabels(store);

		expect(store.monthLabels[27]).toBe('Feb');
	});
});
