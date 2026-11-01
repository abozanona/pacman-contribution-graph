import { Providers } from '../shared/providers/providers';
import { Utils } from '../shared/utils/utils';
import { Game } from '../tetris/core/game';
import { Store } from '../tetris/core/store';
import type { TetrisConfig, TetrisStore } from '../tetris/types';

export type { TetrisConfig } from '../tetris/types';

export class TetrisRenderer {
	store!: TetrisStore;
	conf: TetrisConfig;

	constructor(conf: TetrisConfig) {
		this.conf = { ...conf };
	}

	public async start() {
		const defaultConfig: TetrisConfig = {
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
