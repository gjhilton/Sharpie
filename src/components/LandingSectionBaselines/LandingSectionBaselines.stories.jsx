import { useState } from 'react';
import { fn } from '@storybook/test';
import LandingSectionBaselines from './LandingSectionBaselines';

export default {
	title: 'Components/LandingSectionBaselines',
	component: LandingSectionBaselines,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
};

export const Default = {
	args: {
		showBaseline: false,
		setShowBaseline: fn(),
	},
};

export const BaselineEnabled = {
	args: {
		showBaseline: true,
		setShowBaseline: fn(),
	},
};

const InteractiveTemplate = args => {
	const [showBaseline, setShowBaseline] = useState(args.showBaseline || false);

	return (
		<LandingSectionBaselines
			{...args}
			showBaseline={showBaseline}
			setShowBaseline={setShowBaseline}
		/>
	);
};

export const Interactive = {
	render: InteractiveTemplate,
	args: {
		showBaseline: false,
	},
};
