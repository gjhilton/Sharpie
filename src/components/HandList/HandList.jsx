import { css } from '../../../dist/styled-system/css';
import { HandRow } from '@components/HandRow/HandRow';
import { DifficultyHeading } from '@components/DifficultyHeading/DifficultyHeading';
import { DIFFICULTY_ORDER } from '@lib/constants/difficulty';

const GRID_GAP = '0.5rem 1rem';
const MARGIN_TOP = '2rem';

const gridStyles = css({
	display: 'grid',
	gridTemplateColumns: 'auto 1fr auto auto',
	gap: GRID_GAP,
	alignItems: 'start',
	marginTop: MARGIN_TOP,
});

export const HandList = ({
	hands,
	handsMetadata,
	enabledHands,
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
					const handsInGroup = difficultyGroups[difficulty];
					if (!handsInGroup || handsInGroup.length === 0) {
						return null;
					}

					// Calculate selection states for this difficulty group
					const selectedCount = handsInGroup.filter(
						name => enabledHands[name]
					).length;
					const allSelected =
						selectedCount === handsInGroup.length;
					const noneSelected = selectedCount === 0;

					return (
						<div key={difficulty}>
							<DifficultyHeading
								difficulty={difficulty}
								allSelected={allSelected}
								noneSelected={noneSelected}
								onSelectAll={onSelectAll}
								onDeselectAll={onDeselectAll}
							/>
							{handsInGroup.map(name => (
								<HandRow
									key={name}
									name={name}
									metadata={handsMetadata[name]}
									isEnabled={enabledHands[name] || false}
									onToggle={() => onToggle(name)}
								/>
							))}
						</div>
					);
				})}
			</div>
		);
	}

	// Render flat list without grouping
	return (
		<div className={gridStyles}>
			{hands.map(name => (
				<HandRow
					key={name}
					name={name}
					metadata={handsMetadata[name]}
					isEnabled={enabledHands[name] || false}
					onToggle={() => onToggle(name)}
				/>
			))}
		</div>
	);
};
