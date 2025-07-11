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
      useCustomStartPositions: false,
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

if (typeof window !== 'undefined') {
  // Browser environment
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('game-container');
    if (container) {
      const canvas = document.createElement('canvas');
      container.appendChild(canvas);

      const renderer = new PacmanRenderer({
        platform: 'github',
        username: 'diogocarrola',
        canvas: canvas,
        outputFormat: 'canvas',
        svgCallback: () => {},
        gameOverCallback: () => console.log('Game Over'),
        gameTheme: 'github',
        gameSpeed: 1,
        enableSounds: false,
        pointsIncreasedCallback: () => {}
      });

      renderer.start();
    }
  });
} else {
  // CLI environment
  const args = process.argv.slice(2);
  const usernameArg = args.find(arg => arg.startsWith('--username='));
  const outputArg = args.find(arg => arg.startsWith('--output='));

  const username = usernameArg ? usernameArg.split('=')[1] : 'diogocarrola';
  const output = outputArg ? outputArg.split('=')[1] : 'svg';

  const renderer = new PacmanRenderer({
    platform: 'github',
    username: username,
    canvas: null as any,
    outputFormat: output as any,
    svgCallback: (svg) => console.log(svg),
    gameOverCallback: () => {},
    gameTheme: 'github',
    gameSpeed: 1,
    enableSounds: false,
    pointsIncreasedCallback: () => {}
  });

  renderer.start();
}