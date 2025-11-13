import { useState } from 'react';
import { fn } from '@storybook/test';
import LandingSectionSettings from './LandingSectionSettings';

export default {
	title: 'Components/LandingSectionSettings',
	component: LandingSectionSettings,
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

export const TwentyFourLetterEnabled = {
	args: {
		twentyFourLetterAlphabet: true,
		setTwentyFourLetterAlphabet: fn(),
	},
};

const InteractiveTemplate = args => {
	const [twentyFourLetterAlphabet, setTwentyFourLetterAlphabet] = useState(
		args.twentyFourLetterAlphabet || false
	);

	return (
		<LandingSectionSettings
			{...args}
			twentyFourLetterAlphabet={twentyFourLetterAlphabet}
			setTwentyFourLetterAlphabet={setTwentyFourLetterAlphabet}
		/>
	);
};

export const Interactive = {
	render: InteractiveTemplate,
	args: {
		twentyFourLetterAlphabet: false,
	},
};
