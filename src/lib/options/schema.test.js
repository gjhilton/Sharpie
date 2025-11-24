import { describe, it, expect } from 'vitest';
import { OPTIONS, getOptionByKey, getOptionByUrlParam } from './schema.js';

describe('OPTIONS schema', () => {
	it('should define mode option', () => {
		expect(OPTIONS.mode).toBeDefined();
		expect(OPTIONS.mode.key).toBe('mode');
		expect(OPTIONS.mode.type).toBe('enum');
		expect(OPTIONS.mode.urlParam).toBe('m');
		expect(OPTIONS.mode.default).toBe('all');
	});

	it('should define mode values', () => {
		expect(OPTIONS.mode.values.all).toBeDefined();
		expect(OPTIONS.mode.values.minuscule).toBeDefined();
		expect(OPTIONS.mode.values.majuscule).toBeDefined();
	});

	it('should define alphabets option', () => {
		expect(OPTIONS.alphabets).toBeDefined();
		expect(OPTIONS.alphabets.key).toBe('enabledAlphabets');
		expect(OPTIONS.alphabets.type).toBe('alphabetSet');
		expect(OPTIONS.alphabets.urlParam).toBe('a');
	});

	it('should define twentyFourLetter option', () => {
		expect(OPTIONS.twentyFourLetter).toBeDefined();
		expect(OPTIONS.twentyFourLetter.key).toBe('twentyFourLetterAlphabet');
		expect(OPTIONS.twentyFourLetter.type).toBe('boolean');
		expect(OPTIONS.twentyFourLetter.urlParam).toBe('l');
		expect(OPTIONS.twentyFourLetter.default).toBe(false);
	});

	it('should define showBaseline option', () => {
		expect(OPTIONS.showBaseline).toBeDefined();
		expect(OPTIONS.showBaseline.key).toBe('showBaseline');
		expect(OPTIONS.showBaseline.type).toBe('boolean');
		expect(OPTIONS.showBaseline.urlParam).toBe('b');
		expect(OPTIONS.showBaseline.default).toBe(true);
	});
});

describe('getOptionByKey', () => {
	it('should find option by key', () => {
		expect(getOptionByKey('mode')).toBe(OPTIONS.mode);
		expect(getOptionByKey('enabledAlphabets')).toBe(OPTIONS.alphabets);
		expect(getOptionByKey('twentyFourLetterAlphabet')).toBe(
			OPTIONS.twentyFourLetter
		);
		expect(getOptionByKey('showBaseline')).toBe(OPTIONS.showBaseline);
	});

	it('should return undefined for unknown key', () => {
		expect(getOptionByKey('unknown')).toBeUndefined();
	});
});

describe('getOptionByUrlParam', () => {
	it('should find option by URL param', () => {
		expect(getOptionByUrlParam('m')).toBe(OPTIONS.mode);
		expect(getOptionByUrlParam('a')).toBe(OPTIONS.alphabets);
		expect(getOptionByUrlParam('l')).toBe(OPTIONS.twentyFourLetter);
		expect(getOptionByUrlParam('b')).toBe(OPTIONS.showBaseline);
	});

	it('should return undefined for unknown param', () => {
		expect(getOptionByUrlParam('x')).toBeUndefined();
	});
});
