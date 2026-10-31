import { SnakeConfig, SnakeStore } from '../types';

export const Store: SnakeStore = {
	contributions: [],
	grid: [],
	monthLabels: [],
	config: undefined as unknown as SnakeConfig,
	gameInterval: 0,
	frameCount: 0,
	body: [],
	cells: [],
	score: 0,
	pendingGrowth: 0,
	meals: [],
	activeMeals: {},
	snapshots: [],
	bites: 0
};
