import { GAME_THEMES, GRID_HEIGHT, GRID_WIDTH } from '../constants';
import type { BaseStore, ContributionLevel, GameTheme } from '../types';

/* ─────────────────────────── Helpers ─────────────────────────── */
const weeksBetween = (start: Date, end: Date) => Math.floor((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));

const truncateToUTCDate = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

const getLatestContributionDate = (store: BaseStore) =>
	store.contributions.reduce<Date | undefined>((latestDate, contribution) => {
		const contributionDate = truncateToUTCDate(new Date(contribution.date));
		return latestDate === undefined || contributionDate > latestDate ? contributionDate : latestDate;
	}, undefined);

const getGridEndDate = (store: BaseStore) => {
	const endDate = truncateToUTCDate(new Date());
	const latestContributionDate = getLatestContributionDate(store);

	if (latestContributionDate && latestContributionDate > endDate) {
		return latestContributionDate;
	}

	return endDate;
};

const getGridStartDate = (endDate: Date) => {
	const startDate = new Date(endDate);
	startDate.setUTCDate(endDate.getUTCDate() - (GRID_WIDTH - 1) * 7 - endDate.getUTCDay());
	return startDate;
};

/* ───────────────────────── Theme helpers ────────────────────── */
export const getCurrentTheme = (store: BaseStore): GameTheme => GAME_THEMES[store.config.gameTheme] ?? GAME_THEMES['github'];

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
	if (contribution === 0) return 'NONE';
	if (contribution < q) return 'FIRST_QUARTILE';
	if (contribution < 2 * q) return 'SECOND_QUARTILE';
	if (contribution < 3 * q) return 'THIRD_QUARTILE';
	return 'FOURTH_QUARTILE';
};

export const buildGrid = (store: BaseStore) => {
	const endDate = getGridEndDate(store);
	const startDate = getGridStartDate(endDate);

	const grid = Array.from({ length: GRID_WIDTH }, () =>
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

		if (week >= 0 && week < GRID_WIDTH) {
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

export const buildMonthLabels = (store: BaseStore) => {
	const endDate = getGridEndDate(store);
	const startDate = getGridStartDate(endDate);

	const realWidth = weeksBetween(startDate, endDate) + 1;
	const labels = Array(realWidth).fill('');

	let lastMonth = '';

	for (let week = 0; week < realWidth; week++) {
		const date = new Date(startDate);
		date.setUTCDate(date.getUTCDate() + week * 7);

		const currentMonth = date.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
		if (currentMonth !== lastMonth) {
			labels[week] = currentMonth;
			lastMonth = currentMonth;
		}
	}

	store.monthLabels = realWidth > GRID_WIDTH ? labels.slice(realWidth - GRID_WIDTH) : labels;
};

export const createGridFromData = (store: BaseStore) => {
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
