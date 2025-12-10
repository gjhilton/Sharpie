import { RadioGroup, RadioOption } from './RadioGroup';

export default {
	title: 'Components/RadioGroup',
	component: RadioGroup,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
};

const gameModeOptions = [
	{ value: 'minuscule', label: 'minuscules only' },
	{ value: 'majuscule', label: 'MAJUSCULES only' },
	{ value: 'all', label: 'both minuscules AND MAJUSCULES' },
];

export const Default = {
	args: {
		legend: 'Game Mode',
		name: 'gameMode',
		value: 'all',
		onChange: () => {},
		options: gameModeOptions,
	},
};

export const WithVisibleLegend = {
	args: {
		legend: 'Choose your game mode',
		legendVisible: true,
		name: 'gameMode',
		value: 'minuscule',
		onChange: () => {},
		options: gameModeOptions,
	},
};

export const MinusculeSelected = {
	args: {
		legend: 'Game Mode',
		name: 'gameMode',
		value: 'minuscule',
		onChange: () => {},
		options: gameModeOptions,
	},
};

export const MajusculeSelected = {
	args: {
		legend: 'Game Mode',
		name: 'gameMode',
		value: 'majuscule',
		onChange: () => {},
		options: gameModeOptions,
	},
};

export const SingleRadioOption = {
	render: () => (
		<RadioOption
			name="single"
			value="option"
			checked={true}
			onChange={() => {}}
		>
			Single Option (checked)
		</RadioOption>
	),
};
