/**
 * Concatenates class names, filtering out falsy values.
 * Replacement for repeated `${css({})} ${className || ''}` pattern.
 *
 * @param {...(string|undefined|null|false)} classes - Class names to concatenate
 * @returns {string} Space-separated class names
 *
 * @example
 * cx('foo', 'bar')           // 'foo bar'
 * cx('foo', null, 'bar')     // 'foo bar'
 * cx('foo', undefined)       // 'foo'
 * cx(css({}), className)     // works with Panda CSS
 */
const cx = (...classes) => classes.filter(Boolean).join(' ');

export { cx };
