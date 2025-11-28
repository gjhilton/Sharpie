import { css } from '../../../dist/styled-system/css';

const baseInputStyles = {
	padding: '0.75rem',
	fontSize: 'm',
	border: '1px solid {colors.ink}',
	backgroundColor: '{colors.paper}',
	_focusVisible: {
		outline: '2px solid {colors.ink}',
		outlineOffset: '2px',
	},
};

const inputStyles = css(baseInputStyles);

const Input = ({ id, type = 'text', name, required = false, readOnly = false, value, onClick, onFocus, onTouchStart, ...customStyles }) => (
	<input
		id={id}
		type={type}
		name={name}
		required={required}
		readOnly={readOnly}
		value={value}
		onClick={onClick}
		onFocus={onFocus}
		onTouchStart={onTouchStart}
		className={css(baseInputStyles, customStyles)}
	/>
);

const Textarea = ({ id, name, required = false, ...customStyles }) => (
	<textarea
		id={id}
		name={name}
		required={required}
		rows={6}
		className={css(baseInputStyles, {
			resize: 'vertical',
			fontFamily: 'inherit',
		}, customStyles)}
	/>
);

export { Input, Textarea, inputStyles };
export default Input;
