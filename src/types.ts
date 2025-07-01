export type Point2d = {
	x: number;
	y: number;
};

export interface Pellet {
  x: number;
  y: number;
}

export interface Pacman {
	x: number;
	y: number;
	direction: 'right' | 'left' | 'up' | 'down';
	points: number;
	totalPoints: number;
	deadRemainingDuration: number;
	powerupRemainingDuration: number;
	recentPositions: string[];
	target?: Point2d;
}

export type GhostName = 'blinky' | 'clyde' | 'inky' | 'pinky';
export interface Ghost {
	x: number;
	y: number;
	name: GhostName;
	scared: boolean;
	target?: Point2d;
}

export interface Contribution {
	date: Date;
	count: number;
}

export interface StoreType {
	frameCount: number;
	contributions: Contribution[];
	pacman: Pacman;
	ghosts: Ghost[];
	grid: { intensity: number; commitsCount: number }[][];
	monthLabels: string[];
	pacmanMouthOpen: boolean;
	gameInterval: NodeJS.Timeout | null;
	gameHistory: {
		pacman: Pacman;
		ghosts: Ghost[];
		grid: number[][];
	}[];
	config: Config;
	contributionGrid: number[][];
	pellets: Pellet[];
}

export interface Config {
	platform: 'github' | 'gitlab';
	username: string;
	canvas: HTMLCanvasElement;
	outputFormat: 'canvas' | 'svg';
	svgCallback: (blonUrl: string) => void;
	gameOverCallback: () => void;
	gameTheme: ThemeKeys;
	gameSpeed: number;
	enableSounds: boolean;
	pointsIncreasedCallback: (pointsSum: number) => void;
	githubSettings?: {
		accessToken: string;
	};
}

export type ThemeKeys = 'github' | 'github-dark' | 'gitlab' | 'gitlab-dark';

export interface GameTheme {
	textColor: string;
	gridBackground: string;
	contributionBoxColor: string;
	emptyContributionBoxColor: string;
	wallColor: string;
}

export interface AnimationData {
	keyTimes: string;
	values: string;
}
