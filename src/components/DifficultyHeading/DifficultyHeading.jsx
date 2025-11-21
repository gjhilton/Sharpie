import { css } from '../../../styled-system/css';
import { DIFFICULTY_LABELS } from '@constants/difficulty.js';

const DifficultyHeading = ({ difficulty }) => {
	const label = DIFFICULTY_LABELS[difficulty] || difficulty;

	return (
		<h3
			className={css({
				gridColumn: '1 / -1',
				fontSize: 'l',
				fontWeight: '700',
				marginTop: '1.5rem',
				marginBottom: '0.5rem',
				color: '{colors.ink}',
			})}
		>
			Difficulty: {label}
		</h3>
	);
};

export default DifficultyHeading;
