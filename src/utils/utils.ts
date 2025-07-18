import { GAME_THEMES, GRID_HEIGHT, GRID_WIDTH } from '../core/constants';
import type { ContributionLevel, GameTheme, StoreType } from '../types';

/* ─────────────────────────── Helpers ─────────────────────────── */
const weeksBetween = (start: Date, end: Date) => Math.floor((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));

const truncateToUTCDate = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

/* ───────────────────────── Theme and helpers ────────────────────── */
export const getCurrentTheme = (store: StoreType): GameTheme => GAME_THEMES[store.config.gameTheme] ?? GAME_THEMES['github'];

export const levelToIndex = (level: ContributionLevel): number => {
	switch (level) {
		case 'NONE':
			return 0;
		case 'FIRST_QUARTILE':
			return 1;
		case 'SECOND_QUARTILE':
			return 2;
		case 'THIRD_QUARTILE':
			return 3;
		case 'FOURTH_QUARTILE':
			return 4;
		default:
			return 0;
	}
};

export const calculateContributionLevel = (contribution: number, maxContribution: number): ContributionLevel => {
	const q = maxContribution / 4;

	if (contribution === 0) {
		return 'NONE';
	} else if (contribution < q) {
		return 'FIRST_QUARTILE';
	} else if (contribution < 2 * q) {
		return 'SECOND_QUARTILE';
	} else if (contribution < 3 * q) {
		return 'THIRD_QUARTILE';
	} else {
		return 'FOURTH_QUARTILE';
	}
};

export const buildGrid = (store: StoreType) => {
	const endDate = truncateToUTCDate(new Date());
	const startDate = new Date(endDate);
	startDate.setUTCDate(endDate.getUTCDate() - 365);
	startDate.setUTCDate(startDate.getUTCDate() - startDate.getUTCDay());

	const realWidth = 53;
	const grid = Array.from({ length: realWidth }, () =>
		Array.from({ length: GRID_HEIGHT }, () => ({
			commitsCount: 0,
			color: getCurrentTheme(store).intensityColors[0],
			level: 'NONE' as ContributionLevel
		}))
	);

	store.contributions.forEach((c) => {
		const date = truncateToUTCDate(new Date(c.date));
		if (date < startDate || date > endDate) return;

		const day = date.getUTCDay();
		const week = weeksBetween(startDate, date);

		if (week >= 0 && week < realWidth) {
			const theme = getCurrentTheme(store);
			grid[week][day] = {
				commitsCount: c.count,
				color: theme.intensityColors[levelToIndex(c.level)],
				level: c.level
			};
		}
	});

	store.grid = grid;
};

export const buildMonthLabels = (store: StoreType) => {
	const endDate = truncateToUTCDate(new Date());
	const startDate = new Date(endDate);
	startDate.setUTCDate(endDate.getUTCDate() - 365);
	startDate.setUTCDate(startDate.getUTCDate() - startDate.getUTCDay());

	const realWidth = weeksBetween(startDate, endDate) + 1;
	const labels = Array(realWidth).fill('');

	let lastMonth = '';

	for (let week = 0; week < realWidth; week++) {
		const date = new Date(startDate);
		date.setUTCDate(date.getUTCDate() + week * 7);

		const currentMonth = date.toLocaleString('default', { month: 'short' });

		// Only enter the name if it has changed month in relation to the last one
		if (currentMonth !== lastMonth) {
			labels[week] = currentMonth;
			lastMonth = currentMonth;
		}
	}

	store.monthLabels = realWidth > GRID_WIDTH ? labels.slice(realWidth - GRID_WIDTH) : labels;
};

export const createGridFromData = (store: StoreType) => {
	buildGrid(store);
	return store.grid;
};

export const Utils = {
	getCurrentTheme,
	buildGrid,
	buildMonthLabels,
	createGridFromData,
	levelToIndex
};
