import { PACMAN_COLOR, PACMAN_COLOR_DEAD, PACMAN_COLOR_POWERUP } from '../core/constants';
import { Pacman } from '../types';

const generatePacManColors = (pacman: Pacman): string => {
	if (pacman.deadRemainingDuration) {
		return PACMAN_COLOR_DEAD;
	} else if (pacman.powerupRemainingDuration) {
		return PACMAN_COLOR_POWERUP;
	} else {
		return PACMAN_COLOR;
	}
};

export const RendererUnits = {
	generatePacManColors
};
