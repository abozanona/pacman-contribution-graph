import { GhostName, StoreType } from '../types';
export declare const determineGhostName: (index: number) => GhostName;
export declare const Game: {
    startGame: (store: StoreType) => Promise<void>;
    stopGame: (store: StoreType) => Promise<void>;
};
