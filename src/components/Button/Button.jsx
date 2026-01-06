import { css } from '../../../dist/styled-system/css';
import {
	FOCUS_OUTLINE,
	FOCUS_OUTLINE_OFFSET,
	TRANSITION_ALL_NORMAL,
	HOVER_SCALE_SMALL,
	ACTIVE_SCALE,
} from '@lib/constants/ui';

const ButtonLabel = ({ text }) => (
	<span
		className={css({
			display: 'block',
			fontSize: 'l',
		})}
	>
		{text}
	</span>
);

const ButtonLabelAux = ({ text }) => (
	<span
		className={css({
			display: 'block',
			fontSize: 's',
		})}
	>
		{text}
	</span>
);

export const Button = ({ onClick, label, disabled, sublabel, hero }) => {
	const ariaLabel = sublabel ? `${label} ${sublabel}` : undefined;

	return (
		<button
			type="button"
			className={css({
				background: '{colors.paper}',
				cursor: disabled ? 'not-allowed' : 'pointer',
				minWidth: { base: '100%', md: '200px' },
				opacity: disabled ? 0.5 : 1,
				border: hero
					? '3px solid {colors.ink}'
					: '1px solid {colors.ink}',
				fontSize: 'm',
				fontWeight: hero ? 900 : 400,
				padding: '1rem 3rem',
				margin: '2rem 0',
				textTransform: hero ? 'uppercase' : 'none',
				transition: TRANSITION_ALL_NORMAL,
				_hover: {
					transform: disabled
						? 'none'
						: `scale(${HOVER_SCALE_SMALL})`,
				},
				_focusVisible: {
					outline: FOCUS_OUTLINE,
					outlineOffset: FOCUS_OUTLINE_OFFSET,
				},
				_active: {
					transform: disabled ? 'none' : `scale(${ACTIVE_SCALE})`,
				},
			})}
			onClick={onClick}
			disabled={disabled}
			aria-label={ariaLabel}
		>
			<ButtonLabel text={label} />
			{sublabel && <ButtonLabelAux text={sublabel} />}
		</button>
	);
};
