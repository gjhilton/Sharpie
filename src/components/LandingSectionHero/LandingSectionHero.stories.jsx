import { fn } from '@storybook/test';
import LandingSectionHero from './LandingSectionHero';
import { GAME_MODES } from '@constants/stages.js';

export default {
	title: 'Components/LandingSectionHero',
	component: LandingSectionHero,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
};

export const Default = {
	args: {
		onSelectMode: fn(),
		twentyFourLetterAlphabet: false,
		selectedMode: GAME_MODES.ALL,
	},
};

export const MinusculesMode = {
	args: {
		onSelectMode: fn(),
		twentyFourLetterAlphabet: false,
		selectedMode: GAME_MODES.MINUSCULE,
	},
};

export const MajusculesMode = {
	args: {
		onSelectMode: fn(),
		twentyFourLetterAlphabet: false,
		selectedMode: GAME_MODES.MAJUSCULE,
	},
};

export const With24LetterAlphabet = {
	args: {
		onSelectMode: fn(),
		twentyFourLetterAlphabet: true,
		selectedMode: GAME_MODES.ALL,
	},
};
