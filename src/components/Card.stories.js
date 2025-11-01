import Card from './Card';

export default {
	title: 'Components/Card',
	component: Card,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		title: {
			control: 'text',
			description: 'The title displayed at the top of the card',
		},
		letter: {
			control: 'text',
			description: 'The letter to display in text (fallback)',
		},
		caption: {
			control: 'text',
			description: 'The caption displayed below the letter/image',
		},
		imagePath: {
			control: 'text',
			description: 'Path to the image to display',
		},
		graph: {
			control: 'object',
			description: 'Graph object with character and img properties',
		},
	},
};

export const TextFallback = {
	args: {
		letter: 'A',
		caption: 'Text display (fallback)',
	},
};

export const WithImage = {
	args: {
		imagePath: '/data/joscelyn-min/a.png',
		graph: { character: 'a', img: 'a.png', source: 'joscelyn' },
		caption: 'a',
	},
};

export const WithImageAndTitle = {
	args: {
		title: 'Correct Answer',
		imagePath: '/data/joscelyn-maj/a.png',
		graph: { character: 'A', img: 'a.png', source: 'joscelyn' },
		caption: 'A',
	},
};

export const QuestionMark = {
	args: {
		title: 'Identify the letterform',
		imagePath: '/data/joscelyn-min/b.png',
		graph: { character: 'b', img: 'b.png', source: 'joscelyn' },
		caption: '?',
	},
};

export const Majuscule = {
	args: {
		title: 'MAJUSCULE Example',
		imagePath: '/data/joscelyn-maj/b.png',
		graph: { character: 'B', img: 'b.png', source: 'joscelyn' },
		caption: 'B',
	},
};
