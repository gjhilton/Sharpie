import React from 'react';
import { SmallPrint } from './SmallPrint';

export default {
	title: 'Components/SmallPrint',
	component: SmallPrint,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
};

export const Default = {
	args: {},
};

export const WithFeedbackLink = {
	args: {
		onShowFeedback: () => alert('Feedback form would open'),
	},
};
