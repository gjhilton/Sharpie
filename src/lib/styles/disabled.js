/**
 * Returns disabled/enabled styles based on disabled state.
 * Use with Panda CSS's css() function.
 *
 * @param {boolean} disabled - Whether the element is disabled
 * @returns {Object} Style object with cursor and opacity
 *
 * @example
 * css({
 *   ...disabledStyles(disabled),
 * })
 */
const disabledStyles = disabled => ({
	cursor: disabled ? 'not-allowed' : 'pointer',
	opacity: disabled ? 0.5 : 1,
});

export { disabledStyles };
