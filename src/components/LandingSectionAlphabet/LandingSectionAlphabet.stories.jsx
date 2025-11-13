import { useState } from 'react';
import { fn } from '@storybook/test';
import LandingSectionAlphabet from './LandingSectionAlphabet';

export default {
	title: 'Components/LandingSectionAlphabet',
	component: LandingSectionAlphabet,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
};

export const Default = {
	args: {
		twentyFourLetterAlphabet: false,
		setTwentyFourLetterAlphabet: fn(),
	},
};

export const Checked = {
	args: {
		twentyFourLetterAlphabet: true,
		setTwentyFourLetterAlphabet: fn(),
	},
};

const InteractiveTemplate = args => {
	const [checked, setChecked] = useState(args.twentyFourLetterAlphabet || false);

	return (
		<LandingSectionAlphabet
			{...args}
			twentyFourLetterAlphabet={checked}
			setTwentyFourLetterAlphabet={setChecked}
		/>
	);
};

export const Interactive = {
	render: InteractiveTemplate,
	args: {
		twentyFourLetterAlphabet: false,
	},
};
