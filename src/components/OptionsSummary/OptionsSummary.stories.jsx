import { fn } from 'storybook/test';
import OptionsSummary from './OptionsSummary';
import { GameOptionsProvider } from '@context/GameOptionsContext.jsx';

// Wrapper component to provide context
const OptionsSummaryWithContext = props => (
	<GameOptionsProvider>
		<OptionsSummary {...props} />
	</GameOptionsProvider>
);

export default {
	title: 'Sections/OptionsSummary',
	component: OptionsSummaryWithContext,
	tags: ['autodocs'],
	argTypes: {
		options: {
			description: 'Current game options object',
		},
		alphabetCount: {
			control: 'number',
			description: 'Number of enabled alphabets',
		},
	},
};

// Story: Default settings
export const DefaultSettings = {
	args: {
		options: {
			mode: 'all',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: true,
				Howard: true,
				Joscelyn: true,
			},
			twentyFourLetterAlphabet: true,
			showBaseline: true,
		},
		alphabetCount: 4,
	},
};

// Story: Custom mode (minuscules only)
export const MinusculesOnlyMode = {
	args: {
		options: {
			mode: 'minuscule',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: true,
				Howard: true,
				Joscelyn: true,
			},
			twentyFourLetterAlphabet: true,
			showBaseline: true,
		},
		alphabetCount: 4,
	},
};

// Story: Majuscules only mode
export const MajusculesOnlyMode = {
	args: {
		options: {
			mode: 'majuscule',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: true,
				Howard: true,
				Joscelyn: true,
			},
			twentyFourLetterAlphabet: true,
			showBaseline: true,
		},
		alphabetCount: 4,
	},
};

// Story: Custom alphabets (limited selection)
export const LimitedAlphabets = {
	args: {
		options: {
			mode: 'all',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: false,
				Howard: false,
				Joscelyn: false,
			},
			twentyFourLetterAlphabet: true,
			showBaseline: true,
		},
		alphabetCount: 1,
	},
};

// Story: Single alphabet (test singular label)
export const SingleAlphabet = {
	args: {
		options: {
			mode: 'all',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: false,
				Howard: false,
				Joscelyn: false,
			},
			twentyFourLetterAlphabet: true,
			showBaseline: true,
		},
		alphabetCount: 1,
	},
};

// Story: 26 letters mode
export const TwentySixLetters = {
	args: {
		options: {
			mode: 'all',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: true,
				Howard: true,
				Joscelyn: true,
			},
			twentyFourLetterAlphabet: false,
			showBaseline: true,
		},
		alphabetCount: 4,
	},
};

// Story: Baselines off
export const BaselinesOff = {
	args: {
		options: {
			mode: 'all',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: true,
				Howard: true,
				Joscelyn: true,
			},
			twentyFourLetterAlphabet: true,
			showBaseline: false,
		},
		alphabetCount: 4,
	},
};

// Story: All custom settings
export const AllCustomSettings = {
	args: {
		options: {
			mode: 'minuscule',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: true,
				Howard: false,
				Joscelyn: false,
			},
			twentyFourLetterAlphabet: false,
			showBaseline: false,
		},
		alphabetCount: 2,
	},
};
