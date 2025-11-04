import React from 'react';
import SmallPrint from './SmallPrint';

export default {
	title: 'Components/SmallPrint',
	component: SmallPrint,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		children: {
			control: 'text',
			description: 'Content to display in small print',
		},
		className: {
			control: 'text',
			description: 'Optional CSS class name to override default styles',
		},
	},
};

export const Default = {
	args: {
		children: 'This is small print text.',
	},
};

export const Copyright = {
	args: {
		children: '© 2024 Secretary. All rights reserved.',
	},
};

export const LongerText = {
	args: {
		children:
			'This is a longer piece of small print text that might wrap to multiple lines. It demonstrates how the component handles longer content while maintaining the smaller font size.',
	},
	decorators: [
		function (Story) {
			return (
				<div style={{ maxWidth: '400px' }}>
					<Story />
				</div>
			);
		},
	],
};

export const WithHTML = {
	args: {
		children: (
			<>
				Made with{' '}
				<span role="img" aria-label="heart">
					❤️
				</span>{' '}
				by the Secretary team
			</>
		),
	},
};
