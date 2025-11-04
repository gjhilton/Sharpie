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
	},
};

export const Default = {
	args: {
		imagePath: '/data/joscelyn-min/a.png',
		graph: { character: 'a', img: 'a.png', source: 'joscelyn' },
		caption: 'a',
	},
};
