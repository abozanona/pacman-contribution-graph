import { Contribution, ContributionLevel, StoreType } from '../types';
import { calculateContributionLevel, getCurrentTheme, levelToIndex } from '../utils/utils';

interface ContributionDay {
	date: string;
	contributionCount: number;
	color: string;
	contributionLevel: ContributionLevel;
}

interface GraphQLResponse {
	data: {
		user: {
			contributionsCollection: {
				contributionCalendar: {
					weeks: {
						contributionDays: ContributionDay[];
					}[];
				};
			};
		};
	};
}

export const fetchGithubContributions = async (store: StoreType): Promise<Contribution[]> => {
	if (store.config.githubSettings?.accessToken) {
		return await fetchGithubContributionsGraphQL(store);
	} else {
		return await fetchGithubContributionsRest(store);
	}
};

const fetchGithubContributionsRest = async (store: StoreType): Promise<Contribution[]> => {
	const commits: any[] = [];
	let isComplete = false;
	let page = 1;

	do {
		try {
			const headers: HeadersInit = {};
			if (store.config.githubSettings?.accessToken) {
				headers['Authorization'] = 'Bearer ' + store.config.githubSettings.accessToken;
			}
			const response = await fetch(
				`https://api.github.com/search/commits?q=author:${store.config.username}&sort=author-date&order=desc&page=${page}&per_page=100`,
				{ headers }
			);
			const data: { items?: any[] } = await response.json();
			isComplete = !data.items || data.items.length === 0;
			commits.push(...(data.items ?? []));
			page++;
		} catch {
			isComplete = true;
		}
	} while (!isComplete);

	const contributions = Array.from(
		commits
			.reduce((map: any, item: any) => {
				const authorDateStr = item.commit.author?.date?.split('T')[0];
				const committerDateStr = item.commit.committer?.date?.split('T')[0];
				const keyDate = committerDateStr || authorDateStr;
				const count = (map.get(keyDate) || { count: 0 }).count + 1;
				return map.set(keyDate, {
					date: new Date(keyDate),
					count,
					color: '',
					level: 'NONE' as const
				});
			}, new Map())
			.values()
	) as Contribution[];

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

const fetchGithubContributionsGraphQL = async (store: StoreType): Promise<Contribution[]> => {
	const query = /* GraphQL */ `
		query ($login: String!) {
			user(login: $login) {
				contributionsCollection {
					contributionCalendar {
						weeks {
							contributionDays {
								date
								contributionCount
								color
								contributionLevel
							}
						}
					}
				}
			}
		}
	`;

	const response = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${store.config.githubSettings?.accessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query, variables: { login: store.config.username } })
	});

	if (!response.ok) {
		throw new Error(`GitHub GraphQL request failed: ${response.status} ${response.statusText}`);
	}

	const json = (await response.json()) as GraphQLResponse;

	return json.data.user.contributionsCollection.contributionCalendar.weeks
		.map((week) => week.contributionDays)
		.reduce((acc, days) => acc.concat(days), [])
		.map((d) => {
			const level = d.contributionLevel;
			const theme = getCurrentTheme(store);
			return {
				date: new Date(d.date),
				count: d.contributionCount,
				color: theme.intensityColors[levelToIndex(level)],
				level
			};
		});
};
