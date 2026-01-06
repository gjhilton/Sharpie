import { css } from '../../../dist/styled-system/css';
import {
	FOCUS_OUTLINE_TOGGLE,
	FOCUS_OUTLINE_OFFSET,
	OPACITY_DISABLED,
} from '@lib/constants/ui';

const PADDING = 0;
const MARGIN = 0;

const LinkAsButton = ({ children, onClick, disabled = false, className }) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		className={`${css({
			background: 'none',
			border: 'none',
			padding: PADDING,
			margin: MARGIN,
			font: 'inherit',
			fontSize: 'inherit',
			fontFamily: 'inherit',
			fontWeight: 'inherit',
			lineHeight: 'inherit',
			textAlign: 'inherit',
			color: 'inherit',
			textDecoration: 'underline',
			cursor: 'pointer',
			'&:disabled': {
				cursor: 'not-allowed',
				opacity: OPACITY_DISABLED,
				textDecoration: 'none',
			},
			'&:hover:not(:disabled)': {
				color: '{colors.toggleActive}',
			},
			'&:focus-visible': {
				outline: FOCUS_OUTLINE_TOGGLE,
				outlineOffset: FOCUS_OUTLINE_OFFSET,
			},
		})} ${className || ''}`}
	>
		{children}
	</button>
);

export { LinkAsButton };
