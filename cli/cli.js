#!/usr/bin/env node

// Run `npm link` to test locally
import fs from 'fs';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import { PacmanRenderer } from '../dist/pacman-contribution-graph.min.js';

const argv = yargs(hideBin(process.argv))
    .option('platform', {
        alias: 'pl',
        describe: 'Platform: github, gitlab',
        choices: ['github', 'gitlab'],
        demandOption: true,
        type: 'string'
    })
    .option('gameTheme', {
        alias: 'gt',
        describe: 'Game theme: github, github-dark, gitlab, gitlab-dark',
        choices: ['github', 'github-dark', 'gitlab', 'gitlab-dark'],
        demandOption: true,
        type: 'string'
    })
    .option('username', {
        alias: 'un',
        describe: 'Username for the platform',
        demandOption: true,
        type: 'string'
    })
    .option('output', {
        alias: 'o',
        describe: 'Output file (SVG)',
        default: 'pacman-contribution-graph.svg',
        type: 'string'
    })
    .help()
    .argv;

const pr = new PacmanRenderer({
    platform: argv.platform,
    username: argv.username,
    gameTheme: argv.gameTheme,
    outputFormat: 'svg',
    svgCallback: (svg) => {
        fs.writeFileSync(argv.output, svg);
        console.log(`SVG saved to ${argv.output}`);
    }
});

pr.start();
