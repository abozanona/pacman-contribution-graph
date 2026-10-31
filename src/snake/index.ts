import { Providers } from '../shared/providers/providers';
import { Utils } from '../shared/utils/utils';
import { Game } from '../snake/core/game';
import { Store } from '../snake/core/store';
import type { SnakeConfig, SnakeStore } from '../snake/types';

export type { SnakeConfig } from '../snake/types';

export class SnakeRenderer {
	store!: SnakeStore;
	conf: SnakeConfig;

	constructor(conf: SnakeConfig) {
		this.conf = { ...conf };
	}

	public async start() {
		const defaultConfig: SnakeConfig = {
			platform: 'github',
			username: '',
			svgCallback: (_: string) => {},
			gameOverCallback: () => {},
			gameTheme: 'github',
			pointsIncreasedCallback: (_: number) => {},
			githubSettings: { accessToken: '' }
		};

		this.store = JSON.parse(JSON.stringify(Store));
		this.store.config = { ...defaultConfig, ...this.conf };

		this.store.contributions = await Providers.fetchContributions(this.store);

		Utils.buildGrid(this.store);
		Utils.buildMonthLabels(this.store);

		await Game.startGame(this.store);
		return this.store;
	}

	public stop() {
		Game.stopGame(this.store);
	}
}
