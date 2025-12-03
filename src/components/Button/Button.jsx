import { css } from '../../../dist/styled-system/css';

const TRANSITION_DURATION = '200ms';
const HOVER_SCALE = 1.02;
const ACTIVE_SCALE = 0.98;

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
				transition: `all ${TRANSITION_DURATION} ease-in-out`,
				_hover: {
					transform: disabled ? 'none' : `scale(${HOVER_SCALE})`,
				},
				_focusVisible: {
					outline: '2px solid {colors.ink}',
					outlineOffset: '2px',
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
