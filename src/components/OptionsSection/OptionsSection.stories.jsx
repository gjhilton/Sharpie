import { fn } from 'storybook/test';
import OptionsSection from './OptionsSection';
import { OPTIONS } from '@lib/options/schema.js';

// Derive mode values from OPTIONS schema
const MODE_VALUES = Object.keys(OPTIONS.mode.values);

export default {
	title: 'Sections/OptionsSection',
	component: OptionsSection,
	tags: ['autodocs'],
	argTypes: {
		selectedMode: {
			control: 'select',
			options: MODE_VALUES,
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
		selectedMode: 'all',
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
		selectedMode: 'minuscule',
	},
};

export const MajusculeMode = {
	args: {
		...Default.args,
		selectedMode: 'majuscule',
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
