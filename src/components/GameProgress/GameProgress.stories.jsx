import GameProgress from './GameProgress';
import { GAME_END_MODE } from '@constants/options.js';

export default {
	title: 'Components/GameProgress',
	component: GameProgress,
	argTypes: {
		gameEndMode: {
			control: 'select',
			options: Object.values(GAME_END_MODE),
		},
		correctCount: { control: 'number' },
		incorrectCount: { control: 'number' },
		questionCount: {
			control: 'select',
			options: [10, 25, 50, 100],
		},
	},
};

export const OnQuit = {
	args: {
		gameEndMode: GAME_END_MODE.ON_QUIT,
		correctCount: 5,
		incorrectCount: 2,
		questionCount: 25,
	},
};

export const FixedNumStart = {
	args: {
		gameEndMode: GAME_END_MODE.FIXED_NUM,
		correctCount: 0,
		incorrectCount: 0,
		questionCount: 25,
	},
};

export const FixedNumMidGame = {
	args: {
		gameEndMode: GAME_END_MODE.FIXED_NUM,
		correctCount: 10,
		incorrectCount: 3,
		questionCount: 25,
	},
};

export const FixedNumNearEnd = {
	args: {
		gameEndMode: GAME_END_MODE.FIXED_NUM,
		correctCount: 20,
		incorrectCount: 3,
		questionCount: 25,
	},
};

export const SuddenDeath = {
	args: {
		gameEndMode: GAME_END_MODE.SUDDEN_DEATH,
		correctCount: 15,
		incorrectCount: 0,
		questionCount: 25,
	},
};

export const ThreeLivesFullHealth = {
	args: {
		gameEndMode: GAME_END_MODE.THREE_LIVES,
		correctCount: 10,
		incorrectCount: 0,
		questionCount: 25,
	},
};

export const ThreeLivesTwoRemaining = {
	args: {
		gameEndMode: GAME_END_MODE.THREE_LIVES,
		correctCount: 10,
		incorrectCount: 1,
		questionCount: 25,
	},
};

export const ThreeLivesOneRemaining = {
	args: {
		gameEndMode: GAME_END_MODE.THREE_LIVES,
		correctCount: 10,
		incorrectCount: 2,
		questionCount: 25,
	},
};

export const ThreeLivesGameOver = {
	args: {
		gameEndMode: GAME_END_MODE.THREE_LIVES,
		correctCount: 10,
		incorrectCount: 3,
		questionCount: 25,
	},
};
