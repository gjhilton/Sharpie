import { Icon, ICON_TYPE } from './Icon';

export default {
	title: 'Components/Icon',
	component: Icon,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: { type: 'number', min: 12, max: 128, step: 4 },
			description: 'Size of the icon in pixels',
		},
		colour: {
			control: 'color',
			description: 'Color of the icon stroke',
		},
		weight: {
			control: { type: 'number', min: 1, max: 8, step: 0.5 },
			description: 'Stroke width of the icon',
		},
	},
};

export const Cross = {
	args: {
		icon: ICON_TYPE.CROSS,
		size: 24,
		weight: 2,
	},
};

export const Info = {
	args: {
		icon: ICON_TYPE.INFO,
		size: 24,
		weight: 2,
	},
};

export const Tick = {
	args: {
		icon: ICON_TYPE.TICK,
		size: 24,
		weight: 2,
	},
};

export const Large = {
	args: {
		icon: ICON_TYPE.TICK,
		size: 64,
		colour: 'green',
		weight: 3,
	},
};

export const Small = {
	args: {
		icon: ICON_TYPE.INFO,
		size: 16,
		colour: 'blue',
		weight: 1.5,
	},
};

export const CustomColor = {
	args: {
		icon: ICON_TYPE.CROSS,
		size: 32,
		colour: '#ff0000',
		weight: 2,
	},
};

export const ThickStroke = {
	args: {
		icon: ICON_TYPE.TICK,
		size: 48,
		colour: 'black',
		weight: 6,
	},
};
