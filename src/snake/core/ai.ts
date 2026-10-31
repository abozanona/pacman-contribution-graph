import { Position } from '../types';
import { GRID_HEIGHT, GRID_WIDTH } from './constants';

const DIRECTIONS: Position[] = [
	{ x: 1, y: 0 },
	{ x: 0, y: 1 },
	{ x: 0, y: -1 },
	{ x: -1, y: 0 }
];

export const keyOf = (p: Position) => p.y * GRID_WIDTH + p.x;

export const samePosition = (a: Position, b: Position) => a.x === b.x && a.y === b.y;

export const inBounds = (p: Position) => p.x >= 0 && p.x < GRID_WIDTH && p.y >= 0 && p.y < GRID_HEIGHT;

export const getNeighbors = (p: Position): Position[] => DIRECTIONS.map((d) => ({ x: p.x + d.x, y: p.y + d.y })).filter(inBounds);

/** Cells the head cannot enter on its next move. The tail is free unless the snake is about to grow. */
export const blockedCells = (body: Position[], growing: boolean): Set<number> => {
	const blocked = new Set<number>();
	const end = growing ? body.length : body.length - 1;
	for (let i = 0; i < end; i++) blocked.add(keyOf(body[i]));
	return blocked;
};

/**
 * Breadth-first search from `start` to every cell matching `isTarget`.
 * Returns the paths (excluding `start`) to all targets at the minimal distance.
 */
export const findNearest = (start: Position, blocked: Set<number>, isTarget: (p: Position) => boolean): Position[][] => {
	const previous = new Map<number, Position | null>([[keyOf(start), null]]);
	let frontier: Position[] = [start];
	const found: Position[] = [];

	while (frontier.length > 0 && found.length === 0) {
		const next: Position[] = [];
		for (const current of frontier) {
			for (const neighbor of getNeighbors(current)) {
				const key = keyOf(neighbor);
				if (previous.has(key) || blocked.has(key)) continue;
				previous.set(key, current);
				if (isTarget(neighbor)) found.push(neighbor);
				next.push(neighbor);
			}
		}
		frontier = next;
	}

	return found.map((target) => {
		const path: Position[] = [];
		let cursor: Position | null | undefined = target;
		while (cursor && !samePosition(cursor, start)) {
			path.unshift(cursor);
			cursor = previous.get(keyOf(cursor));
		}
		return path;
	});
};

export const distanceBetween = (from: Position, to: Position, blocked: Set<number>): number => {
	const paths = findNearest(from, blocked, (p) => samePosition(p, to));
	return paths.length > 0 ? paths[0].length : -1;
};

/** Number of free cells reachable from `start`, used to pick the roomiest escape. */
export const reachableArea = (start: Position, blocked: Set<number>): number => {
	const seen = new Set<number>([keyOf(start)]);
	const queue = [start];
	while (queue.length > 0) {
		const current = queue.pop() as Position;
		for (const neighbor of getNeighbors(current)) {
			const key = keyOf(neighbor);
			if (seen.has(key) || blocked.has(key)) continue;
			seen.add(key);
			queue.push(neighbor);
		}
	}
	return seen.size;
};

/** Body after the head walks along `path`, assuming it gains `growth` segments on the way. */
export const simulateWalk = (body: Position[], path: Position[], growth: number): Position[] => {
	const walked = [...path].reverse().concat(body);
	return walked.slice(0, body.length + Math.min(growth, path.length));
};

/** A position is safe when the head can still reach its own tail, so it can never box itself in. */
export const canReachTail = (body: Position[]): boolean => {
	if (body.length < 3) return true;
	const tail = body[body.length - 1];
	return distanceBetween(body[0], tail, blockedCells(body, false)) > 0;
};
