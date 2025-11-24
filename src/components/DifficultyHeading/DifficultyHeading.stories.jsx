import DifficultyHeading from '@components/DifficultyHeading/DifficultyHeading.jsx';

export default {
	title: 'Components/DifficultyHeading',
	component: DifficultyHeading,
	tags: ['autodocs'],
};

export const Easy = {
	args: {
		difficulty: 'easy',
		allSelected: false,
		noneSelected: false,
		onSelectAll: difficulty => console.log('Select all:', difficulty),
		onDeselectAll: difficulty => console.log('Deselect all:', difficulty),
	},
};

export const Medium = {
	args: {
		difficulty: 'medium',
		allSelected: false,
		noneSelected: false,
		onSelectAll: difficulty => console.log('Select all:', difficulty),
		onDeselectAll: difficulty => console.log('Deselect all:', difficulty),
	},
};

export const Hard = {
	args: {
		difficulty: 'hard',
		allSelected: false,
		noneSelected: false,
		onSelectAll: difficulty => console.log('Select all:', difficulty),
		onDeselectAll: difficulty => console.log('Deselect all:', difficulty),
	},
};

export const AllAlphabetsSelected = {
	args: {
		difficulty: 'easy',
		allSelected: true,
		noneSelected: false,
		onSelectAll: difficulty => console.log('Select all:', difficulty),
		onDeselectAll: difficulty => console.log('Deselect all:', difficulty),
	},
	parameters: {
		docs: {
			description: {
				story: 'When all alphabets of this difficulty are selected, "select all" is disabled.',
			},
		},
	},
};

export const NoAlphabetsSelected = {
	args: {
		difficulty: 'hard',
		allSelected: false,
		noneSelected: true,
		onSelectAll: difficulty => console.log('Select all:', difficulty),
		onDeselectAll: difficulty => console.log('Deselect all:', difficulty),
	},
	parameters: {
		docs: {
			description: {
				story: 'When no alphabets of this difficulty are selected, "deselect all" is disabled.',
			},
		},
	},
};

export const AllLevels = {
	render: () => (
		<div style={{ display: 'grid', gap: '1rem' }}>
			<DifficultyHeading
				difficulty="easy"
				allSelected={false}
				noneSelected={false}
				onSelectAll={d => console.log('Select all:', d)}
				onDeselectAll={d => console.log('Deselect all:', d)}
			/>
			<p>Sample alphabet content would appear here...</p>
			<DifficultyHeading
				difficulty="medium"
				allSelected={true}
				noneSelected={false}
				onSelectAll={d => console.log('Select all:', d)}
				onDeselectAll={d => console.log('Deselect all:', d)}
			/>
			<p>Sample alphabet content would appear here...</p>
			<DifficultyHeading
				difficulty="hard"
				allSelected={false}
				noneSelected={true}
				onSelectAll={d => console.log('Select all:', d)}
				onDeselectAll={d => console.log('Deselect all:', d)}
			/>
			<p>Sample alphabet content would appear here...</p>
		</div>
	),
};
