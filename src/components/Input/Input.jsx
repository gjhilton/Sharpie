import { css } from '../../../dist/styled-system/css';
import {
	FOCUS_OUTLINE,
	FOCUS_OUTLINE_OFFSET,
	PADDING_STANDARD,
	FONT_SIZE_MEDIUM,
	BORDER_STANDARD
} from '@lib/constants/ui';

const BACKGROUND_COLOR = '{colors.paper}';
const TEXTAREA_ROWS = 6;

const baseInputStyles = {
	padding: PADDING_STANDARD,
	fontSize: FONT_SIZE_MEDIUM,
	border: BORDER_STANDARD,
	backgroundColor: BACKGROUND_COLOR,
	_focusVisible: {
		outline: FOCUS_OUTLINE,
		outlineOffset: FOCUS_OUTLINE_OFFSET,
	},
};

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

export { Input, Textarea };
