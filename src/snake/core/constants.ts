import { CELL_SIZE, DELTA_TIME, GAP_SIZE, GRID_HEIGHT, GRID_WIDTH } from '../../shared/constants';

export { CELL_SIZE, DELTA_TIME, GAP_SIZE, GRID_HEIGHT, GRID_WIDTH };

export const SNAKE_HEADER_HEIGHT = 24;
export const SNAKE_CELL_RADIUS = 3;
export const SNAKE_INITIAL_LENGTH = 4;
export const SNAKE_MIN_DURATION_MS = 5000;
export const SNAKE_DURATION_DIVISOR = 1.5;
export const SNAKE_MAX_STEPS = GRID_WIDTH * GRID_HEIGHT * 8;
/** How long the snake may chase its own tail before it gets hungry enough to take a risk. */
export const SNAKE_MAX_IDLE_STEPS = GRID_WIDTH * GRID_HEIGHT;
export const SNAKE_BITE_FRAMES = 3;
export const SNAKE_SHED_FRAMES = 4;
export const SNAKE_END_HOLD_FRAMES = 12;
/** Score awarded per contribution level (index = level). */
export const SNAKE_LEVEL_POINTS = [0, 1, 2, 3, 5];
