/**
 * Shared focus ring styles for interactive elements.
 * Use with Panda CSS's css() function.
 *
 * @example
 * css({
 *   '&:focus-visible': focusRing,
 * })
 */
const focusRing = {
	outline: '2px solid {colors.toggleActive}',
	outlineOffset: '2px',
};

export { focusRing };
