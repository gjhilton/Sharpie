/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest';
import {
	extractCharacter,
	categorizeCharacter,
	getAlphabetName,
	getAssetFolderName,
	escapeSingleQuotes,
	escapeDoubleQuotes,
	buildImageEntry,
	buildSourceEntry,
	generateSources,
	generateCharacterSets,
	toOutputImage,
	groupByCategory,
	sortByCharacter,
	formatSourceEntry,
	formatImageEntry,
	formatCharacterSetEntry,
	formatDBContent,
} from './update-db.js';

// =============================================================================
// String Utilities
// =============================================================================

describe('escapeSingleQuotes', () => {
	it('escapes single quotes', () => {
		expect(escapeSingleQuotes("McKerrow's Note")).toBe("McKerrow\\'s Note");
	});

	it('escapes multiple single quotes', () => {
		expect(escapeSingleQuotes("It's a 'test'")).toBe("It\\'s a \\'test\\'");
	});

	it('returns same string if no quotes', () => {
		expect(escapeSingleQuotes('Hello World')).toBe('Hello World');
	});

	it('handles empty string', () => {
		expect(escapeSingleQuotes('')).toBe('');
	});

	it('handles null', () => {
		expect(escapeSingleQuotes(null)).toBe('');
	});

	it('handles undefined', () => {
		expect(escapeSingleQuotes(undefined)).toBe('');
	});

	it('does not affect double quotes', () => {
		expect(escapeSingleQuotes('Say "hello"')).toBe('Say "hello"');
	});
});

describe('escapeDoubleQuotes', () => {
	it('escapes double quotes', () => {
		expect(escapeDoubleQuotes('Say "hello"')).toBe('Say \\"hello\\"');
	});

	it('escapes multiple double quotes', () => {
		expect(escapeDoubleQuotes('"A" and "B"')).toBe('\\"A\\" and \\"B\\"');
	});

	it('returns same string if no quotes', () => {
		expect(escapeDoubleQuotes('Hello World')).toBe('Hello World');
	});

	it('handles empty string', () => {
		expect(escapeDoubleQuotes('')).toBe('');
	});

	it('handles null', () => {
		expect(escapeDoubleQuotes(null)).toBe('');
	});

	it('handles undefined', () => {
		expect(escapeDoubleQuotes(undefined)).toBe('');
	});

	it('does not affect single quotes', () => {
		expect(escapeDoubleQuotes("It's fine")).toBe("It's fine");
	});
});

// =============================================================================
// Character Extraction
// =============================================================================

describe('extractCharacter', () => {
	it('extracts first character from simple filename', () => {
		expect(extractCharacter('a.png')).toBe('a');
		expect(extractCharacter('Z.png')).toBe('Z');
	});

	it('extracts first character from complex filename', () => {
		expect(extractCharacter('a10.png')).toBe('a');
		expect(extractCharacter('hello-world.png')).toBe('h');
	});

	it('handles filenames with numbers', () => {
		expect(extractCharacter('1test.png')).toBe('1');
	});

	it('handles special characters', () => {
		expect(extractCharacter('$.png')).toBe('$');
	});

	it('is case sensitive', () => {
		expect(extractCharacter('a.png')).not.toBe('A');
	});
});

describe('categorizeCharacter', () => {
	it('categorizes A-Z as MAJUSCULES', () => {
		expect(categorizeCharacter('A')).toBe('MAJUSCULES');
		expect(categorizeCharacter('M')).toBe('MAJUSCULES');
		expect(categorizeCharacter('Z')).toBe('MAJUSCULES');
	});

	it('categorizes a-z as minuscules', () => {
		expect(categorizeCharacter('a')).toBe('minuscules');
		expect(categorizeCharacter('m')).toBe('minuscules');
		expect(categorizeCharacter('z')).toBe('minuscules');
	});

	it('categorizes numbers as Others', () => {
		expect(categorizeCharacter('0')).toBe('Others');
		expect(categorizeCharacter('9')).toBe('Others');
	});

	it('categorizes special characters as Others', () => {
		expect(categorizeCharacter('$')).toBe('Others');
		expect(categorizeCharacter('&')).toBe('Others');
	});
});

// =============================================================================
// Path Utilities
// =============================================================================

describe('getAlphabetName', () => {
	it('extracts parent directory name', () => {
		expect(getAlphabetName('/a/b/Joscelyn/joscelyn-assets')).toBe(
			'Joscelyn'
		);
	});

	it('handles BeauChesne-Baildon path', () => {
		expect(getAlphabetName('/src/BeauChesne-Baildon/BCB-assets')).toBe(
			'BeauChesne-Baildon'
		);
	});
});

describe('getAssetFolderName', () => {
	it('extracts folder name from path', () => {
		expect(getAssetFolderName('/a/b/c/joscelyn-assets')).toBe(
			'joscelyn-assets'
		);
	});
});

// =============================================================================
// Image Entry Building
// =============================================================================

describe('buildImageEntry', () => {
	it('builds entry for minuscule', () => {
		const entry = buildImageEntry('a.png', 'Joscelyn', 'jos-assets', {});
		expect(entry).toEqual({
			img: 'a.png',
			character: 'a',
			alphabet: 'Joscelyn',
			category: 'minuscules',
			relativePath: 'Joscelyn/jos-assets/a.png',
		});
	});

	it('builds entry for majuscule with auto-note', () => {
		const entry = buildImageEntry('A.png', 'Joscelyn', 'jos-assets', {});
		expect(entry.note).toBe('First letter of word.');
	});

	it('uses metadata note when provided', () => {
		const metadata = { 'a.png': { note: 'Custom note' } };
		const entry = buildImageEntry(
			'a.png',
			'Joscelyn',
			'jos-assets',
			metadata
		);
		expect(entry.note).toBe('Custom note');
	});

	it('sanitizes filename', () => {
		const entry = buildImageEntry("a's.png", 'Test', 'assets', {});
		expect(entry.img).toBe('as.png');
	});
});

// =============================================================================
// Source Generation
// =============================================================================

describe('buildSourceEntry', () => {
	it('uses metadata when available', () => {
		const metadata = {
			Joscelyn: {
				title: 'Joscelyn Font',
				sourceUri: 'https://example.com',
				date: '2019',
				difficulty: 'easy',
			},
		};
		const entry = buildSourceEntry('Joscelyn', metadata);
		expect(entry).toEqual({
			title: 'Joscelyn Font',
			sourceUri: 'https://example.com',
			date: '2019',
			difficulty: 'easy',
		});
	});

	it('generates placeholder when no metadata', () => {
		const entry = buildSourceEntry('NewSource', {});
		expect(entry).toEqual({
			title: 'NewSource source',
			sourceUri: 'https://example.com/newsource',
			date: 'unknown',
			difficulty: 'medium',
		});
	});
});

describe('generateSources', () => {
	const mockMetadata = {
		Joscelyn: {
			title: 'Joscelyn Font',
			sourceUri: 'https://example.com',
			date: '2019',
			difficulty: 'easy',
		},
	};

	it('generates sources from entries', () => {
		const entries = [
			{
				alphabetName: 'Joscelyn',
				images: [{ alphabet: 'Joscelyn', character: 'a' }],
			},
		];
		const result = generateSources(entries, mockMetadata);
		expect(result).toHaveProperty('Joscelyn');
		expect(result.Joscelyn.title).toBe('Joscelyn Font');
	});

	it('warns for unknown sources', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const entries = [
			{
				alphabetName: 'Unknown',
				images: [{ alphabet: 'Unknown', character: 'x' }],
			},
		];
		generateSources(entries, {});
		expect(warnSpy).toHaveBeenCalled();
		warnSpy.mockRestore();
	});

	it('handles empty entries', () => {
		expect(generateSources([], {})).toEqual({});
	});

	it('deduplicates sources', () => {
		const entries = [
			{ images: [{ alphabet: 'A' }] },
			{ images: [{ alphabet: 'A' }] },
		];
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const result = generateSources(entries, {});
		expect(Object.keys(result)).toHaveLength(1);
		warnSpy.mockRestore();
	});
});

// =============================================================================
// Character Set Generation
// =============================================================================

describe('toOutputImage', () => {
	it('converts internal format to output format', () => {
		const img = {
			relativePath: 'A/B/c.png',
			character: 'c',
			alphabet: 'A',
			note: 'Test note',
		};
		expect(toOutputImage(img)).toEqual({
			img: 'A/B/c.png',
			character: 'c',
			source: 'A',
			note: 'Test note',
		});
	});

	it('omits note when not present', () => {
		const img = { relativePath: 'a.png', character: 'a', alphabet: 'X' };
		const output = toOutputImage(img);
		expect(output).not.toHaveProperty('note');
	});
});

describe('groupByCategory', () => {
	it('groups images by category', () => {
		const entries = [
			{
				images: [
					{
						relativePath: 'a.png',
						character: 'a',
						alphabet: 'X',
						category: 'minuscules',
					},
					{
						relativePath: 'A.png',
						character: 'A',
						alphabet: 'X',
						category: 'MAJUSCULES',
					},
				],
			},
		];
		const grouped = groupByCategory(entries);
		expect(grouped['minuscules']).toHaveLength(1);
		expect(grouped['MAJUSCULES']).toHaveLength(1);
		expect(grouped['Others']).toHaveLength(0);
	});
});

describe('sortByCharacter', () => {
	it('sorts alphabetically', () => {
		const images = [
			{ character: 'z' },
			{ character: 'a' },
			{ character: 'm' },
		];
		const sorted = sortByCharacter(images);
		expect(sorted[0].character).toBe('a');
		expect(sorted[1].character).toBe('m');
		expect(sorted[2].character).toBe('z');
	});

	it('does not mutate original', () => {
		const images = [{ character: 'b' }, { character: 'a' }];
		sortByCharacter(images);
		expect(images[0].character).toBe('b');
	});
});

describe('generateCharacterSets', () => {
	it('creates three sets with correct titles', () => {
		const result = generateCharacterSets([]);
		expect(result).toHaveLength(3);
		expect(result[0].title).toBe('minuscules');
		expect(result[1].title).toBe('MAJUSCULES');
		expect(result[2].title).toBe('Others');
	});

	it('sets enabled flags correctly', () => {
		const result = generateCharacterSets([]);
		expect(result[0].enabled).toBe(true);
		expect(result[1].enabled).toBe(true);
		expect(result[2].enabled).toBe(false);
	});

	it('sorts images within each category', () => {
		const entries = [
			{
				images: [
					{
						relativePath: 'z.png',
						character: 'z',
						alphabet: 'X',
						category: 'minuscules',
					},
					{
						relativePath: 'a.png',
						character: 'a',
						alphabet: 'X',
						category: 'minuscules',
					},
				],
			},
		];
		const result = generateCharacterSets(entries);
		expect(result[0].images[0].character).toBe('a');
		expect(result[0].images[1].character).toBe('z');
	});
});

// =============================================================================
// DB Formatting
// =============================================================================

describe('formatSourceEntry', () => {
	it('formats with proper indentation', () => {
		const result = formatSourceEntry('Test', {
			title: 'Test Title',
			sourceUri: 'https://example.com',
			date: '2020',
			difficulty: 'easy',
		});
		expect(result).toContain('\t\t"Test": {');
		expect(result).toContain("title: 'Test Title'");
	});

	it('escapes single quotes in values', () => {
		const result = formatSourceEntry('Test', {
			title: "Author's Book",
			sourceUri: 'https://example.com',
			date: '2020',
			difficulty: 'easy',
		});
		expect(result).toContain("title: 'Author\\'s Book'");
	});
});

describe('formatImageEntry', () => {
	it('formats with proper structure', () => {
		const result = formatImageEntry({
			img: 'a.png',
			character: 'a',
			source: 'Test',
		});
		expect(result).toContain('img: "a.png"');
		expect(result).toContain('character: "a"');
		expect(result).toContain('source: "Test"');
	});

	it('includes note when present', () => {
		const result = formatImageEntry({
			img: 'A.png',
			character: 'A',
			source: 'Test',
			note: 'First letter',
		});
		expect(result).toContain('note: "First letter"');
	});

	it('omits note when absent', () => {
		const result = formatImageEntry({
			img: 'a.png',
			character: 'a',
			source: 'Test',
		});
		expect(result).not.toContain('note:');
	});

	it('escapes double quotes', () => {
		const result = formatImageEntry({
			img: 'a.png',
			character: 'a',
			source: 'Test',
			note: 'Called "secretary"',
		});
		expect(result).toContain('note: "Called \\"secretary\\""');
	});
});

describe('formatCharacterSetEntry', () => {
	it('formats with title and enabled', () => {
		const result = formatCharacterSetEntry({
			title: 'minuscules',
			enabled: true,
			images: [],
		});
		expect(result).toContain('title: "minuscules"');
		expect(result).toContain('enabled: true');
	});

	it('formats images array', () => {
		const result = formatCharacterSetEntry({
			title: 'test',
			enabled: true,
			images: [{ img: 'a.png', character: 'a', source: 'X' }],
		});
		expect(result).toContain('graphs: [');
		expect(result).toContain('img: "a.png"');
	});
});

describe('formatDBContent', () => {
	it('includes file header', () => {
		const result = formatDBContent({}, []);
		expect(result).toMatch(/^\/\/ This is a generated file/);
		expect(result).toContain('npm run update-db');
	});

	it('exports DB constant', () => {
		const result = formatDBContent({}, []);
		expect(result).toContain('export const DB = {');
	});

	it('includes sources and graphSets', () => {
		const result = formatDBContent({}, []);
		expect(result).toContain('sources: {');
		expect(result).toContain('graphSets: [');
	});

	it('ends with newline', () => {
		const result = formatDBContent({}, []);
		expect(result.endsWith('\n')).toBe(true);
	});
});
