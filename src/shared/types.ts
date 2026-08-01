export type ContributionLevel = 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';

export interface Contribution {
	date: Date;
	count: number;
	color: string;
	level: ContributionLevel;
}

export interface GameStats {
	totalScore: number;
	steps: number;
	ghostsEaten: number;
}

export interface GridCell {
	commitsCount: number;
	color: string;
	level: ContributionLevel;
}

export type ThemeKeys = 'github' | 'github-dark' | 'gitlab' | 'gitlab-dark';

export interface GameTheme {
	textColor: string;
	gridBackground: string;
	wallColor: string;
	intensityColors: string[];
}

export interface AnimationData {
	keyTimes: string;
	values: string;
}

export const PLATFORM_REGISTRY = {
	github: {
		label: '🐙 GitHub'
	},
	gitlab: {
		label: '🦊 GitLab'
	},
	scenario: {
		label: '🏞️ Scenario'
	}
} as const;

export type Platform = keyof typeof PLATFORM_REGISTRY;
export const PLATFORMS = Object.keys(PLATFORM_REGISTRY) as Platform[];

export const SCENARIO_REGISTRY = {
	random: {
		label: '🎲 Random'
	},
	full: {
		label: '🟩 Full'
	},
	empty: {
		label: '⬜ Empty'
	},
	checkerboard: {
		label: '🏁 Checkerboard'
	},
	gradient: {
		label: '🌈 Gradient'
	},
	streaks: {
		label: '📈 Streaks'
	}
} as const;

export type Scenario = keyof typeof SCENARIO_REGISTRY;
export const SCENARIOS = Object.keys(SCENARIO_REGISTRY) as Scenario[];

export interface BaseConfig {
	platform: Platform;
	username: string;
	contributions?: Contribution[];
	scenario?: Scenario;
	svgCallback: (blobUrl: string) => void;
	gameOverCallback: () => void;
	gameTheme: ThemeKeys;
	pointsIncreasedCallback: (pointsSum: number) => void;
	gameStatsCallback?: (stats: GameStats) => void;
	githubSettings?: {
		accessToken: string;
	};
	maxFrames?: number;
	maxHistorySize?: number;
	showMonthLabels?: boolean;
}

/** Minimal shape that all game stores share, accepted by shared providers & utils. */
export interface BaseStore {
	config: BaseConfig;
	contributions: Contribution[];
	grid: GridCell[][];
	monthLabels: string[];
}
