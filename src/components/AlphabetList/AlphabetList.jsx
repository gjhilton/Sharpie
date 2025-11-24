import React from 'react';
import { css } from '../../../dist/styled-system/css';
import AlphabetRow from '@components/AlphabetRow/AlphabetRow.jsx';
import DifficultyHeading from '@components/DifficultyHeading/DifficultyHeading.jsx';
import { DIFFICULTY_ORDER } from '@constants/difficulty.js';

const gridStyles = css({
	display: 'grid',
	gridTemplateColumns: 'auto 1fr auto auto',
	gap: '0.5rem 1rem',
	alignItems: 'start',
	marginTop: '2rem',
});

const AlphabetList = ({
	alphabets,
	alphabetsMetadata,
	enabledAlphabets,
	onToggle,
	showDifficultyGroups = false,
	difficultyGroups = null,
	onSelectAll,
	onDeselectAll,
}) => {
	if (showDifficultyGroups && difficultyGroups) {
		// Render grouped by difficulty with headings
		return (
			<div className={gridStyles}>
				{DIFFICULTY_ORDER.map(difficulty => {
					const alphabetsInGroup = difficultyGroups[difficulty];
					if (!alphabetsInGroup || alphabetsInGroup.length === 0) {
						return null;
					}

					// Calculate selection states for this difficulty group
					const selectedCount = alphabetsInGroup.filter(
						name => enabledAlphabets[name]
					).length;
					const allSelected =
						selectedCount === alphabetsInGroup.length;
					const noneSelected = selectedCount === 0;

					return (
						<React.Fragment key={difficulty}>
							<DifficultyHeading
								difficulty={difficulty}
								allSelected={allSelected}
								noneSelected={noneSelected}
								onSelectAll={onSelectAll}
								onDeselectAll={onDeselectAll}
							/>
							{alphabetsInGroup.map(name => (
								<AlphabetRow
									key={name}
									name={name}
									metadata={alphabetsMetadata[name]}
									isEnabled={enabledAlphabets[name] || false}
									onToggle={() => onToggle(name)}
								/>
							))}
						</React.Fragment>
					);
				})}
			</div>
		);
	}

	// Render flat list without grouping
	return (
		<div className={gridStyles}>
			{alphabets.map(name => (
				<AlphabetRow
					key={name}
					name={name}
					metadata={alphabetsMetadata[name]}
					isEnabled={enabledAlphabets[name] || false}
					onToggle={() => onToggle(name)}
				/>
			))}
		</div>
	);
};

export { AlphabetList };
export default AlphabetList;
