import { BaseConfig, BaseStore, Contribution, ContributionLevel, GridCell } from '../shared/types';

export interface Position {
	x: number;
	y: number;
}

export type SnakeCellState = 'food' | 'empty' | 'body' | 'bite' | 'shed';

export interface SnakeMeal {
	/** Frame in which the food was swallowed. */
	frameIndex: number;
	x: number;
	y: number;
	color: string;
	level: ContributionLevel;
	/** Whether this meal makes the snake grow once it is digested (reaches the tail). */
	grows: boolean;
}

export interface SnakeSnapshot {
	/** body[0] is the head. */
	body: Position[];
	cells: SnakeCellState[][];
	score: number;
	/** Body index of each meal currently travelling down the snake, keyed by meal index. */
	meals: Record<number, number>;
}

export interface SnakeConfig extends BaseConfig {}

export interface SnakeStore extends BaseStore {
	contributions: Contribution[];
	grid: GridCell[][];
	monthLabels: string[];
	config: SnakeConfig;
	gameInterval: number;
	frameCount: number;
	body: Position[];
	cells: SnakeCellState[][];
	score: number;
	pendingGrowth: number;
	meals: SnakeMeal[];
	activeMeals: Record<number, number>;
	snapshots: SnakeSnapshot[];
	bites: number;
}
