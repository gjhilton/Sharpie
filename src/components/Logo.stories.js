import Logo from './Logo';

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
			description: 'Maximum width of the logo (CSS size value)',
		},
		className: {
			control: 'text',
			description: 'Additional CSS class name',
		},
	},
};

export const Default = {
	args: {},
};

export const Small = {
	args: {
		size: '150px',
	},
};

export const Medium = {
	args: {
		size: '300px',
	},
};

export const Large = {
	args: {
		size: '500px',
	},
};

export const ExtraLarge = {
	args: {
		size: '800px',
	},
};

export const Responsive = {
	args: {
		size: '100%',
	},
	decorators: [
		Story => (
			<div style={{ maxWidth: '400px' }}>
				<Story />
			</div>
		),
	],
};
