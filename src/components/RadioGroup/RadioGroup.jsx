import { css } from '../../../dist/styled-system/css';
import { Fieldset, Legend } from '@components/Layout/Layout';

const RADIO_SIZE = '1.2rem';
const GAP_NONE = '0';
const LINE_HEIGHT = '1.6';

const radioInputStyles = css({
	width: RADIO_SIZE,
	height: RADIO_SIZE,
});

const RadioOption = ({ name, value, checked, onChange, children }) => (
	<label
		className={css({
			display: 'flex',
			alignItems: 'center',
			gap: 'sm',
			cursor: 'pointer',
			fontWeight: checked ? 'bold' : 'normal',
		})}
	>
		<input
			type="radio"
			name={name}
			value={value}
			checked={checked}
			onChange={onChange}
			className={radioInputStyles}
		/>
		{children}
	</label>
);

const RadioGroup = ({
	legend,
	legendVisible = false,
	name,
	value,
	onChange,
	options,
	className,
}) => (
	<Fieldset
		className={`${css({
			marginBottom: 'lg',
		})} ${className || ''}`}
	>
		<Legend visuallyHidden={!legendVisible}>{legend}</Legend>
		<div
			className={css({
				display: 'flex',
				flexDirection: 'column',
				gap: GAP_NONE,
				lineHeight: LINE_HEIGHT,
			})}
		>
			{options.map(option => (
				<RadioOption
					key={option.value}
					name={name}
					value={option.value}
					checked={value === option.value}
					onChange={onChange}
				>
					{option.label}
				</RadioOption>
			))}
		</div>
	</Fieldset>
);

export { RadioOption, RadioGroup };
