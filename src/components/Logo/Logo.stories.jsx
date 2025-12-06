import React from 'react';
import { Logo, SIZE } from './Logo';

export default {
	title: 'Components/Logo',
	component: Logo,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'text',
			description:
				'Logo size: use "s", "m", or "l" constants, or provide custom CSS size value',
		},
		className: {
			control: 'text',
			description: 'Additional CSS class name',
		},
	},
};

export const Small = {
	args: {
		size: 's',
	},
};

export const Medium = {
	args: {
		size: 'm',
	},
};

export const Large = {
	args: {
		size: 'l',
	},
};

export const CustomSize = {
	args: {
		size: '800px',
	},
};

export const Responsive = {
	args: {
		size: '100%',
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
