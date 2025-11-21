import BulkSelectionLink from '@components/BulkSelectionLink/BulkSelectionLink.jsx';

export default {
	title: 'Components/BulkSelectionLink',
	component: BulkSelectionLink,
	tags: ['autodocs'],
};

export const Enabled = {
	args: {
		children: 'select all',
		disabled: false,
		onClick: () => console.log('Link clicked'),
	},
};

export const Disabled = {
	args: {
		children: 'select all',
		disabled: true,
		onClick: () => console.log('This should not fire'),
	},
};

export const DeselectAll = {
	args: {
		children: 'deselect all',
		disabled: false,
		onClick: () => console.log('Deselect all clicked'),
	},
};

export const DeselectAllDisabled = {
	args: {
		children: 'deselect all',
		disabled: true,
	},
};
