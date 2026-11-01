import { CELL_SIZE, DELTA_TIME, GAP_SIZE, GRID_HEIGHT, GRID_WIDTH } from '../../shared/constants';

export { CELL_SIZE, DELTA_TIME, GAP_SIZE, GRID_HEIGHT, GRID_WIDTH };

export const TETRIS_HEADER_HEIGHT = 24;
export const TETRIS_CELL_RADIUS = 3;
export const TETRIS_MIN_DURATION_MS = 5000;
export const TETRIS_DURATION_DIVISOR = 1.5;
/** A horizontal run of at least this many filled squares is cleared. */
export const TETRIS_LINE_LENGTH = 5;
export const TETRIS_MAX_PIECES = GRID_WIDTH * GRID_HEIGHT * 2;
/** Give up after this many pieces in a row that clear no contributions. */
export const TETRIS_MAX_IDLE_PIECES = 150;
export const TETRIS_CLEAR_FLASH_FRAMES = 2;
export const TETRIS_END_HOLD_FRAMES = 12;
/** Frames over which leftover piece squares fade away at the end. */
export const TETRIS_FADE_FRAMES = 10;
/** Score awarded per cleared contribution, by level (index = level). Piece squares are worth 1. */
export const TETRIS_LEVEL_POINTS = [0, 10, 20, 30, 50];
