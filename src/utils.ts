import { GAME_THEMES } from './constants';
import type { Contribution, GameTheme, StoreType } from './types';

const getGitlabContribution = async (store: StoreType): Promise<Contribution[]> => {
	// const response = await fetch(`https://gitlab.com/users/${username}/calendar.json`);
	const response = await fetch(
		`https://v0-new-project-q1hhrdodoye-abozanona-gmailcoms-projects.vercel.app/api/contributions?username=${store.config.username}`
	);
	const contributionsList = await response.json();
	return Object.entries(contributionsList).map(([date, count]) => ({
		date: new Date(date),
		count: Number(count)
	}));
};

const getGithubContribution = async (store: StoreType): Promise<Contribution[]> => {
	const commits = [];
	let isComplete: boolean = false;
	let page = 1;
	// TODO: Consider using GraphQL endpoint when user has an access token?
	do {
		try {
			const headers: HeadersInit = {};
			if (store.config.githubSettings?.accessToken) {
				headers['Authorization'] = 'Bearer ' + store.config.githubSettings.accessToken;
			}
			const response = await fetch(
				`https://api.github.com/search/commits?q=author:${store.config.username}&sort=author-date&order=desc&page=${page}&per_page=1000`,
				{
					headers
				}
			);
			const contributionsList = await response.json();
			isComplete = contributionsList.items.length === 0;
			commits.push(...contributionsList.items);
			page++;
		} catch (ex) {
			isComplete = true;
		}
	} while (!isComplete);
	return Array.from(
		commits
			.reduce((map: any, item: any) => {
				const dateString = item.commit.committer.date.split('T')[0];
				const date = new Date(dateString);
				const count = (map.get(dateString) || { count: 0 }).count + 1;
				return map.set(dateString, { date, count });
			}, new Map())
			.values()
	);
};

const getCurrentTheme = (store: StoreType): GameTheme => {
	return GAME_THEMES[store.config.gameTheme] ?? GAME_THEMES['github'];
};

const hexToRGBA = (hex: string, alpha: number): string => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const hexToHexAlpha = (hex: string, alpha: number): string => {
	hex = hex.replace(/^#/, '');
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	const alphaHex = Math.round(alpha * 255)
		.toString(16)
		.padStart(2, '0');
	return `#${hex}${alphaHex}`;
};

export async function fetchGitHubContributions(username: string): Promise<number[][]> {
    const res = await fetch(`https://github.com/users/${username}/contributions`);
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'image/svg+xml');
    const rects = doc.querySelectorAll('rect[data-date]');

    // 7 rows (days), 53 columns (weeks)
    const grid: number[][] = Array(7).fill(null).map(() => Array(53).fill(0));

    rects.forEach(rect => {
        const count = parseInt(rect.getAttribute('data-count') || '0', 10);
        const date = rect.getAttribute('data-date');
        if (!date) return;

        const dateObj = new Date(date);
        const today = new Date();
        const weekDiff = Math.floor((today.getTime() - dateObj.getTime()) / (7 * 24 * 60 * 60 * 1000));
        const dayOfWeek = dateObj.getDay();
        if (weekDiff < 53 && weekDiff >= 0) {
            grid[dayOfWeek][52 - weekDiff] = count;
        }
    });
    return grid;
}

export const Utils = {
	getGitlabContribution,
	getGithubContribution,
	getCurrentTheme,
	hexToRGBA,
	hexToHexAlpha
};
