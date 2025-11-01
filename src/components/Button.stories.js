import Button from './Button';

export default {
	title: 'Components/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
			description: 'The text label displayed on the button',
		},
		onClick: {
			action: 'clicked',
			description: 'Function called when button is clicked',
		},
	},
};

export const Default = {
	args: {
		label: 'Continue',
	},
};

export const Start = {
	args: {
		label: 'Start Game',
	},
};

export const Next = {
	args: {
		label: 'Next Round',
	},
};

export const Finish = {
	args: {
		label: 'Finish',
	},
};
