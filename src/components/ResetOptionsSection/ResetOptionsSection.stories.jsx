import ResetOptionsSection from './ResetOptionsSection';
import { GameOptionsProvider } from '@lib/context/GameOptionsContext';

export default {
	title: 'Components/ResetOptionsSection',
	component: ResetOptionsSection,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	decorators: [
		Story => (
			<GameOptionsProvider>
				<Story />
			</GameOptionsProvider>
		),
	],
};

export const Default = {
	args: {},
};
