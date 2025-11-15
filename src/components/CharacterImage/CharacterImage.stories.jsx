import CharacterImage from './CharacterImage';

export default {
	title: 'Components/CharacterImage',
	component: CharacterImage,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		imagePath: {
			control: 'text',
			description: 'Path to the image to display',
		},
		caption: {
			control: 'text',
			description: 'The caption for the image alt text',
		},
		showBaseline: {
			control: 'boolean',
			description: 'Whether to show the baseline indicator',
		},
		baselineColor: {
			control: 'select',
			options: ['baseline', 'ink'],
			description: 'Color of the baseline',
		},
		note: {
			control: 'text',
			description: 'Optional note to display above the image',
		},
	},
};

export const Default = {
	args: {
		imagePath: '/data/Joscelyn/joscelyn-minuscule-assets/a.png',
		caption: 'a',
		showBaseline: false,
	},
};

export const WithBaseline = {
	args: {
		imagePath: '/data/Joscelyn/joscelyn-minuscule-assets/a.png',
		caption: 'a',
		showBaseline: true,
	},
};

export const WithBlackBaseline = {
	args: {
		imagePath: '/data/Joscelyn/joscelyn-minuscule-assets/a.png',
		caption: 'a',
		showBaseline: true,
		baselineColor: 'ink',
	},
};

export const WithNote = {
	args: {
		imagePath: '/data/Joscelyn/joscelyn-majuscule-assets/A.png',
		caption: 'A',
		showBaseline: false,
		note: 'First letter of word.',
	},
};

export const WithNoteAndBaseline = {
	args: {
		imagePath: '/data/Joscelyn/joscelyn-majuscule-assets/A.png',
		caption: 'A',
		showBaseline: true,
		note: 'First letter of word.',
	},
};

export const WithCustomNote = {
	args: {
		imagePath: '/data/Hill/Hill-assets/c023.png',
		caption: 'c',
		showBaseline: false,
		note: 'Round c with sharp turn.',
	},
};
