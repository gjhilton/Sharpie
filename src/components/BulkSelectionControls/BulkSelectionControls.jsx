import { css } from '../../../dist/styled-system/css';
import { BulkSelectionLink } from '@components/BulkSelectionLink/BulkSelectionLink';

export const BulkSelectionControls = ({
	difficulty,
	allSelected = false,
	noneSelected = false,
	onSelectAll,
	onDeselectAll,
}) => {
	const handleSelectAll = () => {
		if (onSelectAll) {
			onSelectAll(difficulty);
		}
	};

	const handleDeselectAll = () => {
		if (onDeselectAll) {
			onDeselectAll(difficulty);
		}
	};

	return (
		<div
			className={css({
				fontSize: 's',
				display: 'flex',
				gap: 'lg',
			})}
		>
			<BulkSelectionLink disabled={allSelected} onClick={handleSelectAll}>
				select all
			</BulkSelectionLink>
			<BulkSelectionLink
				disabled={noneSelected}
				onClick={handleDeselectAll}
			>
				deselect all
			</BulkSelectionLink>
		</div>
	);
};
