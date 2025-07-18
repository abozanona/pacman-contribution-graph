import { StoreType } from '../types';
export declare const Canvas: {
    resizeCanvas: (store: StoreType) => void;
    drawGrid: (store: StoreType) => void;
    drawPacman: (store: StoreType) => void;
    drawGhosts: (store: StoreType) => void;
    renderGameOver: (store: StoreType) => void;
    drawSoundController: (store: StoreType) => void;
    listenToSoundController: (store: StoreType) => void;
};
