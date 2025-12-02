import { describe, it, expect } from 'vitest';
import {
	getHandById,
	getHandKeyById,
	getHandIdByKey,
	getAllHandIds,
	getDefaultEnabledIds,
	validateHandIds,
	keysToIds,
	idsToKeys,
} from './hands.js';

describe('getHandById', () => {
	it('should find hand by ID', () => {
		const result = getHandById('001');
		expect(result).toBeDefined();
		expect(result[0]).toBe('McKerrow');
	});

	it('should return undefined for unknown ID', () => {
		expect(getHandById('999')).toBeUndefined();
	});
});

describe('getHandKeyById', () => {
	it('should return hand key for valid ID', () => {
		expect(getHandKeyById('001')).toBe('McKerrow');
		expect(getHandKeyById('002')).toBe('PCAttorney');
	});

	it('should return null for unknown ID', () => {
		expect(getHandKeyById('999')).toBeNull();
	});
});

describe('getHandIdByKey', () => {
	it('should return ID for valid key', () => {
		expect(getHandIdByKey('McKerrow')).toBe('001');
		expect(getHandIdByKey('PCAttorney')).toBe('002');
	});

	it('should return null for unknown key', () => {
		expect(getHandIdByKey('Unknown')).toBeNull();
	});
});

describe('getAllHandIds', () => {
	it('should return all hand IDs', () => {
		const ids = getAllHandIds();
		expect(ids).toContain('001');
		expect(ids).toContain('002');
		expect(ids.length).toBeGreaterThan(0);
	});
});

describe('getDefaultEnabledIds', () => {
	it('should return default enabled IDs', () => {
		const ids = getDefaultEnabledIds();
		expect(ids.length).toBeGreaterThan(0);
		// All hands are default enabled in test data
		expect(ids).toContain('001');
	});
});

describe('validateHandIds', () => {
	it('should return only valid IDs', () => {
		const result = validateHandIds(['001', '999', '002']);
		expect(result).toContain('001');
		expect(result).toContain('002');
		expect(result).not.toContain('999');
	});

	it('should return empty array for all invalid IDs', () => {
		const result = validateHandIds(['999', '888']);
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
