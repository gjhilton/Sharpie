import { fn } from '@storybook/test';
import LandingSectionOptions from './LandingSectionOptions';
import { GAME_MODES } from '@constants/stages.js';

export default {
	title: 'Components/LandingSectionOptions',
	component: LandingSectionOptions,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
};

export const Default = {
	args: {
		selectedMode: GAME_MODES.ALL,
		setSelectedMode: fn(),
		onShowCatalogue: fn(),
	},
};

export const MinusculesSelected = {
	args: {
		selectedMode: GAME_MODES.MINUSCULE,
		setSelectedMode: fn(),
		onShowCatalogue: fn(),
	},
};

export const MajusculesSelected = {
	args: {
		selectedMode: GAME_MODES.MAJUSCULE,
		setSelectedMode: fn(),
		onShowCatalogue: fn(),
	},
};
