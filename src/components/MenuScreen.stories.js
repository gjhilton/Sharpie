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
	},
};

export const Default = {
	args: {},
};

export const Interactive = {
	args: {},
};
