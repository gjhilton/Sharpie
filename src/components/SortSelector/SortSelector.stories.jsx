import { useState } from 'react';
import { SortSelector } from '@components/SortSelector/SortSelector';

export default {
	title: 'Components/SortSelector',
	component: SortSelector,
	tags: ['autodocs'],
};

const sortOptions = [
	{ value: 'date', label: 'By Date' },
	{ value: 'name', label: 'By Name' },
	{ value: 'difficulty', label: 'By Difficulty' },
];

const SortSelectorWithState = args => {
	const [value, setValue] = useState(args.value || 'date');

	return <SortSelector {...args} value={value} onChange={setValue} />;
};

export const Default = {
	render: SortSelectorWithState,
	args: {
		value: 'date',
		options: sortOptions,
	},
};

export const NameSelected = {
	render: SortSelectorWithState,
	args: {
		value: 'name',
		options: sortOptions,
	},
};

export const DifficultySelected = {
	render: SortSelectorWithState,
	args: {
		value: 'difficulty',
		options: sortOptions,
	},
};

export const CustomLabel = {
	render: SortSelectorWithState,
	args: {
		value: 'date',
		options: sortOptions,
		label: 'Order by:',
	},
};

export const TwoOptions = {
	render: SortSelectorWithState,
	args: {
		value: 'alphabetical',
		options: [
			{ value: 'alphabetical', label: 'Alphabetical' },
			{ value: 'chronological', label: 'Chronological' },
		],
	},
};

export const LongOptionLabels = {
	render: SortSelectorWithState,
	args: {
		value: 'option1',
		options: [
			{
				value: 'option1',
				label: 'Sort by most recently added items first',
			},
			{ value: 'option2', label: 'Sort by alphabetical order (A to Z)' },
			{
				value: 'option3',
				label: 'Sort by difficulty level (easiest to hardest)',
			},
		],
	},
};
