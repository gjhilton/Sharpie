import { ShareURLSection } from './ShareURLSection';

export default {
	title: 'Components/ShareURLSection',
	component: ShareURLSection,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
};

const mockOptions = {
	mode: 'both',
	enabledAlphabets: { standard: true },
	numLetters: true,
	showBaseline: false,
};

export const Default = {
	args: {
		options: mockOptions,
	},
};

export const WithDifferentOptions = {
	args: {
		options: {
			mode: 'minuscule',
			enabledAlphabets: { standard: true, italic: true },
			numLetters: false,
			showBaseline: true,
		},
	},
};

export const AllOptionsEnabled = {
	args: {
		options: {
			mode: 'both',
			enabledAlphabets: {
				standard: true,
				italic: true,
				secretary: true,
				mixed: true,
			},
			numLetters: true,
			showBaseline: true,
		},
	},
};
