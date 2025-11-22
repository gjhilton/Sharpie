import { describe, it, expect, beforeEach } from 'vitest';
import {
	getAlphabetNameById,
	getAlphabetIdByName,
	idsToEnabledAlphabets,
	enabledAlphabetsToIds,
	saveOptionsToLocalStorage,
	loadOptionsFromLocalStorage,
	clearOptionsFromLocalStorage,
	parseOptionsFromUrl,
	serializeOptionsToUrl,
	buildPermalink,
	loadOptions,
} from './optionsStorage';
import {
	DEFAULT_OPTIONS,
	OPTIONS_SOURCE,
	OPTIONS_STORAGE_KEY,
} from '@constants/options.js';

// Mock localStorage
const localStorageMock = (() => {
	let store = {};
	return {
		getItem: key => store[key] || null,
		setItem: (key, value) => {
			store[key] = value;
		},
		removeItem: key => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
	};
})();

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

describe('optionsStorage', () => {
	beforeEach(() => {
		localStorageMock.clear();
		// Reset window.location.search
		Object.defineProperty(window, 'location', {
			value: {
				origin: 'https://example.com',
				pathname: '/app/',
				search: '',
			},
			writable: true,
		});
	});

	describe('getAlphabetNameById', () => {
		it('returns alphabet name for valid ID', () => {
			expect(getAlphabetNameById(1)).toBe('NBacon');
			expect(getAlphabetNameById(2)).toBe('Howard');
			expect(getAlphabetNameById(3)).toBe('Joscelyn');
			expect(getAlphabetNameById(4)).toBe('BeauChesne-Baildon');
			expect(getAlphabetNameById(5)).toBe('Hill');
		});

		it('returns null for invalid ID', () => {
			expect(getAlphabetNameById(999)).toBeNull();
			expect(getAlphabetNameById(0)).toBeNull();
		});
	});

	describe('getAlphabetIdByName', () => {
		it('returns ID for valid alphabet name', () => {
			expect(getAlphabetIdByName('NBacon')).toBe(1);
			expect(getAlphabetIdByName('Howard')).toBe(2);
			expect(getAlphabetIdByName('Joscelyn')).toBe(3);
			expect(getAlphabetIdByName('BeauChesne-Baildon')).toBe(4);
			expect(getAlphabetIdByName('Hill')).toBe(5);
		});

		it('returns null for invalid name', () => {
			expect(getAlphabetIdByName('InvalidAlphabet')).toBeNull();
		});
	});

	describe('idsToEnabledAlphabets', () => {
		it('converts ID array to enabled alphabets object', () => {
			const result = idsToEnabledAlphabets([1, 3]);
			expect(result).toEqual({
				NBacon: true,
				Howard: false,
				Joscelyn: true,
				'BeauChesne-Baildon': false,
				Hill: false,
			});
		});

		it('handles empty array', () => {
			const result = idsToEnabledAlphabets([]);
			expect(result.NBacon).toBe(false);
			expect(result.Howard).toBe(false);
		});

		it('handles all IDs', () => {
			const result = idsToEnabledAlphabets([1, 2, 3, 4, 5]);
			expect(Object.values(result).every(v => v === true)).toBe(true);
		});
	});

	describe('enabledAlphabetsToIds', () => {
		it('converts enabled alphabets object to ID array', () => {
			const enabled = {
				NBacon: true,
				Howard: false,
				Joscelyn: true,
				'BeauChesne-Baildon': false,
				Hill: true,
			};
			const result = enabledAlphabetsToIds(enabled);
			expect(result).toEqual([1, 3, 5]);
		});

		it('returns empty array when none enabled', () => {
			const enabled = {
				NBacon: false,
				Howard: false,
				Joscelyn: false,
				'BeauChesne-Baildon': false,
				Hill: false,
			};
			expect(enabledAlphabetsToIds(enabled)).toEqual([]);
		});

		it('ignores unknown alphabet names', () => {
			const enabled = {
				NBacon: true,
				Unknown: true,
			};
			expect(enabledAlphabetsToIds(enabled)).toEqual([1]);
		});
	});

	describe('localStorage functions', () => {
		const validOptions = {
			gameMode: 'minuscule',
			twentyFourLetterAlphabet: true,
			showBaseline: false,
			enabledAlphabetIds: [1, 2],
		};

		it('saves and loads options from localStorage', () => {
			saveOptionsToLocalStorage(validOptions);
			const loaded = loadOptionsFromLocalStorage();
			expect(loaded).toEqual(validOptions);
		});

		it('returns null when localStorage is empty', () => {
			expect(loadOptionsFromLocalStorage()).toBeNull();
		});

		it('returns null for invalid JSON', () => {
			localStorage.setItem(OPTIONS_STORAGE_KEY, 'invalid json');
			expect(loadOptionsFromLocalStorage()).toBeNull();
		});

		it('returns null for invalid options structure', () => {
			localStorage.setItem(
				OPTIONS_STORAGE_KEY,
				JSON.stringify({ gameMode: 123 })
			);
			expect(loadOptionsFromLocalStorage()).toBeNull();
		});

		it('clears options from localStorage', () => {
			saveOptionsToLocalStorage(validOptions);
			expect(loadOptionsFromLocalStorage()).not.toBeNull();
			clearOptionsFromLocalStorage();
			expect(loadOptionsFromLocalStorage()).toBeNull();
		});
	});

	describe('parseOptionsFromUrl', () => {
		it('returns null for empty search string', () => {
			expect(parseOptionsFromUrl('')).toBeNull();
			expect(parseOptionsFromUrl(null)).toBeNull();
		});

		it('returns null when no relevant params', () => {
			expect(parseOptionsFromUrl('?unrelated=value')).toBeNull();
		});

		it('parses game mode', () => {
			expect(parseOptionsFromUrl('?mode=m').gameMode).toBe('minuscule');
			expect(parseOptionsFromUrl('?mode=M').gameMode).toBe('majuscule');
			expect(parseOptionsFromUrl('?mode=a').gameMode).toBe('all');
		});

		it('parses 24-letter alphabet', () => {
			expect(parseOptionsFromUrl('?24=1').twentyFourLetterAlphabet).toBe(
				true
			);
			expect(parseOptionsFromUrl('?24=0').twentyFourLetterAlphabet).toBe(
				false
			);
		});

		it('parses baseline', () => {
			expect(parseOptionsFromUrl('?base=0').showBaseline).toBe(false);
			expect(parseOptionsFromUrl('?base=1').showBaseline).toBe(true);
		});

		it('parses alphabet IDs', () => {
			expect(
				parseOptionsFromUrl('?alph=1,3,5').enabledAlphabetIds
			).toEqual([1, 3, 5]);
		});

		it('filters invalid alphabet IDs', () => {
			expect(
				parseOptionsFromUrl('?alph=1,999,3').enabledAlphabetIds
			).toEqual([1, 3]);
		});

		it('parses combined params', () => {
			const result = parseOptionsFromUrl('?mode=M&24=1&base=0&alph=2,4');
			expect(result).toEqual({
				gameMode: 'majuscule',
				twentyFourLetterAlphabet: true,
				showBaseline: false,
				enabledAlphabetIds: [2, 4],
			});
		});

		it('uses defaults for missing params', () => {
			const result = parseOptionsFromUrl('?mode=m');
			expect(result.showBaseline).toBe(DEFAULT_OPTIONS.showBaseline);
			expect(result.twentyFourLetterAlphabet).toBe(
				DEFAULT_OPTIONS.twentyFourLetterAlphabet
			);
		});
	});

	describe('serializeOptionsToUrl', () => {
		it('returns empty string for default options', () => {
			expect(serializeOptionsToUrl(DEFAULT_OPTIONS)).toBe('');
		});

		it('includes mode when not default', () => {
			const options = { ...DEFAULT_OPTIONS, gameMode: 'minuscule' };
			expect(serializeOptionsToUrl(options)).toContain('mode=m');
		});

		it('includes 24 when true', () => {
			const options = {
				...DEFAULT_OPTIONS,
				twentyFourLetterAlphabet: true,
			};
			expect(serializeOptionsToUrl(options)).toContain('24=1');
		});

		it('includes base=0 when false', () => {
			const options = { ...DEFAULT_OPTIONS, showBaseline: false };
			expect(serializeOptionsToUrl(options)).toContain('base=0');
		});

		it('includes alph when different from default', () => {
			const options = { ...DEFAULT_OPTIONS, enabledAlphabetIds: [1, 2] };
			const result = serializeOptionsToUrl(options);
			// URLSearchParams encodes commas as %2C
			expect(result).toMatch(/alph=1(%2C|,)2/);
		});

		it('serializes all non-default options', () => {
			const options = {
				gameMode: 'majuscule',
				twentyFourLetterAlphabet: true,
				showBaseline: false,
				enabledAlphabetIds: [3],
			};
			const result = serializeOptionsToUrl(options);
			expect(result).toMatch(/mode=M/);
			expect(result).toMatch(/24=1/);
			expect(result).toMatch(/base=0/);
			expect(result).toMatch(/alph=3/);
		});
	});

	describe('buildPermalink', () => {
		it('builds full URL with query string', () => {
			const options = { ...DEFAULT_OPTIONS, gameMode: 'minuscule' };
			const result = buildPermalink(options);
			expect(result).toBe('https://example.com/app/?mode=m');
		});

		it('returns base URL for default options', () => {
			const result = buildPermalink(DEFAULT_OPTIONS);
			expect(result).toBe('https://example.com/app/');
		});
	});

	describe('loadOptions', () => {
		it('returns defaults when no URL or localStorage', () => {
			const { options, source } = loadOptions();
			expect(source).toBe(OPTIONS_SOURCE.DEFAULTS);
			expect(options).toEqual(DEFAULT_OPTIONS);
		});

		it('loads from localStorage when available', () => {
			const stored = { ...DEFAULT_OPTIONS, gameMode: 'minuscule' };
			saveOptionsToLocalStorage(stored);

			const { options, source } = loadOptions();
			expect(source).toBe(OPTIONS_SOURCE.LOCAL_STORAGE);
			expect(options.gameMode).toBe('minuscule');
		});

		it('prioritizes URL over localStorage', () => {
			const stored = { ...DEFAULT_OPTIONS, gameMode: 'minuscule' };
			saveOptionsToLocalStorage(stored);

			window.location.search = '?mode=M';
			const { options, source } = loadOptions();
			expect(source).toBe(OPTIONS_SOURCE.QUERY_STRING);
			expect(options.gameMode).toBe('majuscule');
		});

		it('saves URL options to localStorage', () => {
			window.location.search = '?mode=M';
			loadOptions();

			const stored = loadOptionsFromLocalStorage();
			expect(stored.gameMode).toBe('majuscule');
		});
	});
});
