import type { ContributionLevel, GameTheme, StoreType } from '../types';
export declare const getCurrentTheme: (store: StoreType) => GameTheme;
export declare const levelToIndex: (level: ContributionLevel) => number;
export declare const calculateContributionLevel: (contribution: number, maxContribution: number) => ContributionLevel;
export declare const buildGrid: (store: StoreType) => void;
export declare const buildMonthLabels: (store: StoreType) => void;
export declare const createGridFromData: (store: StoreType) => import("../types").GridCell[][];
export declare const Utils: {
    getCurrentTheme: (store: StoreType) => GameTheme;
    buildGrid: (store: StoreType) => void;
    buildMonthLabels: (store: StoreType) => void;
    createGridFromData: (store: StoreType) => import("../types").GridCell[][];
    levelToIndex: (level: ContributionLevel) => number;
};
