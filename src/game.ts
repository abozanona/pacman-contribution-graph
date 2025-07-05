import { Canvas } from './canvas';
import { DELTA_TIME, GHOST_NAMES, GRID_HEIGHT, GRID_WIDTH, PACMAN_DEATH_DURATION } from './constants';
import { GhostsMovement } from './movement/ghosts-movement';
import { PacmanMovement } from './movement/pacman-movement';
import { MusicPlayer, Sound } from './music-player';
import { SVG } from './svg';
import { Ghost, Pacman, StoreType } from './types';
import { fetchGitHubContributions } from './utils';

// Place pellets only on contribution cells
const placePellets = (store: StoreType) => {
  store.pellets = [];
  store.contributionGrid.forEach((row, y) => {
    row.forEach((count, x) => {
      if (count > 0 && Math.random() > 0.7) {
        store.pellets.push({ x, y });
      }
    });
  });
};

// Place Pacman at a valid position
const placePacman = (store: StoreType) => {
  const validPositions: {x: number, y: number}[] = [];
  store.contributionGrid.forEach((row, y) => {
    row.forEach((count, x) => {
      if (count > 0) validPositions.push({x, y});
    });
  });

  if (validPositions.length === 0) return;

  const pos = validPositions[Math.floor(Math.random() * validPositions.length)];
  store.pacman = {
    x: pos.x,
    y: pos.y,
    direction: 'right',
    points: 0,
    totalPoints: 0,
    deadRemainingDuration: 0,
    powerupRemainingDuration: 0,
    recentPositions: []
  };

  if (store.config.outputFormat === 'canvas') Canvas.drawPacman(store);
};

// Place ghosts at valid positions away from Pacman
const placeGhosts = (store: StoreType) => {
  store.ghosts = [];

  const findGhostPosition = (minDistance: number) => {
    const validPositions: {x: number, y: number}[] = [];
    store.contributionGrid.forEach((row, y) => {
      row.forEach((count, x) => {
        const dist = Math.abs(x - store.pacman.x) + Math.abs(y - store.pacman.y);
        if (count > 0 && dist > minDistance) {
          validPositions.push({x, y});
        }
      });
    });

    if (validPositions.length === 0) {
      return {x: 0, y: 0};
    }

    return validPositions[Math.floor(Math.random() * validPositions.length)];
  };

  // Place 4 ghosts at different distances from Pacman
  store.ghosts.push({
    x: findGhostPosition(10).x,
    y: findGhostPosition(10).y,
    name: GHOST_NAMES[0],
    scared: false
  });

  store.ghosts.push({
    x: findGhostPosition(15).x,
    y: findGhostPosition(15).y,
    name: GHOST_NAMES[1],
    scared: false
  });

  store.ghosts.push({
    x: findGhostPosition(20).x,
    y: findGhostPosition(20).y,
    name: GHOST_NAMES[2],
    scared: false
  });

  store.ghosts.push({
    x: findGhostPosition(25).x,
    y: findGhostPosition(25).y,
    name: GHOST_NAMES[3],
    scared: false
  });

  if (store.config.outputFormat === 'canvas') Canvas.drawGhosts(store);
};

// Update startGame to use real contribution data and place pellets
const startGame = async (store: StoreType) => {
  if (store.config.outputFormat === 'canvas') {
    store.config.canvas = store.config.canvas;
    Canvas.resizeCanvas(store);
    Canvas.listenToSoundController(store);
  }

  store.frameCount = 0;

  // Fetch and use real contribution grid
  store.contributionGrid = await fetchGitHubContributions(store.config.username);
  console.log("Contribution Grid:");
  console.table(store.contributionGrid);

  store.grid = store.contributionGrid.map(row =>
    row.map(count => ({
      commitsCount: count,
      intensity: count > 0 ? 1 : 0
    }))
  );

  // Place pellets on contribution cells
  placePellets(store);
  console.log("Pellets at positions:", store.pellets);

  // Initialize ghosts array
  store.ghosts = [];

  if (store.config.outputFormat === 'canvas') Canvas.drawGrid(store);

  if (store.config.outputFormat === 'canvas') {
    if (!store.config.enableSounds) {
      MusicPlayer.getInstance().mute();
    }
    await MusicPlayer.getInstance().preloadSounds();
    MusicPlayer.getInstance().startDefaultSound();
    await MusicPlayer.getInstance().play(Sound.BEGINNING);
  }

  const remainingCells = () => store.grid.some(row => row.some(cell => cell.intensity > 0));
  if (remainingCells()) {
    placePacman(store);
    placeGhosts(store);
  }

  if (store.config.outputFormat === 'svg') {
    while (remainingCells()) {
      await updateGame(store);
    }
    // One more time to generate svg
    await updateGame(store);
  } else {
    if (store.gameInterval) {
      clearInterval(store.gameInterval as number | NodeJS.Timeout);
    }
    store.gameInterval = setInterval(async () => await updateGame(store), DELTA_TIME);
  }
};

const stopGame = async (store: StoreType) => {
  if (store.gameInterval) {
    clearInterval(store.gameInterval as number | NodeJS.Timeout);
    store.gameInterval = null;
  }
};

const updateGame = async (store: StoreType) => {
	store.frameCount++;
	if (store.frameCount % store.config.gameSpeed !== 0) {
		store.gameHistory.push({
			pacman: { ...store.pacman },
			ghosts: store.ghosts.map((ghost) => ({ ...ghost })),
			grid: store.grid.map((row) => [...row.map((col) => col.intensity)])
		});
		return;
	}

	if (store.pacman.deadRemainingDuration) {
		store.pacman.deadRemainingDuration--;
		if (!store.pacman.deadRemainingDuration) {
			// IT'S ALIVE!
			placeGhosts(store);
			if (store.config.outputFormat == 'canvas')
				MusicPlayer.getInstance()
					.play(Sound.GAME_OVER)
					.then(() => MusicPlayer.getInstance().startDefaultSound());
		}
	}

	if (store.pacman.powerupRemainingDuration) {
		store.pacman.powerupRemainingDuration--;
		if (store.pacman.powerupRemainingDuration < 3 * (1000 / DELTA_TIME)) {
			store.ghosts.forEach((ghost) => {
				if (ghost.scared) ghost.flashing = (store.pacman.powerupRemainingDuration % 2 === 0);
			});
		}
		if (!store.pacman.powerupRemainingDuration) {
			store.ghosts.forEach((ghost) => {
				ghost.scared = false;
				ghost.flashing = false;
			});
			store.pacman.points = 0;
		}
	}

	const remainingCells = store.grid.some((row) => row.some((cell) => cell.intensity > 0));
	if (!remainingCells) {
    if (store.config.outputFormat == 'canvas') {
      if (store.gameInterval !== null && store.gameInterval !== undefined) {
        clearInterval(store.gameInterval as number | NodeJS.Timeout);
      }
      if (store.config.outputFormat == 'canvas') {
        Canvas.renderGameOver(store);
        MusicPlayer.getInstance()
          .play(Sound.BEGINNING)
          .then(() => MusicPlayer.getInstance().stopDefaultSound());
      }
    }

		if (store.config.outputFormat == 'svg') {
			const animatedSVG = SVG.generateAnimatedSVG(store);
			store.config.svgCallback(animatedSVG);
		}

		store.config.gameOverCallback();
		return;
	}

	PacmanMovement.movePacman(store);
	checkCollisions(store);
	if (!store.pacman.deadRemainingDuration) {
		GhostsMovement.moveGhosts(store);
		checkCollisions(store);
	}

	store.pacmanMouthOpen = !store.pacmanMouthOpen;

	store.gameHistory.push({
		pacman: { ...store.pacman },
		ghosts: store.ghosts.map((ghost) => ({ ...ghost })),
		grid: store.grid.map((row) => [...row.map((col) => col.intensity)])
	});

	if (store.config.outputFormat == 'canvas') Canvas.drawGrid(store);
	if (store.config.outputFormat == 'canvas') Canvas.drawPacman(store);
	if (store.config.outputFormat == 'canvas') Canvas.drawGhosts(store);
	if (store.config.outputFormat == 'canvas') Canvas.drawSoundController(store);
};

const checkCollisions = (store: StoreType) => {
	if (store.pacman.deadRemainingDuration) return;

	store.ghosts.forEach((ghost, index) => {
		if (ghost.x === store.pacman.x && ghost.y === store.pacman.y) {
			if (store.pacman.powerupRemainingDuration && ghost.scared) {
				ghost.state = 'eaten';
				ghost.scared = false;
				ghost.flashing = false;				
			} else {
				store.pacman.points = 0;
				store.pacman.powerupRemainingDuration = 0;
				store.pacman.deadRemainingDuration = PACMAN_DEATH_DURATION;
				if (store.config.outputFormat == 'canvas') {
					MusicPlayer.getInstance()
						.play(Sound.GAME_OVER)
						.then(() => MusicPlayer.getInstance().stopDefaultSound());
				}
			}
		}
	});
};

const respawnGhost = (store: StoreType, ghostIndex: number) => {
	let x, y;
	do {
		x = Math.floor(Math.random() * GRID_WIDTH);
		y = Math.floor(Math.random() * GRID_HEIGHT);
	} while ((Math.abs(x - store.pacman.x) <= 2 && Math.abs(y - store.pacman.y) <= 2) || store.grid[x][y].intensity === 0);
	store.ghosts[ghostIndex] = {
		x,
		y,
		name: GHOST_NAMES[ghostIndex % GHOST_NAMES.length],
		scared: false,
		target: undefined
	};
};

type Position = { x: number, y: number };

function findStartPosition(grid: number[][]): Pacman {
    const validPositions: Position[] = [];
    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell > 0) validPositions.push({ x, y });
        });
    });
    const pos = validPositions[Math.floor(Math.random() * validPositions.length)];
    return {
        x: pos.x,
        y: pos.y,
        direction: 'right',
        points: 0,
        totalPoints: 0,
        deadRemainingDuration: 0,
        powerupRemainingDuration: 0,
        recentPositions: []
    };
}

function findGhostPosition(grid: number[][], pacman: Pacman, minDistance: number): Ghost {
    const validPositions: Position[] = [];
    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            const dist = Math.abs(x - pacman.x) + Math.abs(y - pacman.y);
            if (cell > 0 && dist > minDistance) validPositions.push({ x, y });
        });
    });
    const pos = validPositions[Math.floor(Math.random() * validPositions.length)];
    return {
        x: pos.x,
        y: pos.y,
        name: 'blinky', // assign unique names as needed
        scared: false,
        target: undefined
    };
}

export const Game = {
	startGame,
	stopGame
};
