import { css } from '../../../dist/styled-system/css';

/**
 * A button that looks exactly like a link.
 * Use for actions that should look like links but are semantically buttons.
 * Inherits font styles from parent for seamless integration.
 */
const LinkAsButton = ({ children, onClick, disabled = false, className }) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		className={`${css({
			// Reset button styles completely
			background: 'none',
			border: 'none',
			padding: 0,
			margin: 0,
			font: 'inherit',
			fontSize: 'inherit',
			fontFamily: 'inherit',
			fontWeight: 'inherit',
			lineHeight: 'inherit',
			textAlign: 'inherit',
			// Look like a link
			color: 'inherit',
			textDecoration: 'underline',
			cursor: 'pointer',
			// Disabled state
			'&:disabled': {
				cursor: 'not-allowed',
				opacity: 0.5,
				textDecoration: 'none',
			},
			// Hover state (only when not disabled)
			'&:hover:not(:disabled)': {
				color: '{colors.toggleActive}',
			},
			// Focus state for accessibility
			'&:focus-visible': {
				outline: '2px solid {colors.toggleActive}',
				outlineOffset: '2px',
			},
		})} ${className || ''}`}
	>
		{children}
	</button>
);

export { LinkAsButton };
