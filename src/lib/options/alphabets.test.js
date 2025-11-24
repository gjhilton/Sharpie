import { describe, it, expect } from 'vitest';
import {
	getAlphabetById,
	getAlphabetKeyById,
	getAlphabetIdByKey,
	getAllAlphabetIds,
	getDefaultEnabledIds,
	validateAlphabetIds,
	keysToIds,
	idsToKeys,
} from './alphabets.js';

describe('getAlphabetById', () => {
	it('should find alphabet by ID', () => {
		const result = getAlphabetById('001');
		expect(result).toBeDefined();
		expect(result[0]).toBe('McKerrow');
	});

	it('should return undefined for unknown ID', () => {
		expect(getAlphabetById('999')).toBeUndefined();
	});
});

describe('getAlphabetKeyById', () => {
	it('should return alphabet key for valid ID', () => {
		expect(getAlphabetKeyById('001')).toBe('McKerrow');
		expect(getAlphabetKeyById('002')).toBe('PCAttorney');
	});

	it('should return null for unknown ID', () => {
		expect(getAlphabetKeyById('999')).toBeNull();
	});
});

describe('getAlphabetIdByKey', () => {
	it('should return ID for valid key', () => {
		expect(getAlphabetIdByKey('McKerrow')).toBe('001');
		expect(getAlphabetIdByKey('PCAttorney')).toBe('002');
	});

	it('should return null for unknown key', () => {
		expect(getAlphabetIdByKey('Unknown')).toBeNull();
	});
});

describe('getAllAlphabetIds', () => {
	it('should return all alphabet IDs', () => {
		const ids = getAllAlphabetIds();
		expect(ids).toContain('001');
		expect(ids).toContain('002');
		expect(ids.length).toBeGreaterThan(0);
	});
});

describe('getDefaultEnabledIds', () => {
	it('should return default enabled IDs', () => {
		const ids = getDefaultEnabledIds();
		expect(ids.length).toBeGreaterThan(0);
		// All alphabets are default enabled in test data
		expect(ids).toContain('001');
	});
});

describe('validateAlphabetIds', () => {
	it('should return only valid IDs', () => {
		const result = validateAlphabetIds(['001', '999', '002']);
		expect(result).toContain('001');
		expect(result).toContain('002');
		expect(result).not.toContain('999');
	});

	it('should return empty array for all invalid IDs', () => {
		const result = validateAlphabetIds(['999', '888']);
		expect(result).toEqual([]);
	});
});

describe('keysToIds', () => {
	it('should convert keys to IDs', () => {
		const result = keysToIds(['McKerrow', 'PCAttorney']);
		expect(result).toEqual(['001', '002']);
	});

	it('should filter out invalid keys', () => {
		const result = keysToIds(['McKerrow', 'Unknown']);
		expect(result).toEqual(['001']);
	});
});

describe('idsToKeys', () => {
	it('should convert IDs to keys', () => {
		const result = idsToKeys(['001', '002']);
		expect(result).toEqual(['McKerrow', 'PCAttorney']);
	});

	it('should filter out invalid IDs', () => {
		const result = idsToKeys(['001', '999']);
		expect(result).toEqual(['McKerrow']);
	});
});
