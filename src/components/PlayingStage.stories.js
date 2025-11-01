import PlayingStage from './PlayingStage';
import { GAME_MODES } from '../constants/stages';

export default {
	title: 'Screens/PlayingStage',
	component: PlayingStage,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	argTypes: {
		gameMode: {
			control: 'select',
			options: Object.values(GAME_MODES),
			description: 'The selected game mode that determines which characters appear',
		},
		onEndGame: {
			action: 'game ended',
			description: 'Function called when End Game button is clicked with score data',
		},
	},
};

export const MajusculeMode = {
	args: {
		gameMode: GAME_MODES.MAJUSCULE,
	},
};

export const MinusculeMode = {
	args: {
		gameMode: GAME_MODES.MINUSCULE,
	},
};

export const ExtrasMode = {
	args: {
		gameMode: GAME_MODES.EXTRAS,
	},
};

export const AllMode = {
	args: {
		gameMode: GAME_MODES.ALL,
	},
};
