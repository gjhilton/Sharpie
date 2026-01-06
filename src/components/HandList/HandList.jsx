import { css } from '../../../dist/styled-system/css';
import { HandRow } from '@components/HandRow/HandRow';
import { DifficultyHeading } from '@components/DifficultyHeading/DifficultyHeading';
import { Button } from '@components/Button/Button';
import { DIFFICULTY_ORDER } from '@lib/constants/difficulty';

const GRID_ROW_GAP = 'sm';
const GRID_COLUMN_GAP = 'lg';
const MARGIN_TOP = '3xl';

const gridStyles = css({
	display: 'grid',
	gridTemplateColumns: 'auto 1fr auto auto',
	rowGap: GRID_ROW_GAP,
	columnGap: GRID_COLUMN_GAP,
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
	onGlobalSelectAll,
	onGlobalDeselectAll,
	canSelectAll,
	canDeselectAll,
}) => {
	const renderHandRow = name => (
		<HandRow
			key={name}
			name={name}
			metadata={handsMetadata[name]}
			isEnabled={enabledHands[name] || false}
			onToggle={() => onToggle(name)}
		/>
	);

	const renderGlobalButtons = () => (
		<div
			className={css({
				display: 'flex',
				gap: 'md',
				marginTop: 'xl',
				gridColumn: '1 / -1',
			})}
			data-testid="global-hand-buttons"
		>
			<div data-testid="select-all-hands">
				<Button
					onClick={onGlobalSelectAll}
					disabled={!canSelectAll}
					label="Select All"
				/>
			</div>
			<div data-testid="deselect-all-hands">
				<Button
					onClick={onGlobalDeselectAll}
					disabled={!canDeselectAll}
					label="Deselect All"
				/>
			</div>
		</div>
	);

	if (showDifficultyGroups && difficultyGroups) {
		return (
			<div className={gridStyles}>
				{DIFFICULTY_ORDER.map(difficulty => {
					const handsInGroup = difficultyGroups[difficulty];
					if (!handsInGroup || handsInGroup.length === 0) {
						return null;
					}

					const selectedCount = handsInGroup.filter(
						name => enabledHands[name]
					).length;
					const allSelected = selectedCount === handsInGroup.length;
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
							{handsInGroup.map(renderHandRow)}
						</div>
					);
				})}
				{renderGlobalButtons()}
			</div>
		);
	}

	return (
		<div className={gridStyles}>
			{hands.map(renderHandRow)}
			{renderGlobalButtons()}
		</div>
	);
};
