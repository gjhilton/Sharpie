import Character from './Character';

export default {
	title: 'Components/Character',
	component: Character,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		state: {
			control: 'select',
			options: ['awaitAnswer', 'correctAnswer', 'incorrectAnswer'],
			description: 'The state of the character component',
		},
		imagePath: {
			control: 'text',
			description: 'Path to a single image',
		},
		imagePaths: {
			control: 'object',
			description: 'Array of image paths for slideshow',
		},
		character: {
			control: 'text',
			description: 'The character being displayed',
		},
		sourceLink: {
			control: 'text',
			description: 'Link to the image source',
		},
		sourceTitle: {
			control: 'text',
			description: 'Title of the image source',
		},
	},
};

export const AwaitAnswer = {
	args: {
		state: 'awaitAnswer',
		imagePath: '/data/joscelyn-min/a.png',
	},
};

export const CorrectAnswer = {
	args: {
		state: 'correctAnswer',
		imagePath: '/data/joscelyn-min/a.png',
		character: 'a',
		sourceLink: 'https://github.com/psb1558/Joscelyn-font/releases',
		sourceTitle: 'Joscelyn typeface, drawn by Peter Baker (2019)',
	},
};

export const IncorrectAnswer = {
	args: {
		state: 'incorrectAnswer',
		imagePaths: [
			'/data/joscelyn-min/b.png',
			'/data/joscelyn-min/b2.png',
			'/data/joscelyn-min/b3.png',
		],
		character: 'b',
	},
};
