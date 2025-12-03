import { css } from '../../../dist/styled-system/css';
import { DIFFICULTY_LABELS } from '@lib/constants/difficulty.js';
import { BulkSelectionControls } from '@components/BulkSelectionControls/BulkSelectionControls';

const DifficultyHeading = ({
	difficulty,
	allSelected = false,
	noneSelected = false,
	onSelectAll,
	onDeselectAll,
}) => {
	const label = DIFFICULTY_LABELS[difficulty] || difficulty;

	return (
		<div
			className={css({
				gridColumn: '1 / -1',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'baseline',
				marginTop: '1.5rem',
				marginBottom: '0.5rem',
			})}
		>
			<h3
				className={css({
					fontSize: 'l',
					fontWeight: '700',
					color: '{colors.ink}',
					margin: '0',
				})}
			>
				Difficulty: {label}
			</h3>
			<BulkSelectionControls
				difficulty={difficulty}
				allSelected={allSelected}
				noneSelected={noneSelected}
				onSelectAll={onSelectAll}
				onDeselectAll={onDeselectAll}
			/>
		</div>
	);
};

export default DifficultyHeading;
