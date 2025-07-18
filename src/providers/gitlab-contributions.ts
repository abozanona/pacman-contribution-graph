import { Contribution, StoreType } from '../types';
import { calculateContributionLevel, getCurrentTheme, levelToIndex } from '../utils/utils';

export const fetchGitlabContributions = async (store: StoreType) => {
	const response = await fetch(
		`https://v0-new-project-q1hhrdodoye-abozanona-gmailcoms-projects.vercel.app/api/contributions?username=${store.config.username}`
	);
	const contributionsList = await response.json();
	const contributions = Object.entries(contributionsList).map(([date, count]) => ({
		date: new Date(date),
		count: Number(count),
		color: '',
		level: 'NONE' as const
	})) as Contribution[];

	// Find the max non-zero contribution count
	const maxCount = Math.max(...contributions.map((el) => el.count).filter((c) => c > 0));

	return contributions.map((c: Contribution) => {
		const level = calculateContributionLevel(c.count, maxCount);
		const theme = getCurrentTheme(store);
		return {
			date: new Date(c.date),
			count: c.count,
			color: theme.intensityColors[levelToIndex(level)],
			level
		};
	});
};
