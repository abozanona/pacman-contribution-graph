export type Point2d = {
	x: number;
	y: number;
	direction?: 'right' | 'left' | 'up' | 'down';
};

export type ContributionLevel = 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';

export interface Contribution {
	date: Date;
	count: number;
	color: string; // hex color that GitHub returns (light theme)
	level: ContributionLevel; // bucket calculated by GitHub
}

export enum PlayerStyle {
	CONSERVATIVE = 'conservative',
	AGGRESSIVE = 'aggressive',
	OPPORTUNISTIC = 'opportunistic'
}

/* ───────────────────────── Pac-Man & Ghosts ────────────────────── */
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

export type GhostName = 'blinky' | 'clyde' | 'inky' | 'pinky' | 'eyes';

export interface Ghost {
	x: number;
	y: number;
	name: GhostName;
	originalName?: GhostName;
	scared: boolean;
	direction: 'right' | 'left' | 'up' | 'down';
	target?: Point2d;
	inHouse: boolean;
	respawnCounter: number; // Time to respawn after reaches home
	freezeCounter: number; // Time ghost stays in base before going out
	justReleasedFromHouse: boolean; // If ghost just released from house, it can only walk thru the house door
	flashing?: boolean;
	state?: 'normal' | 'scared' | 'eaten';
}

export interface Pellet {
	x: number;
	y: number;
}

/* ───────────────────────── Grid & Store ───────────────────────────── */
export interface GridCell {
	commitsCount: number;
	color: string; // color ready to render
	level: ContributionLevel;
}

export interface StoreType {
	frameCount: number;
	contributions: Contribution[];
	pacman: Pacman;
	ghosts: Ghost[];
	grid: GridCell[][]; // [week][day]
	monthLabels: string[];
	pacmanMouthOpen: boolean;
	gameInterval: number | NodeJS.Timeout | null;
	gameHistory: {
		pacman: Pacman;
		ghosts: Ghost[];
		grid: GridCell[][];
	}[];
	config: Config;
	useGithubThemeColor: boolean;
	contributionGrid: number[][];
	pellets: Pellet[];
}

/* ───────────────────────── Settings ───────────────────────────── */
export interface Config {
	useCustomStartPositions?: boolean;
	platform: 'github' | 'gitlab';
	username: string;
	canvas: HTMLCanvasElement;
	outputFormat: 'canvas' | 'svg';
	svgCallback: (blobUrl: string) => void;
	gameOverCallback: () => void;
	gameTheme: ThemeKeys;
	gameSpeed: number;
	enableSounds: boolean;
	pointsIncreasedCallback: (pointsSum: number) => void;
	githubSettings?: {
		accessToken: string; // required for GraphQL
	};
	maxFrames?: number; // Maximum frame rate for the game
	maxHistorySize?: number;
	playerStyle: PlayerStyle;
}

/* ───────────────────────── Themes ──────────────────────────────────── */
export type ThemeKeys = 'github' | 'github-dark' | 'gitlab' | 'gitlab-dark';

export interface GameTheme {
	textColor: string;
	gridBackground: string;
	wallColor: string;
	intensityColors: string[]; // 5 cores (NONE … FOURTH)
}

/* ───────────────────────── SVG Animation helper ──────────────────── */
export interface AnimationData {
	keyTimes: string;
	values: string;
}