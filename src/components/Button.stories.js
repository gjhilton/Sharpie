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
		sublabel: {
			control: 'text',
			description: 'Optional smaller text displayed below the label',
		},
		hero: {
			control: 'boolean',
			description: 'Makes the button larger and bolder (hero style)',
		},
		disabled: {
			control: 'boolean',
			description: 'Disables the button and changes its appearance',
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

export const Hero = {
	args: {
		label: 'Start',
		hero: true,
	},
};

export const Disabled = {
	args: {
		label: 'Numerals',
		sublabel: '(coming soon)',
		disabled: true,
	},
};

export const WithSublabel = {
	args: {
		label: 'Main Label',
		sublabel: 'Additional info',
	},
};
