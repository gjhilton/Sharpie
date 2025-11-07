import MenuScreen from './MenuScreen';

export default {
	title: 'Screens/MenuScreen',
	component: MenuScreen,
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
	},
};

export const Default = {
	args: {},
};
