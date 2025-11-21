import DifficultyHeading from '@components/DifficultyHeading/DifficultyHeading.jsx';

export default {
	title: 'Components/DifficultyHeading',
	component: DifficultyHeading,
	tags: ['autodocs'],
};

export const Easy = {
	args: {
		difficulty: 'easy',
	},
};

export const Medium = {
	args: {
		difficulty: 'medium',
	},
};

export const Hard = {
	args: {
		difficulty: 'hard',
	},
};

export const AllLevels = {
	render: () => (
		<div>
			<DifficultyHeading difficulty="easy" />
			<p>Sample alphabet content would appear here...</p>
			<DifficultyHeading difficulty="medium" />
			<p>Sample alphabet content would appear here...</p>
			<DifficultyHeading difficulty="hard" />
			<p>Sample alphabet content would appear here...</p>
		</div>
	),
};
