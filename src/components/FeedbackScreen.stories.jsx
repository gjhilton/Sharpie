import FeedbackScreen from './FeedbackScreen';

export default {
	title: 'Screens/FeedbackScreen',
	component: FeedbackScreen,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	argTypes: {
		onReturnToMenu: {
			action: 'return to menu',
			description: 'Function called when returning to menu',
		},
		onShowFeedback: {
			action: 'show feedback',
			description: 'Function called when feedback link is clicked',
		},
	},
};

export const Default = {
	args: {},
};

// Note: Error states are handled internally by Formspree validation
// To see error states, submit the form with invalid data in Storybook
export const WithInstructions = {
	args: {},
	parameters: {
		docs: {
			description: {
				story: 'Submit the form with invalid email or empty required fields to see error states with red borders.',
			},
		},
	},
};
