import { css } from '../../styled-system/css';

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

const Button = ({ onClick, label, disabled, sublabel, hero }) => (
	<button
		className={css({
			cursor: 'pointer',
			minWidth: { base: '100%', md: '200px' },
			opacity: disabled ? 0.5 : 1,
			cursor: disabled ? 'not-allowed' : 'pointer',
			border: hero ? '3px solid black' : '1px solid black',
			fontSize: 'm',
			fontWeight: hero ? 900 : 400,
			padding: '1rem 3rem',
			margin: '2rem 0',
			textTransform: hero ? 'uppercase' : 'none',
			transition: 'all 200ms ease-in-out',
			_hover: disabled
				? undefined
				: {
						transform: 'scale(1.02)',
					},
			_focusVisible: {
				outline: '2px solid black',
				outlineOffset: '2px',
			},
			_active: disabled
				? undefined
				: {
						transform: 'scale(0.98)',
					},
		})}
		onClick={onClick}
		disabled={disabled}
	>
		<ButtonLabel text={label} />
		{sublabel && <ButtonLabelAux text={sublabel} />}
	</button>
);

export default Button;
