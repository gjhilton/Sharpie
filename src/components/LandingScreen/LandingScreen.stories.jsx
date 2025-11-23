import { fn } from 'storybook/test';
import LandingScreen from './LandingScreen';

export default {
	title: 'Screens/LandingScreen',
	component: LandingScreen,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	argTypes: {
		onSelectMode: {
			action: 'mode selected',
			description: 'Function called when a game mode is selected',
		},
		onShowCatalogue: {
			action: 'show catalogue',
			description: 'Function called when the catalogue button is clicked',
		},
		onShowFeedback: {
			action: 'show feedback',
			description: 'Function called when the feedback link is clicked',
		},
		showBaseline: {
			control: 'boolean',
			description: 'Whether to show baselines on character images',
		},
		setShowBaseline: {
			action: 'set show baseline',
			description: 'Function called when baseline toggle changes',
		},
	},
};

export const Default = {
	args: {
		onSelectMode: fn(),
		onShowCatalogue: fn(),
		onShowFeedback: fn(),
		showBaseline: false,
		setShowBaseline: fn(),
		enabledAlphabets: {
			'BeauChesne-Baildon': true,
			Howard: true,
			Joscelyn: true,
		},
	},
};

export const WithBaselineEnabled = {
	args: {
		...Default.args,
		showBaseline: true,
	},
};
