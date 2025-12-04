// Shared UI constants for focus states and interactions
export const FOCUS_OUTLINE = '2px solid {colors.ink}';
export const FOCUS_OUTLINE_OFFSET = '2px';
export const FOCUS_OUTLINE_TOGGLE = '2px solid {colors.toggleActive}';

// Animation and interaction constants
export const ANIMATION_DURATION_FAST = '150ms';
export const ANIMATION_DURATION_NORMAL = '200ms';
export const HOVER_SCALE_SMALL = 1.02;
export const HOVER_SCALE_MEDIUM = 1.05;
export const ACTIVE_SCALE = 0.95;

// Opacity constants
export const OPACITY_DISABLED = 0.5;
export const OPACITY_ENABLED = 1;

// Font size constants
export const FONT_SIZE_SMALL = 's';
export const FONT_SIZE_MEDIUM = 'm';

// Keyboard key constants
export const KEY_SPACE = ' ';
export const KEY_ENTER = 'Enter';

// Padding constants
export const PADDING_STANDARD = '0.75rem';
export const PADDING_BUTTON = '0.5rem 1rem';

// Border constants
export const BORDER_STANDARD = '1px solid {colors.ink}';

// Transition constants
export const TRANSITION_ALL_FAST = `all ${ANIMATION_DURATION_FAST} ease-in-out`;
export const TRANSITION_ALL_NORMAL = `all ${ANIMATION_DURATION_NORMAL} ease-in-out`;

// Common button styles
export const commonButtonStyles = {
	padding: PADDING_BUTTON,
	border: BORDER_STANDARD,
	backgroundColor: '{colors.paper}',
	color: '{colors.ink}',
	cursor: 'pointer',
	fontSize: FONT_SIZE_SMALL,
	fontWeight: 'bold',
	transition: TRANSITION_ALL_FAST,
	_hover: {
		transform: `scale(${HOVER_SCALE_SMALL})`,
	},
	_active: {
		transform: `scale(${ACTIVE_SCALE})`,
	},
	_focusVisible: {
		outline: FOCUS_OUTLINE,
		outlineOffset: FOCUS_OUTLINE_OFFSET,
	},
};
