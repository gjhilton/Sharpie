import { useState } from 'react';
import SortSelector from '@components/SortSelector/SortSelector.jsx';
import HandList from '@components/HandList/HandList.jsx';
import {
	sortHandsByDate,
	sortHandsByName,
	sortHandsByDifficulty,
	groupHandsByDifficulty,
} from '@lib/utilities/handSorting.js';

const SORT_OPTIONS = [
	{ value: 'date', label: 'By Date' },
	{ value: 'name', label: 'By Name' },
	{ value: 'difficulty', label: 'By Difficulty' },
];

const HandSelectorWithSort = ({
	handNames,
	handsMetadata,
	enabledHands,
	onToggle,
	onBatchToggle,
}) => {
	const [sortMode, setSortMode] = useState('date');

	// Determine sorted hands and difficulty groups based on sort mode
	let sortedHands = [];
	let difficultyGroups = null;
	let showDifficultyGroups = false;

	if (sortMode === 'date') {
		sortedHands = sortHandsByDate(handNames, handsMetadata);
	} else if (sortMode === 'name') {
		sortedHands = sortHandsByName(handNames);
	} else if (sortMode === 'difficulty') {
		sortedHands = sortHandsByDifficulty(
			handNames,
			handsMetadata
		);
		difficultyGroups = groupHandsByDifficulty(
			handNames,
			handsMetadata
		);
		showDifficultyGroups = true;
	}

	const handleSelectAll = difficulty => {
		if (!difficultyGroups || !difficultyGroups[difficulty]) {
			return;
		}

		// Use batch toggle if available, otherwise fall back to individual toggles
		if (onBatchToggle) {
			const updates = {};
			difficultyGroups[difficulty].forEach(handName => {
				if (!enabledHands[handName]) {
					updates[handName] = true;
				}
			});
			onBatchToggle(updates);
		} else {
			difficultyGroups[difficulty].forEach(handName => {
				if (!enabledHands[handName]) {
					onToggle(handName);
				}
			});
		}
	};

	const handleDeselectAll = difficulty => {
		if (!difficultyGroups || !difficultyGroups[difficulty]) {
			return;
		}

		// Use batch toggle if available, otherwise fall back to individual toggles
		if (onBatchToggle) {
			const updates = {};
			difficultyGroups[difficulty].forEach(handName => {
				if (enabledHands[handName]) {
					updates[handName] = false;
				}
			});
			onBatchToggle(updates);
		} else {
			difficultyGroups[difficulty].forEach(handName => {
				if (enabledHands[handName]) {
					onToggle(handName);
				}
			});
		}
	};

	return (
		<div>
			<SortSelector
				value={sortMode}
				onChange={setSortMode}
				options={SORT_OPTIONS}
			/>
			<HandList
				hands={sortedHands}
				handsMetadata={handsMetadata}
				enabledHands={enabledHands}
				onToggle={onToggle}
				showDifficultyGroups={showDifficultyGroups}
				difficultyGroups={difficultyGroups}
				onSelectAll={handleSelectAll}
				onDeselectAll={handleDeselectAll}
			/>
		</div>
	);
};

export default HandSelectorWithSort;
