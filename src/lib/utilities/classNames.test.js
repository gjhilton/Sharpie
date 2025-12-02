import { describe, it, expect } from 'vitest';
import { cx } from './classNames.js';

describe('cx', () => {
	it('concatenates multiple class names', () => {
		expect(cx('foo', 'bar')).toBe('foo bar');
	});

	it('filters out null values', () => {
		expect(cx('foo', null, 'bar')).toBe('foo bar');
	});

	it('filters out undefined values', () => {
		expect(cx('foo', undefined, 'bar')).toBe('foo bar');
	});

	it('filters out false values', () => {
		expect(cx('foo', false, 'bar')).toBe('foo bar');
	});

	it('filters out empty strings', () => {
		expect(cx('foo', '', 'bar')).toBe('foo bar');
	});

	it('handles single class', () => {
		expect(cx('foo')).toBe('foo');
	});

	it('handles no classes', () => {
		expect(cx()).toBe('');
	});

	it('handles all falsy values', () => {
		expect(cx(null, undefined, false, '')).toBe('');
	});
});
