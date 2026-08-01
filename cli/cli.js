#!/usr/bin/env node

// Run `npm link` to test locally
import fs from 'fs';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import { ARCADE_GAMES, ArcadeRenderer, PLATFORMS, SCENARIOS } from '../dist/pacman-contribution-graph.min.js';

const argv = yargs(hideBin(process.argv))
	.option('game', {
		alias: 'g',
		describe: `Game to generate: ${ARCADE_GAMES.join(', ')}`,
		choices: ARCADE_GAMES,
		default: 'pacman',
		type: 'string'
	})
	.option('platform', {
		alias: 'pl',
		describe: `Platform: ${PLATFORMS.join(', ')}`,
		choices: PLATFORMS,
		demandOption: true,
		type: 'string'
	})
	.option('gameTheme', {
		alias: 'gt',
		describe: 'Game theme: github, github-dark, gitlab, gitlab-dark',
		choices: ['github', 'github-dark', 'gitlab', 'gitlab-dark'],
		type: 'string'
	})
	.option('username', {
		alias: 'un',
		describe: 'Username for the platform',
		demandOption: true,
		type: 'string'
	})
	.option('scenario', {
		alias: 's',
		describe: `Use a predefined contribution scenario instead of fetching user contributions: ${SCENARIOS.join(', ')}. Without a value, random is used.`,
		choices: SCENARIOS,
		default: 'random',
		type: 'string'
	})
	.option('output', {
		alias: 'o',
		describe: 'Output file (SVG)',
		default: 'contribution-graph.svg',
		type: 'string'
	})
	.option('hideMonthLabels', {
		alias: 'hm',
		describe: 'Hide the month labels row above the contribution grid',
		type: 'boolean',
		default: false
	})

	.help().argv;

const renderer = new ArcadeRenderer({
	game: argv.game,
	platform: argv.platform,
	username: argv.username,
	gameTheme: argv.gameTheme ?? (argv.platform === 'gitlab' ? 'gitlab' : 'github'),
	scenario: argv.scenario,
	showMonthLabels: !argv.hideMonthLabels,
	svgCallback: (svg) => {
		fs.writeFileSync(argv.output, svg);
		console.log(`SVG saved to ${argv.output}`);
	}
});

try {
	await renderer.start();
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exit(1);
}
