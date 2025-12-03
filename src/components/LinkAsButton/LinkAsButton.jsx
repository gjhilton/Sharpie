import { css } from '../../../dist/styled-system/css';

const PADDING = 0;
const MARGIN = 0;
const OPACITY_DISABLED = 0.5;
const OUTLINE = '2px solid {colors.toggleActive}';
const OUTLINE_OFFSET = '2px';

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
				outline: OUTLINE,
				outlineOffset: OUTLINE_OFFSET,
			},
		})} ${className || ''}`}
	>
		{children}
	</button>
);

export { LinkAsButton };
