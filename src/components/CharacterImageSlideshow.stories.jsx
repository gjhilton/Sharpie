import CharacterImageSlideshow from './CharacterImageSlideshow';

export default {
	title: 'Components/CharacterImageSlideshow',
	component: CharacterImageSlideshow,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		imagePaths: {
			control: 'object',
			description: 'Array of image paths to cycle through',
		},
		caption: {
			control: 'text',
			description: 'The caption for all images alt text',
		},
		graph: {
			control: 'object',
			description: 'Graph object with character and img properties',
		},
		interval: {
			control: 'number',
			description: 'Milliseconds between slide transitions (default: 2000)',
		},
	},
};

export const Default = {
	args: {
		imagePaths: [
			'/data/joscelyn-min/a.png',
			'/data/joscelyn-min/b.png',
			'/data/joscelyn-min/c.png',
			'/data/joscelyn-min/d.png',
		],
		caption: 'minuscule letters',
		graph: { character: 'a', img: 'a.png', source: 'joscelyn' },
		interval: 2000,
	},
};
