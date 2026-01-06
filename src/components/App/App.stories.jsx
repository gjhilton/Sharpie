import { App } from './App';

export default {
	title: 'App',
	component: App,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export const Default = {
	render: () => <App />,
	parameters: {
		docs: {
			description: {
				story: 'The complete application showing the full flow: Menu → Playing → Score → Menu, plus the Character Catalogue. Click through the interface to test the complete user journey.',
			},
		},
	},
};
