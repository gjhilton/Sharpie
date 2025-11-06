import CatalogueScreen from './CatalogueScreen.jsx';

export default {
	title: 'Screens/CatalogueScreen',
	component: CatalogueScreen,
	parameters: {
		layout: 'fullscreen',
	},
};

export const Default = {
	args: {
		onReturnToMenu: () => console.log('Return to menu'),
	},
};
