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

	it('should define hands option', () => {
		expect(OPTIONS.hands).toBeDefined();
		expect(OPTIONS.hands.key).toBe('enabledHands');
		expect(OPTIONS.hands.type).toBe('handSet');
		expect(OPTIONS.hands.urlParam).toBe('a');
	});

	it('should define numLetters option', () => {
		expect(OPTIONS.numLetters).toBeDefined();
		expect(OPTIONS.numLetters.key).toBe('numLetters');
		expect(OPTIONS.numLetters.type).toBe('boolean');
		expect(OPTIONS.numLetters.urlParam).toBe('l');
		expect(OPTIONS.numLetters.default).toBe(true);
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
		expect(getOptionByKey('enabledHands')).toBe(OPTIONS.hands);
		expect(getOptionByKey('numLetters')).toBe(OPTIONS.numLetters);
		expect(getOptionByKey('showBaseline')).toBe(OPTIONS.showBaseline);
	});

	it('should return undefined for unknown key', () => {
		expect(getOptionByKey('unknown')).toBeUndefined();
	});
});

describe('getOptionByUrlParam', () => {
	it('should find option by URL param', () => {
		expect(getOptionByUrlParam('m')).toBe(OPTIONS.mode);
		expect(getOptionByUrlParam('a')).toBe(OPTIONS.hands);
		expect(getOptionByUrlParam('l')).toBe(OPTIONS.numLetters);
		expect(getOptionByUrlParam('b')).toBe(OPTIONS.showBaseline);
	});

	it('should return undefined for unknown param', () => {
		expect(getOptionByUrlParam('x')).toBeUndefined();
	});
});
