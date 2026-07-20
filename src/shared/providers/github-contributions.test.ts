import { fetchGithubContributions } from './github-contributions';
import type { BaseStore } from '../types';

const createStore = (): BaseStore => ({
	config: {
		platform: 'github',
		username: 'octocat',
		gameTheme: 'github',
		githubSettings: { accessToken: 'test-token' },
		svgCallback: () => {},
		gameOverCallback: () => {},
		pointsIncreasedCallback: () => {}
	},
	contributions: [],
	grid: [],
	monthLabels: []
});

const createResponse = (body: unknown, status = 200, statusText = 'OK') =>
	({
		ok: status >= 200 && status < 300,
		status,
		statusText,
		json: jest.fn().mockResolvedValue(body)
	}) as unknown as Response;

describe('GitHub GraphQL contributions', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('maps a valid contribution calendar response', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			createResponse({
				data: {
					user: {
						contributionsCollection: {
							contributionCalendar: {
								weeks: [
									{
										contributionDays: [
											{
												date: '2026-07-20',
												contributionCount: 5,
												color: '#40c463',
												contributionLevel: 'SECOND_QUARTILE'
											}
										]
									}
								]
							}
						}
					}
				}
			})
		);

		await expect(fetchGithubContributions(createStore())).resolves.toEqual([
			{
				date: new Date('2026-07-20'),
				count: 5,
				color: '#40c463',
				level: 'SECOND_QUARTILE'
			}
		]);
	});

	it('surfaces GraphQL errors returned with an HTTP 200 response', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			createResponse({
				data: null,
				errors: [{ message: 'Resource not accessible by integration' }, { message: 'Rate limit exceeded' }]
			})
		);

		await expect(fetchGithubContributions(createStore())).rejects.toThrow(
			'GitHub GraphQL request failed: Resource not accessible by integration; Rate limit exceeded'
		);
	});

	it('preserves the HTTP status when GitHub rejects the request', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(createResponse({}, 401, 'Unauthorized'));

		await expect(fetchGithubContributions(createStore())).rejects.toThrow('GitHub GraphQL request failed: 401 Unauthorized');
	});

	it('reports a missing user without leaking an internal TypeError', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(createResponse({ data: { user: null } }));

		await expect(fetchGithubContributions(createStore())).rejects.toThrow(
			'GitHub GraphQL response did not include contribution data for "octocat"'
		);
	});

	it('reports a malformed success payload without leaking an internal TypeError', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(createResponse({ data: { user: {} } }));

		await expect(fetchGithubContributions(createStore())).rejects.toThrow(
			'GitHub GraphQL response did not include contribution data for "octocat"'
		);
	});
});
