import { css } from '../../../dist/styled-system/css';
import { Fieldset, Legend } from '@components/Layout/Layout.jsx';

const radioInputStyles = css({
	width: '1.2rem',
	height: '1.2rem',
});

const RadioOption = ({ name, value, checked, onChange, children }) => (
	<label
		className={css({
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem',
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
			marginBottom: '1rem',
		})} ${className || ''}`}
	>
		<Legend visuallyHidden={!legendVisible}>{legend}</Legend>
		<div
			className={css({
				display: 'flex',
				flexDirection: 'column',
				gap: '0',
				lineHeight: '1.6',
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
export default RadioGroup;
