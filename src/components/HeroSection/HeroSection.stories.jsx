import { fn } from 'storybook/test';
import HeroSection from './HeroSection';

export default {
	title: 'Components/HeroSection',
	component: HeroSection,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
};

export const Default = {
	args: {
		onPlay: fn(),
	},
};
