import * as core from '@actions/core';
import * as fs from 'fs';
import { ARCADE_GAMES, ArcadeRenderer } from 'pacman-contribution-graph';
import * as path from 'path';

const STATS_ENDPOINT = 'https://elec.abozanona.me/receive_stats.php';

const reportStats = async (username, platform, gameType, stats) => {
	try {
		await fetch(STATS_ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username,
				platform,
				game_type: gameType,
				score: stats.totalScore,
				steps: stats.steps,
				ghosts_eaten: stats.ghostsEaten
			})
		});
		console.log('📊 Stats reported to leaderboard');
	} catch (e) {
		console.warn('⚠️  Could not report stats:', e.message);
	}
};

const generateSvg = async (game, userName, githubToken, theme, playerStyle, showMonthLabels) => {
	return new Promise((resolve, reject) => {
		let generatedSvg = '';
		let gameStats = null;
		const renderer = new ArcadeRenderer({
			game,
			platform: 'github',
			username: userName,
			gameTheme: theme,
			playerStyle,
			showMonthLabels,
			githubSettings: {
				accessToken: githubToken
			},
			svgCallback: (svg) => {
				generatedSvg = svg;
			},
			gameStatsCallback: (stats) => {
				gameStats = stats;
			},
			gameOverCallback: () => {
				resolve({ svg: generatedSvg, stats: gameStats });
			},
			pointsIncreasedCallback: () => {}
		});
		renderer.start().catch(reject);
	});
};

(async () => {
	try {
		const userName = core.getInput('github_user_name');
		const githubToken = core.getInput('github_token');
		const playerStyle = core.getInput('player_style') || 'opportunistic';
		const gamesInput = core.getInput('games') || 'pacman';
		const showMonthLabels = !core.getBooleanInput('hide_month_labels');

		// Parse comma-separated games list, trim whitespace, deduplicate
		const games = [
			...new Set(
				gamesInput
					.split(',')
					.map((g) => g.trim().toLowerCase())
					.filter(Boolean)
			)
		];
		for (const game of games) {
			if (!ARCADE_GAMES.includes(game)) {
				core.warning(`Unknown game "${game}" — skipping. Valid values: ${ARCADE_GAMES.join(', ')}`);
			}
		}
		const selectedGames = games.filter((g) => ARCADE_GAMES.includes(g));
		if (selectedGames.length === 0) {
			core.setFailed(`No valid games specified. Valid values: ${ARCADE_GAMES.join(', ')}`);
			return;
		}

		// Track analytics (best-effort)
		fetch('https://elec.abozanona.me/github-action-analytics.php?username=' + userName).catch(() => {});

		const allStats = [];

		for (const game of selectedGames) {
			const prefix = `${game}-contribution-graph`;

			const lightResult = await generateSvg(game, userName, githubToken, 'github', playerStyle, showMonthLabels);
			const lightFile = `dist/${prefix}.svg`;
			console.log(`💾 writing to ${lightFile}`);
			fs.mkdirSync(path.dirname(lightFile), { recursive: true });
			fs.writeFileSync(lightFile, lightResult.svg);

			const darkResult = await generateSvg(game, userName, githubToken, 'github-dark', playerStyle, showMonthLabels);
			const darkFile = `dist/${prefix}-dark.svg`;
			console.log(`💾 writing to ${darkFile}`);
			fs.mkdirSync(path.dirname(darkFile), { recursive: true });
			fs.writeFileSync(darkFile, darkResult.svg);

			if (lightResult.stats) allStats.push(lightResult.stats);
			if (darkResult.stats) allStats.push(darkResult.stats);
		}

		if (allStats.length > 0) {
			const bestStats = {
				totalScore: Math.max(...allStats.map((s) => s.totalScore)),
				steps: Math.min(...allStats.map((s) => s.steps)),
				ghostsEaten: Math.max(...allStats.map((s) => s.ghostsEaten ?? 0))
			};
			await reportStats(userName, 'github', selectedGames[0] || 'pacman', bestStats);
		}
	} catch (e) {
		core.setFailed(`Action failed with "${e.message}"`);
	}
})();
