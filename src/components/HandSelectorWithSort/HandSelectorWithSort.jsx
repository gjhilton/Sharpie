import { useState, useMemo } from 'react';
import { SortSelector } from '@components/SortSelector/SortSelector';
import { HandList } from '@components/HandList/HandList';
import {
	sortHandsByDate,
	sortHandsByName,
	sortHandsByDifficulty,
	groupHandsByDifficulty,
} from '@lib/utilities/handSorting';

const SORT_OPTIONS = [
	{ value: 'date', label: 'By Date' },
	{ value: 'name', label: 'By Name' },
	{ value: 'difficulty', label: 'By Difficulty' },
];

export const HandSelectorWithSort = ({
	handNames,
	handsMetadata,
	enabledHands,
	onToggle,
	onBatchToggle,
}) => {
	const [sortMode, setSortMode] = useState('date');

	// Determine sorted hands and difficulty groups based on sort mode
	const { sortedHands, difficultyGroups, showDifficultyGroups } = useMemo(() => {
		if (sortMode === 'date') {
			return {
				sortedHands: sortHandsByDate(handNames, handsMetadata),
				difficultyGroups: null,
				showDifficultyGroups: false,
			};
		}

		if (sortMode === 'name') {
			return {
				sortedHands: sortHandsByName(handNames),
				difficultyGroups: null,
				showDifficultyGroups: false,
			};
		}

		if (sortMode === 'difficulty') {
			return {
				sortedHands: sortHandsByDifficulty(handNames, handsMetadata),
				difficultyGroups: groupHandsByDifficulty(handNames, handsMetadata),
				showDifficultyGroups: true,
			};
		}

		return {
			sortedHands: [],
			difficultyGroups: null,
			showDifficultyGroups: false,
		};
	}, [sortMode, handNames, handsMetadata]);

	const batchToggleHands = (difficulty, targetState) => {
		if (!difficultyGroups || !difficultyGroups[difficulty]) {
			return;
		}

		// Use batch toggle if available, otherwise fall back to individual toggles
		if (onBatchToggle) {
			const updates = {};
			difficultyGroups[difficulty].forEach(handName => {
				if (enabledHands[handName] !== targetState) {
					updates[handName] = targetState;
				}
			});
			onBatchToggle(updates);
		} else {
			difficultyGroups[difficulty].forEach(handName => {
				if (enabledHands[handName] !== targetState) {
					onToggle(handName);
				}
			});
		}
	};

	const handleSelectAll = difficulty => batchToggleHands(difficulty, true);
	const handleDeselectAll = difficulty => batchToggleHands(difficulty, false);

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
