import { GRID_HEIGHT, GRID_WIDTH, WALLS, hasWall, setWall } from '../core/constants';

describe('Walls and constants', () => {
	beforeEach(() => {
		// reset WALLS
		for (let x = 0; x < WALLS.horizontal.length; x++) {
			for (let y = 0; y < WALLS.horizontal[0].length; y++) {
				WALLS.horizontal[x][y] = { active: false, id: '' };
			}
		}
		for (let x = 0; x < WALLS.vertical.length; x++) {
			for (let y = 0; y < WALLS.vertical[0].length; y++) {
				WALLS.vertical[x][y] = { active: false, id: '' };
			}
		}
	});

	it('GRID sizes are positive and standard', () => {
		expect(GRID_WIDTH).toBeGreaterThan(0);
		expect(GRID_HEIGHT).toBe(7);
	});

	it('setWall toggles correct cells and hasWall reflects it', () => {
		setWall(0, 0, 'horizontal', 'X');
		expect(WALLS.horizontal[0][0].active).toBe(true);
		expect(hasWall(0, 0, 'up')).toBe(true);
		expect(hasWall(0, 0, 'down')).toBe(false);

		// For the right side of cell (0,0), the vertical wall is indexed at [x=0][y+1]
		setWall(0, 1, 'vertical', 'Y');
		expect(WALLS.vertical[0][1].active).toBe(true);
		expect(hasWall(0, 0, 'right')).toBe(true);
		expect(hasWall(0, 0, 'left')).toBe(false);
	});
});
