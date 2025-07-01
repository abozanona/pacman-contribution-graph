import { Game } from './game';
import { Grid } from './grid';
import { Store } from './store';
import { Config, StoreType } from './types';
import { Utils } from './utils';

export class PacmanRenderer {
	store: StoreType;
	conf: Config;

	constructor(conf: Config) {
		this.store = structuredClone(Store);
		this.conf = { ...conf };
		Grid.buildWalls();
	}

	public async start() {
		const defaultConfing: Config = {
			platform: 'github',
			username: '',
			canvas: undefined as unknown as HTMLCanvasElement,
			outputFormat: 'svg',
			svgCallback: (_: string) => {},
			gameOverCallback: () => {},
			gameTheme: 'github',
			gameSpeed: 1,
			enableSounds: false,
			pointsIncreasedCallback: (_: number) => {}
		};
		this.store.config = { ...defaultConfing, ...this.conf };

		// Fetch contributions based on platform
		switch (this.conf.platform) {
			case 'gitlab':
				this.store.contributions = await Utils.getGitlabContribution(this.store);
				break;
			case 'github':
				this.store.contributions = await Utils.getGithubContribution(this.store);
				break;
		}

		// Start the game with real contributions
		await Game.startGame(this.store);
	}

	public stop() {
		Game.stopGame(this.store);
	}
}
