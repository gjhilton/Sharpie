import { fn } from '@storybook/test';
import LandingSectionOptions from './LandingSectionOptions';

export default {
	title: 'Components/LandingSectionOptions',
	component: LandingSectionOptions,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
};

export const Default = {
	args: {
		onSelectMode: fn(),
		twentyFourLetterAlphabet: false,
		onShowCatalogue: fn(),
	},
};
