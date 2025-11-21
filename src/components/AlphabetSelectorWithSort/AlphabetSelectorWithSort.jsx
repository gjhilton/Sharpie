import { useState } from 'react';
import SortSelector from '@components/SortSelector/SortSelector.jsx';
import AlphabetList from '@components/AlphabetList/AlphabetList.jsx';
import {
	sortAlphabetsByDate,
	sortAlphabetsByName,
	sortAlphabetsByDifficulty,
	groupAlphabetsByDifficulty,
} from '@utilities/alphabetSorting.js';

const SORT_OPTIONS = [
	{ value: 'date', label: 'By Date' },
	{ value: 'name', label: 'By Name' },
	{ value: 'difficulty', label: 'By Difficulty' },
];

const AlphabetSelectorWithSort = ({ alphabetNames, alphabetsMetadata, enabledAlphabets, onToggle }) => {
	const [sortMode, setSortMode] = useState('date');

	// Determine sorted alphabets and difficulty groups based on sort mode
	let sortedAlphabets = [];
	let difficultyGroups = null;
	let showDifficultyGroups = false;

	if (sortMode === 'date') {
		sortedAlphabets = sortAlphabetsByDate(alphabetNames, alphabetsMetadata);
	} else if (sortMode === 'name') {
		sortedAlphabets = sortAlphabetsByName(alphabetNames);
	} else if (sortMode === 'difficulty') {
		sortedAlphabets = sortAlphabetsByDifficulty(alphabetNames, alphabetsMetadata);
		difficultyGroups = groupAlphabetsByDifficulty(alphabetNames, alphabetsMetadata);
		showDifficultyGroups = true;
	}

	return (
		<div>
			<SortSelector value={sortMode} onChange={setSortMode} options={SORT_OPTIONS} />
			<AlphabetList
				alphabets={sortedAlphabets}
				alphabetsMetadata={alphabetsMetadata}
				enabledAlphabets={enabledAlphabets}
				onToggle={onToggle}
				showDifficultyGroups={showDifficultyGroups}
				difficultyGroups={difficultyGroups}
			/>
		</div>
	);
};

export default AlphabetSelectorWithSort;
