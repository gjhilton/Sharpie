import { ExampleCard } from '@components/ExampleCard/ExampleCard';

export default {
	title: 'Components/ExampleCard',
	component: ExampleCard,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
};

export const Default = {
	args: {
		title: 'Example Title',
		children: <div style={{ padding: '2rem' }}>Example content goes here</div>,
	},
};

export const CustomHeight = {
	args: {
		title: 'Shorter Card',
		height: '150px',
		children: <div style={{ padding: '1rem' }}>Smaller content</div>,
	},
};

export const WithImage = {
	args: {
		title: 'With baseline',
		children: (
			<img
				src="/data/Joscelyn/joscelyn-minuscule-assets/b.png"
				alt="Example character"
				style={{ width: '100%', height: '100%', objectFit: 'contain' }}
			/>
		),
	},
};
