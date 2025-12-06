import { css } from '../../../dist/styled-system/css';
import { DIFFICULTY_LABELS } from '@lib/constants/difficulty';
import { BulkSelectionControls } from '@components/BulkSelectionControls/BulkSelectionControls';

const MARGIN_TOP = '2xl';
const MARGIN_BOTTOM = 'sm';

export const DifficultyHeading = ({
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
				marginTop: MARGIN_TOP,
				marginBottom: MARGIN_BOTTOM,
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
