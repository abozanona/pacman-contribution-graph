import { type Config, type StoreType } from '../types';

export const Store: StoreType = {
	frameCount: 0,
	contributions: [],
	pacman: {
		x: 0,
		y: 0,
		direction: 'right',
		points: 0,
		totalPoints: 0,
		deadRemainingDuration: 0,
		powerupRemainingDuration: 0,
		recentPositions: []
	},
	ghosts: [],
	grid: [],
	monthLabels: [],
	pacmanMouthOpen: true,
	gameInterval: 0,
	gameHistory: [],
	config: undefined as unknown as Config,
	useGithubThemeColor: true,
	contributionGrid: [],
	pellets: []
};