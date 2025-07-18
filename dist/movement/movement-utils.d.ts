import { Point2d } from '../types';
export declare const MovementUtils: {
    getValidMoves: (x: number, y: number) => [
        number,
        number
    ][];
    calculateDistance: (x1: number, y1: number, x2: number, y2: number) => number;
    /**
     * Dijkstra's 4-way grid.
     * Returns the NEXT step (not the entire route) or null if none.
     */
    findNextStepDijkstra(start: Point2d, target: Point2d): Point2d | null;
};
