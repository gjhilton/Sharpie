import { fn } from 'storybook/test';
import OptionsSection from './OptionsSection';
import { GAME_MODES } from '@constants/stages.js';

export default {
	title: 'Sections/OptionsSection',
	component: OptionsSection,
	tags: ['autodocs'],
	argTypes: {
		selectedMode: {
			control: 'select',
			options: Object.values(GAME_MODES),
			description: 'Currently selected game mode',
		},
		twentyFourLetterAlphabet: {
			control: 'boolean',
			description: 'Whether 24-letter alphabet mode is enabled',
		},
		showBaseline: {
			control: 'boolean',
			description: 'Whether baselines are shown',
		},
	},
};

export const Default = {
	args: {
		selectedMode: GAME_MODES.ALL,
		onModeChange: fn(),
		twentyFourLetterAlphabet: false,
		onTwentyFourLetterChange: fn(),
		showBaseline: false,
		onShowBaselineChange: fn(),
		enabledAlphabets: {
			'BeauChesne-Baildon': true,
			Howard: true,
			Joscelyn: true,
		},
		onShowCatalogue: fn(),
	},
};

export const MinusculeMode = {
	args: {
		...Default.args,
		selectedMode: GAME_MODES.MINUSCULE,
	},
};

export const MajusculeMode = {
	args: {
		...Default.args,
		selectedMode: GAME_MODES.MAJUSCULE,
	},
};

export const WithBaselinesEnabled = {
	args: {
		...Default.args,
		showBaseline: true,
	},
};

export const With24LetterAlphabet = {
	args: {
		...Default.args,
		twentyFourLetterAlphabet: true,
	},
};
