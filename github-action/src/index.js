import * as core from '@actions/core';
import * as fs from 'fs';
import { PacmanRenderer } from 'pacman-contribution-graph';
import * as path from 'path';

const generateSvg = async (userName, githubToken, theme, playerStyle) => {
	return new Promise((resolve, reject) => {
		let generatedSvg = '';
		const conf = {
			platform: "github",
			username: userName,
			outputFormat: "svg",
			gameSpeed: 1,
			gameTheme: theme,
			playerStyle,
			githubSettings: {
				accessToken: githubToken
			},
			svgCallback: (svg) => {
				generatedSvg = svg;
			},
			gameOverCallback: () => {
				resolve(generatedSvg);
			}
		}

		const renderer = new PacmanRenderer(conf)
		renderer.start()
	});
}

(async () => {
	try {
		let svgContent = ''
		const userName = core.getInput('github_user_name');
		const githubToken = core.getInput('github_token');
		const playerStyle = core.getInput('player_style') || 'oportunista';
		// TODO: Check active users
		fetch("https://elec.abozanona.me/github-action-analytics.php?username=" + userName)

		svgContent = await generateSvg(userName, githubToken, "github", playerStyle)
		console.log(`💾 writing to dist/pacman-contribution-graph.svg`);
		fs.mkdirSync(path.dirname('dist/pacman-contribution-graph.svg'), { recursive: true });
		fs.writeFileSync('dist/pacman-contribution-graph.svg', svgContent);

		svgContent = await generateSvg(userName, githubToken, "github-dark", playerStyle)
		console.log(`💾 writing to dist/pacman-contribution-graph-dark.svg`);
		fs.mkdirSync(path.dirname('dist/pacman-contribution-graph-dark.svg'), { recursive: true });
		fs.writeFileSync('dist/pacman-contribution-graph-dark.svg', svgContent);
	} catch (e) {
		core.setFailed(`Action failed with "${e.message}"`);
	}
})();
