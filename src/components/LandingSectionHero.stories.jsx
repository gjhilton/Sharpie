import { fn } from '@storybook/test';
import LandingSectionHero from './LandingSectionHero';

export default {
	title: 'Components/LandingSectionHero',
	component: LandingSectionHero,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
};

export const Default = {
	args: {
		onSelectMode: fn(),
		twentyFourLetterAlphabet: false,
	},
};
