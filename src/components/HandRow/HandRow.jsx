import { css } from '../../../dist/styled-system/css';
import { Toggle } from '@components/Toggle/Toggle';

const LETTER_COUNT_FONT_SIZE = '0.875rem';
const LETTER_COUNT_MARGIN_TOP = '0.25rem';

export const HandRow = ({ name, metadata, isEnabled, onToggle }) => {
	const letterCount = (metadata.majuscules || 0) + (metadata.minuscules || 0);
	const letterCountDisplay =
		letterCount > 0
			? `(${letterCount} characters: ${metadata.minuscules || 0} minuscule, ${metadata.majuscules || 0} majuscule)`
			: '';

	return (
		<>
			<Toggle
				id={`hand-${name}`}
				checked={isEnabled}
				onChange={onToggle}
			/>
			<span className={css({ fontWeight: '900' })}>{metadata.date}</span>
			<div>
				<div>{metadata.title}</div>
				{letterCountDisplay && (
					<div
						className={css({
							fontSize: LETTER_COUNT_FONT_SIZE,
							color: '{colors.ink/70}',
							marginTop: LETTER_COUNT_MARGIN_TOP,
						})}
					>
						{letterCountDisplay}
					</div>
				)}
			</div>
			<a
				href={metadata.sourceUri}
				target="_blank"
				rel="noopener noreferrer"
				className={css({
					color: '{colors.ink}',
					textDecoration: 'underline',
					'&:hover': {
						color: '{colors.toggleActive}',
					},
				})}
			>
				source
			</a>
		</>
	);
};
