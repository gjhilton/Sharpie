import { css } from '../../../dist/styled-system/css';

const PADDING = '0.75rem';
const FONT_SIZE = 'm';
const BORDER = '1px solid {colors.ink}';
const BACKGROUND_COLOR = '{colors.paper}';
const OUTLINE = '2px solid {colors.ink}';
const OUTLINE_OFFSET = '2px';
const TEXTAREA_ROWS = 6;

const baseInputStyles = {
	padding: PADDING,
	fontSize: FONT_SIZE,
	border: BORDER,
	backgroundColor: BACKGROUND_COLOR,
	_focusVisible: {
		outline: OUTLINE,
		outlineOffset: OUTLINE_OFFSET,
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
		rows={TEXTAREA_ROWS}
		className={css(baseInputStyles, {
			resize: 'vertical',
			fontFamily: 'inherit',
		}, customStyles)}
	/>
);

export { Input, Textarea, inputStyles };
