import { useState } from 'react';
import Toggle from './Toggle.jsx';

export default {
	title: 'Components/Toggle',
	component: Toggle,
	tags: ['autodocs'],
};

const ToggleWithState = args => {
	const [checked, setChecked] = useState(args.checked || false);

	return <Toggle {...args} checked={checked} onChange={setChecked} />;
};

export const Default = {
	render: ToggleWithState,
	args: {
		id: 'toggle-default',
		label: 'Toggle Switch',
		checked: false,
	},
};

export const Checked = {
	render: ToggleWithState,
	args: {
		id: 'toggle-checked',
		label: 'Toggle Switch',
		checked: true,
	},
};

export const Disabled = {
	render: ToggleWithState,
	args: {
		id: 'toggle-disabled',
		label: 'Disabled Toggle',
		checked: false,
		disabled: true,
	},
};

export const DisabledChecked = {
	render: ToggleWithState,
	args: {
		id: 'toggle-disabled-checked',
		label: 'Disabled Checked',
		checked: true,
		disabled: true,
	},
};

export const DoubledLetterMode = {
	render: ToggleWithState,
	args: {
		id: 'doubled-letter-mode',
		label: 'I/J & U/V Mode',
		checked: false,
	},
};

export const LongLabel = {
	render: ToggleWithState,
	args: {
		id: 'toggle-long-label',
		label: 'This is a very long label to test how the toggle handles lengthy text',
		checked: false,
	},
};
