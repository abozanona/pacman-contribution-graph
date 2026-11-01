import { BaseConfig, BaseStore, Contribution, ContributionLevel, GridCell } from '../shared/types';

export interface Position {
	x: number;
	y: number;
}

/**
 * - `empty`: nothing there
 * - `contribution`: one of the user's contributions, fixed in place
 * - `piece`: a square left behind by a landed piece
 * - `falling`: the piece currently dropping
 * - `clearing`: part of a line of 5+ that is flashing before it disappears
 * - `fading`: a leftover piece square fading away after the game is won
 */
export type TetrisCellKind = 'empty' | 'contribution' | 'piece' | 'falling' | 'clearing' | 'fading';

export interface TetrisCell {
	kind: TetrisCellKind;
	/** Index into the piece palette for `piece`/`falling` cells. */
	pieceColor?: number;
	level?: ContributionLevel;
	/** Frame within the clear animation for `clearing` cells. */
	flash?: number;
	/** How far a `fading` cell has faded, from 0 (piece colour) to 1 (empty). */
	fade?: number;
}

export interface TetrisSnapshot {
	cells: TetrisCell[][];
}

export interface TetrisConfig extends BaseConfig {}

export interface TetrisStore extends BaseStore {
	contributions: Contribution[];
	grid: GridCell[][];
	monthLabels: string[];
	config: TetrisConfig;
	gameInterval: number;
	frameCount: number;
	board: TetrisCell[][];
	snapshots: TetrisSnapshot[];
	score: number;
	piecesPlaced: number;
	linesCleared: number;
	contributionsLeft: number;
}
