import { GameTheme, GhostName, ThemeKeys } from '../types';
export declare const CELL_SIZE = 20;
export declare const GAP_SIZE = 2;
export declare const GRID_WIDTH = 53;
export declare const GRID_HEIGHT = 7;
export declare const PACMAN_COLOR = "yellow";
export declare const PACMAN_COLOR_POWERUP = "red";
export declare const PACMAN_COLOR_DEAD = "#80808064";
export declare const GHOST_NAMES: GhostName[];
export declare const MONTHS: string[];
export declare const DELTA_TIME = 200;
export declare const PACMAN_DEATH_DURATION = 10;
export declare const PACMAN_POWERUP_DURATION = 15;
export declare const GAME_THEMES: {
    [key in ThemeKeys]: GameTheme;
};
export declare const GHOSTS: {
    [key in GhostName | 'scared']: {
        [direction in 'up' | 'down' | 'left' | 'right']?: string;
    } | {
        imgDate: string;
    };
};
export declare const WALLS: {
    horizontal: {
        active: boolean;
        id: string;
        color?: string;
    }[][];
    vertical: {
        active: boolean;
        id: string;
        color?: string;
    }[][];
};
export declare const setWall: (x: number, y: number, direction: 'horizontal' | 'vertical', lineId: string, color?: string) => void;
export declare const hasWall: (x: number, y: number, direction: 'up' | 'down' | 'left' | 'right') => boolean;
