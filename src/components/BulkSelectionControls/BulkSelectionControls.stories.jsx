import { BulkSelectionControls } from '@components/BulkSelectionControls/BulkSelectionControls';

export default {
	title: 'Components/BulkSelectionControls',
	component: BulkSelectionControls,
	tags: ['autodocs'],
};

export const AllEnabled = {
	args: {
		difficulty: 'easy',
		allSelected: false,
		noneSelected: false,
		onSelectAll: difficulty => console.log('Select all:', difficulty),
		onDeselectAll: difficulty => console.log('Deselect all:', difficulty),
	},
};

export const AllSelected = {
	args: {
		difficulty: 'medium',
		allSelected: true,
		noneSelected: false,
		onSelectAll: difficulty => console.log('Select all:', difficulty),
		onDeselectAll: difficulty => console.log('Deselect all:', difficulty),
	},
};

export const NoneSelected = {
	args: {
		difficulty: 'hard',
		allSelected: false,
		noneSelected: true,
		onSelectAll: difficulty => console.log('Select all:', difficulty),
		onDeselectAll: difficulty => console.log('Deselect all:', difficulty),
	},
};

export const SomeSelected = {
	args: {
		difficulty: 'easy',
		allSelected: false,
		noneSelected: false,
		onSelectAll: difficulty => console.log('Select all:', difficulty),
		onDeselectAll: difficulty => console.log('Deselect all:', difficulty),
	},
	parameters: {
		docs: {
			description: {
				story: 'When some (but not all) alphabets are selected, both links are enabled.',
			},
		},
	},
};
