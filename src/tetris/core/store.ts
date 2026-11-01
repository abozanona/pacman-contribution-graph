import { TetrisConfig, TetrisStore } from '../types';

export const Store: TetrisStore = {
	contributions: [],
	grid: [],
	monthLabels: [],
	config: undefined as unknown as TetrisConfig,
	gameInterval: 0,
	frameCount: 0,
	board: [],
	snapshots: [],
	score: 0,
	piecesPlaced: 0,
	linesCleared: 0,
	contributionsLeft: 0
};
