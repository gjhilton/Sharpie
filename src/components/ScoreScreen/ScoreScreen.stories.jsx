import ScoreScreen from './ScoreScreen';

export default {
	title: 'Screens/ScoreScreen',
	component: ScoreScreen,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	argTypes: {
		score: {
			control: 'object',
			description:
				'Score object containing correct, incorrect, percentage, and timeElapsed',
		},
		onReturnToMenu: {
			action: 'return to menu',
			description:
				'Function called when Return to Menu button is clicked',
		},
	},
};

export const PerfectScore = {
	args: {
		score: {
			correct: 20,
			incorrect: 0,
			percentage: 100,
			timeElapsed: 45,
		},
	},
};

export const GoodScore = {
	args: {
		score: {
			correct: 15,
			incorrect: 5,
			percentage: 75,
			timeElapsed: 60,
		},
	},
};

export const AverageScore = {
	args: {
		score: {
			correct: 10,
			incorrect: 10,
			percentage: 50,
			timeElapsed: 90,
		},
	},
};

export const NeedsImprovement = {
	args: {
		score: {
			correct: 5,
			incorrect: 15,
			percentage: 25,
			timeElapsed: 120,
		},
	},
};

export const QuickRound = {
	args: {
		score: {
			correct: 8,
			incorrect: 2,
			percentage: 80,
			timeElapsed: 15,
		},
	},
};

export const LongSession = {
	args: {
		score: {
			correct: 50,
			incorrect: 10,
			percentage: 83,
			timeElapsed: 300,
		},
	},
};
