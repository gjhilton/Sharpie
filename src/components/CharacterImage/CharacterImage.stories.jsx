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
		graph: {
			control: 'object',
			description: 'Graph object with character and img properties',
		},
		showBaseline: {
			control: 'boolean',
			description: 'Whether to show the baseline indicator',
		},
		baselineColor: {
			control: 'color',
			description: 'Color of the baseline (default: lightblue)',
		},
	},
};

export const Default = {
	args: {
		imagePath: '/data/joscelyn-min/a.png',
		graph: { character: 'a', img: 'a.png', source: 'joscelyn' },
		caption: 'a',
		showBaseline: false,
	},
};

export const WithBaseline = {
	args: {
		imagePath: '/data/joscelyn-min/a.png',
		graph: { character: 'a', img: 'a.png', source: 'joscelyn' },
		caption: 'a',
		showBaseline: true,
	},
};

export const WithBlackBaseline = {
	args: {
		imagePath: '/data/joscelyn-min/a.png',
		graph: { character: 'a', img: 'a.png', source: 'joscelyn' },
		caption: 'a',
		showBaseline: true,
		baselineColor: 'black',
	},
};
