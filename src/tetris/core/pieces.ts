import { Position } from '../types';

/** The seven four-square pieces, each listed in every distinct rotation. */
const BASE_SHAPES: Position[][] = [
	[
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 2, y: 0 },
		{ x: 3, y: 0 }
	],
	[
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 0, y: 1 },
		{ x: 1, y: 1 }
	],
	[
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 2, y: 0 },
		{ x: 1, y: 1 }
	],
	[
		{ x: 1, y: 0 },
		{ x: 2, y: 0 },
		{ x: 0, y: 1 },
		{ x: 1, y: 1 }
	],
	[
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 1, y: 1 },
		{ x: 2, y: 1 }
	],
	[
		{ x: 0, y: 0 },
		{ x: 0, y: 1 },
		{ x: 1, y: 1 },
		{ x: 2, y: 1 }
	],
	[
		{ x: 2, y: 0 },
		{ x: 0, y: 1 },
		{ x: 1, y: 1 },
		{ x: 2, y: 1 }
	]
];

const normalize = (cells: Position[]): Position[] => {
	const minX = Math.min(...cells.map((c) => c.x));
	const minY = Math.min(...cells.map((c) => c.y));
	return cells.map((c) => ({ x: c.x - minX, y: c.y - minY })).sort((a, b) => a.y - b.y || a.x - b.x);
};

const rotate = (cells: Position[]): Position[] => normalize(cells.map((c) => ({ x: -c.y, y: c.x })));

const allRotations = (shape: Position[]): Position[][] => {
	const rotations: Position[][] = [];
	let current = normalize(shape);
	for (let i = 0; i < 4; i++) {
		if (!rotations.some((r) => JSON.stringify(r) === JSON.stringify(current))) rotations.push(current);
		current = rotate(current);
	}
	return rotations;
};

export const PIECES: Position[][][] = BASE_SHAPES.map(allRotations);

/** Small deterministic PRNG so the same contribution graph always plays the same game. */
export const createRandom = (seed: number) => {
	let state = seed >>> 0 || 1;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};
