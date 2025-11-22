import OptionsSummary from './OptionsSummary';
import { OPTIONS_SOURCE, DEFAULT_OPTIONS } from '@constants/options.js';

export default {
	title: 'Components/OptionsSummary',
	component: OptionsSummary,
	tags: ['autodocs'],
};

export const DefaultSettings = {
	args: {
		options: DEFAULT_OPTIONS,
		optionsSource: OPTIONS_SOURCE.DEFAULTS,
		onReset: () => console.log('Reset clicked'),
	},
};

export const LoadedFromSharedLink = {
	args: {
		options: {
			gameMode: 'minuscule',
			twentyFourLetterAlphabet: true,
			showBaseline: false,
			enabledAlphabetIds: [1, 3],
		},
		optionsSource: OPTIONS_SOURCE.QUERY_STRING,
		onReset: () => console.log('Reset clicked'),
	},
};

export const RestoredFromSession = {
	args: {
		options: {
			gameMode: 'majuscule',
			twentyFourLetterAlphabet: false,
			showBaseline: true,
			enabledAlphabetIds: [1, 2, 3, 4, 5],
		},
		optionsSource: OPTIONS_SOURCE.LOCAL_STORAGE,
		onReset: () => console.log('Reset clicked'),
	},
};

export const SingleAlphabet = {
	args: {
		options: {
			gameMode: 'all',
			twentyFourLetterAlphabet: false,
			showBaseline: true,
			enabledAlphabetIds: [3],
		},
		optionsSource: OPTIONS_SOURCE.DEFAULTS,
		onReset: () => console.log('Reset clicked'),
	},
};

export const TwentyFourLetters = {
	args: {
		options: {
			gameMode: 'all',
			twentyFourLetterAlphabet: true,
			showBaseline: true,
			enabledAlphabetIds: [1, 2, 3],
		},
		optionsSource: OPTIONS_SOURCE.DEFAULTS,
		onReset: () => console.log('Reset clicked'),
	},
};

export const BaselinesOff = {
	args: {
		options: {
			gameMode: 'all',
			twentyFourLetterAlphabet: false,
			showBaseline: false,
			enabledAlphabetIds: [1, 2, 3, 4, 5],
		},
		optionsSource: OPTIONS_SOURCE.DEFAULTS,
		onReset: () => console.log('Reset clicked'),
	},
};
