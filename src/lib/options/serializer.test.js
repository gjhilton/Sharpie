import { describe, it, expect } from 'vitest';
import {
	serializeValue,
	deserializeValue,
	serializeOption,
	serializeOptions,
	deserializeOptions,
} from './serializer.js';

describe('serializeValue', () => {
	it('should serialize enum values', () => {
		expect(serializeValue('mode', 'all')).toBe('a');
		expect(serializeValue('mode', 'minuscule')).toBe('i');
		expect(serializeValue('mode', 'majuscule')).toBe('j');
	});

	it('should serialize boolean values', () => {
		expect(serializeValue('twentyFourLetter', true)).toBe('1');
		expect(serializeValue('twentyFourLetter', false)).toBe('0');
		expect(serializeValue('showBaseline', true)).toBe('1');
		expect(serializeValue('showBaseline', false)).toBe('0');
	});

	it('should serialize alphabet sets from objects', () => {
		const alphabets = {
			'BeauChesne-Baildon': true,
			Hill: true,
			Joscelyn: false,
		};
		const result = serializeValue('alphabets', alphabets);
		expect(result).toContain('006');
		expect(result).toContain('007');
		expect(result).not.toContain('011');
	});

	it('should return null for empty alphabet set', () => {
		expect(serializeValue('alphabets', [])).toBeNull();
	});
});

describe('deserializeValue', () => {
	it('should deserialize enum values', () => {
		expect(deserializeValue('mode', 'a')).toBe('all');
		expect(deserializeValue('mode', 'i')).toBe('minuscule');
		expect(deserializeValue('mode', 'j')).toBe('majuscule');
	});

	it('should deserialize boolean values', () => {
		expect(deserializeValue('twentyFourLetter', '1')).toBe(true);
		expect(deserializeValue('twentyFourLetter', '0')).toBe(false);
		expect(deserializeValue('showBaseline', '1')).toBe(true);
		expect(deserializeValue('showBaseline', '0')).toBe(false);
	});

	it('should deserialize alphabet sets as objects', () => {
		const result = deserializeValue('alphabets', '006,007');
		expect(typeof result).toBe('object');
		expect(result['BeauChesne-Baildon']).toBe(true);
		expect(result['Hill']).toBe(true);
	});

	it('should return defaults for invalid enum', () => {
		expect(deserializeValue('mode', 'x')).toBe('all');
	});
});

describe('serializeOption', () => {
	it('should return URL param object', () => {
		expect(serializeOption('mode', 'minuscule')).toEqual({ m: 'i' });
	});

	it('should return undefined for default values', () => {
		const result = serializeOption('mode', 'all');
		expect(result.m).toBeUndefined();
	});
});

describe('deserializeOptions', () => {
	it('should deserialize all options from search params', () => {
		const result = deserializeOptions({
			m: 'i',
			l: '1',
			b: '0',
			a: '006,007',
		});

		expect(result.mode).toBe('minuscule');
		expect(result.twentyFourLetterAlphabet).toBe(true);
		expect(result.showBaseline).toBe(false);
		expect(typeof result.enabledAlphabets).toBe('object');
		expect(result.enabledAlphabets['BeauChesne-Baildon']).toBe(true);
		expect(result.enabledAlphabets['Hill']).toBe(true);
	});

	it('should use defaults for missing params', () => {
		const result = deserializeOptions({});

		expect(result.mode).toBe('all');
		expect(result.twentyFourLetterAlphabet).toBe(false);
		expect(result.showBaseline).toBe(true);
		expect(typeof result.enabledAlphabets).toBe('object');
		expect(Object.keys(result.enabledAlphabets).length).toBeGreaterThan(0);
	});
});

describe('serializeOptions', () => {
	it('should serialize non-default options', () => {
		const result = serializeOptions({
			mode: 'minuscule',
			twentyFourLetterAlphabet: true,
		});

		expect(result.m).toBe('i');
		expect(result.l).toBe('1');
	});

	it('should omit default values', () => {
		const result = serializeOptions({
			mode: 'all',
			showBaseline: true,
		});

		expect(result.m).toBeUndefined();
		expect(result.b).toBeUndefined();
	});
});
