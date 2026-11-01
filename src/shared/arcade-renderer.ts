import { BombermanConfig, BombermanRenderer } from '../bomberman/index';
import { BreakoutConfig, BreakoutRenderer } from '../breakout/index';
import { GalagaConfig, GalagaRenderer } from '../galaga/index';
import { MinesweeperConfig, MinesweeperRenderer } from '../minesweeper/index';
import { PacmanConfig, PacmanRenderer, PlayerStyle } from '../pacman/index';
import { PuzzleBobbleConfig, PuzzleBobbleRenderer } from '../puzzle-bobble/index';
import { SnakeConfig, SnakeRenderer } from '../snake/index';
import { TetrisConfig, TetrisRenderer } from '../tetris/index';
import { BaseConfig } from './types';

export { PlayerStyle };

export interface ArcadeConfig extends BaseConfig {
	game: GameType;
	playerStyle?: PlayerStyle;
}

interface GameRegistryEntry {
	label: string;
	factory: (conf: ArcadeConfig) => { start(): Promise<unknown>; stop(): void };
}

const gameRegistry = {
	pacman: {
		label: '👻 Pac-Man',
		factory: (conf: ArcadeConfig) => new PacmanRenderer(conf as PacmanConfig)
	},
	breakout: {
		label: '🧱 Breakout',
		factory: (conf: ArcadeConfig) => new BreakoutRenderer(conf as BreakoutConfig)
	},
	galaga: {
		label: '🚀 Galaga',
		factory: (conf: ArcadeConfig) => new GalagaRenderer(conf as GalagaConfig)
	},
	'puzzle-bobble': {
		label: '🫧 Puzzle Bobble',
		factory: (conf: ArcadeConfig) => new PuzzleBobbleRenderer(conf as PuzzleBobbleConfig)
	},
	bomberman: {
		label: '💣 Bomberman',
		factory: (conf: ArcadeConfig) => new BombermanRenderer(conf as BombermanConfig)
	},
	minesweeper: {
		label: '💠 Minesweeper',
		factory: (conf: ArcadeConfig) => new MinesweeperRenderer(conf as MinesweeperConfig)
	},
	snake: {
		label: '🐍 Snake',
		factory: (conf: ArcadeConfig) => new SnakeRenderer(conf as SnakeConfig)
	},
	tetris: {
		label: '🟪 Tetris',
		factory: (conf: ArcadeConfig) => new TetrisRenderer(conf as TetrisConfig)
	}
} satisfies Record<string, GameRegistryEntry>;

export type GameType = keyof typeof gameRegistry;

export const GAME_REGISTRY: Record<GameType, GameRegistryEntry> = gameRegistry as Record<GameType, GameRegistryEntry>;

export const ARCADE_GAMES: readonly GameType[] = Object.keys(GAME_REGISTRY) as GameType[];

export class ArcadeRenderer {
	private renderer: { start(): Promise<unknown>; stop(): void };

	constructor(conf: ArcadeConfig) {
		const entry = GAME_REGISTRY[conf.game];
		if (!entry) {
			throw new Error(`Unknown game "${conf.game}". Valid games: ${ARCADE_GAMES.join(', ')}`);
		}
		this.renderer = entry.factory(conf);
	}

	public async start() {
		return this.renderer.start();
	}

	public stop() {
		this.renderer.stop();
	}
}
