import App from './App';

export default {
	title: 'App',
	component: App,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export const Default = {
	args: {},
	parameters: {
		docs: {
			description: {
				story: 'The complete application showing the full flow: Menu → Playing → Score → Menu. Click through the interface to test the complete user journey.',
			},
		},
	},
};
