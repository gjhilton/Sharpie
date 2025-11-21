import { describe, it, expect, vi } from 'vitest';
import {
	extractCharacter,
	categorizeCharacter,
	getSourceName,
	getAssetFolderName,
	generateSourcesObject,
	generateGraphSets,
	formatSourceEntry,
	formatGraphEntry,
	formatGraphSetEntry,
	formatDBContent,
} from './update-db.js';

describe('extractCharacter', () => {
	it('should extract first character from simple filename', () => {
		expect(extractCharacter('a.png')).toBe('a');
		expect(extractCharacter('Z.png')).toBe('Z');
	});

	it('should extract first character from complex filename', () => {
		expect(extractCharacter('a10.png')).toBe('a');
		expect(extractCharacter('A$.png')).toBe('A');
		expect(extractCharacter('hello-world.png')).toBe('h');
	});

	it('should handle filenames with numbers', () => {
		expect(extractCharacter('1test.png')).toBe('1');
		expect(extractCharacter('9.png')).toBe('9');
	});

	it('should handle filenames with special characters', () => {
		expect(extractCharacter('$.png')).toBe('$');
		expect(extractCharacter('#tag.png')).toBe('#');
	});

	it('should return empty string for empty filename', () => {
		expect(extractCharacter('.png')).toBe('');
	});

	it('should be case sensitive', () => {
		expect(extractCharacter('a.png')).not.toBe('A');
		expect(extractCharacter('Z.png')).not.toBe('z');
	});
});

describe('categorizeCharacter', () => {
	describe('uppercase letters (MAJUSCULES)', () => {
		it('should categorize A-Z as MAJUSCULES', () => {
			expect(categorizeCharacter('A')).toBe('MAJUSCULES');
			expect(categorizeCharacter('M')).toBe('MAJUSCULES');
			expect(categorizeCharacter('Z')).toBe('MAJUSCULES');
		});
	});

	describe('lowercase letters (minuscules)', () => {
		it('should categorize a-z as minuscules', () => {
			expect(categorizeCharacter('a')).toBe('minuscules');
			expect(categorizeCharacter('m')).toBe('minuscules');
			expect(categorizeCharacter('z')).toBe('minuscules');
		});
	});

	describe('other characters (Others)', () => {
		it('should categorize numbers as Others', () => {
			expect(categorizeCharacter('0')).toBe('Others');
			expect(categorizeCharacter('5')).toBe('Others');
			expect(categorizeCharacter('9')).toBe('Others');
		});

		it('should categorize special characters as Others', () => {
			expect(categorizeCharacter('$')).toBe('Others');
			expect(categorizeCharacter('#')).toBe('Others');
			expect(categorizeCharacter('@')).toBe('Others');
			expect(categorizeCharacter('!')).toBe('Others');
		});

		it('should categorize symbols as Others', () => {
			expect(categorizeCharacter('&')).toBe('Others');
			expect(categorizeCharacter('*')).toBe('Others');
			expect(categorizeCharacter('-')).toBe('Others');
		});
	});
});

describe('getSourceName', () => {
	it('should extract parent directory name from Unix path', () => {
		const path = '/Users/test/Graphs/Joscelyn/joscelyn-min-assets';
		expect(getSourceName(path)).toBe('Joscelyn');
	});

	it('should extract parent directory name from nested path', () => {
		const path = '/a/b/c/ParentDir/ChildDir';
		expect(getSourceName(path)).toBe('ParentDir');
	});

	it('should handle BeauChesne-Baildon path', () => {
		const path = '/src/artwork/hands/BeauChesne-Baildon/BCB-AB-assets';
		expect(getSourceName(path)).toBe('BeauChesne-Baildon');
	});

	it('should handle paths with special characters', () => {
		const path = '/src/artwork/hands/Source-With-Dashes/assets-folder';
		expect(getSourceName(path)).toBe('Source-With-Dashes');
	});
});

describe('getAssetFolderName', () => {
	it('should extract folder name from path', () => {
		const path = '/Users/test/Graphs/Joscelyn/joscelyn-min-assets';
		expect(getAssetFolderName(path)).toBe('joscelyn-min-assets');
	});

	it('should handle BCB-AB-assets', () => {
		const path = '/src/artwork/hands/BeauChesne-Baildon/BCB-AB-assets';
		expect(getAssetFolderName(path)).toBe('BCB-AB-assets');
	});

	it('should handle simple folder names', () => {
		const path = '/a/b/c/folder';
		expect(getAssetFolderName(path)).toBe('folder');
	});
});

describe('generateSourcesObject', () => {
	const mockSourceMetadata = {
		Joscelyn: {
			title: 'Joscelyn typeface, drawn by Peter Baker (2019)',
			sourceUri: 'https://github.com/psb1558/Joscelyn-font/releases',
		},
		'BeauChesne-Baildon': {
			title: 'BeauChesne-Baildon writing book',
			sourceUri: 'https://example.com/beaucheche-baildon',
		},
		Hill: {
			title: 'Hill source',
			sourceUri: 'https://example.com/hill',
		},
	};

	it('should generate sources from single Joscelyn entry', () => {
		const entries = [
			{
				sourceName: 'Joscelyn',
				assetFolderName: 'joscelyn-min-assets',
				graphEntries: [
					{
						source: 'Joscelyn',
						character: 'a',
						category: 'minuscules',
					},
				],
			},
		];

		const result = generateSourcesObject(entries, mockSourceMetadata);

		expect(result).toHaveProperty('Joscelyn');
		expect(result.Joscelyn).toEqual({
			title: 'Joscelyn typeface, drawn by Peter Baker (2019)',
			sourceUri: 'https://github.com/psb1558/Joscelyn-font/releases',
		});
	});

	it('should generate sources from BeauChesne-Baildon entry', () => {
		const entries = [
			{
				sourceName: 'BeauChesne-Baildon',
				assetFolderName: 'BCB-AB-assets',
				graphEntries: [
					{
						source: 'BeauChesne-Baildon',
						character: 'A',
						category: 'MAJUSCULES',
					},
				],
			},
		];

		const result = generateSourcesObject(entries, mockSourceMetadata);

		expect(result).toHaveProperty('BeauChesne-Baildon');
		expect(result['BeauChesne-Baildon']).toEqual({
			title: 'BeauChesne-Baildon writing book',
			sourceUri: 'https://example.com/beaucheche-baildon',
		});
	});

	it('should generate placeholder for unknown sources', () => {
		const entries = [
			{
				sourceName: 'NewSource',
				assetFolderName: 'new-assets',
				graphEntries: [
					{
						source: 'NewSource',
						character: 'x',
						category: 'minuscules',
					},
				],
			},
		];

		// Mock console.warn to check if warning is shown
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = generateSourcesObject(entries, mockSourceMetadata);

		expect(result).toHaveProperty('NewSource');
		expect(result.NewSource).toEqual({
			title: 'NewSource source',
			sourceUri: 'https://example.com/newsource',
			date: 'unknown',
			difficulty: 'medium',
		});
		expect(warnSpy).toHaveBeenCalledWith(
			'⚠️  Source "NewSource" not found in alphabets.json, using placeholder'
		);

		warnSpy.mockRestore();
	});

	it('should handle multiple sources', () => {
		const entries = [
			{
				sourceName: 'Joscelyn',
				assetFolderName: 'joscelyn-min-assets',
				graphEntries: [
					{
						source: 'Joscelyn',
						character: 'a',
						category: 'minuscules',
					},
				],
			},
			{
				sourceName: 'BeauChesne-Baildon',
				assetFolderName: 'BCB-AB-assets',
				graphEntries: [
					{
						source: 'BeauChesne-Baildon',
						character: 'A',
						category: 'MAJUSCULES',
					},
				],
			},
		];

		const result = generateSourcesObject(entries, mockSourceMetadata);

		expect(Object.keys(result)).toHaveLength(2);
		expect(result).toHaveProperty('Joscelyn');
		expect(result).toHaveProperty('BeauChesne-Baildon');
	});

	it('should deduplicate sources from multiple entries', () => {
		const entries = [
			{
				sourceName: 'Joscelyn',
				assetFolderName: 'joscelyn-min-assets',
				graphEntries: [
					{
						source: 'Joscelyn',
						character: 'a',
						category: 'minuscules',
					},
				],
			},
			{
				sourceName: 'Joscelyn',
				assetFolderName: 'joscelyn-maj-assets',
				graphEntries: [
					{
						source: 'Joscelyn',
						character: 'A',
						category: 'MAJUSCULES',
					},
				],
			},
		];

		const result = generateSourcesObject(entries, mockSourceMetadata);

		expect(Object.keys(result)).toHaveLength(1);
		expect(result).toHaveProperty('Joscelyn');
	});

	it('should handle empty entries array', () => {
		const result = generateSourcesObject([], mockSourceMetadata);
		expect(result).toEqual({});
	});

	it('should work with empty metadata object (all placeholders)', () => {
		const entries = [
			{
				sourceName: 'TestSource',
				assetFolderName: 'test-assets',
				graphEntries: [
					{
						source: 'TestSource',
						character: 't',
						category: 'minuscules',
					},
				],
			},
		];

		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = generateSourcesObject(entries, {});

		expect(result).toHaveProperty('TestSource');
		expect(result.TestSource).toEqual({
			title: 'TestSource source',
			sourceUri: 'https://example.com/testsource',
			date: 'unknown',
			difficulty: 'medium',
		});
		expect(warnSpy).toHaveBeenCalled();

		warnSpy.mockRestore();
	});
});

describe('generateGraphSets', () => {
	it('should categorize graphs into minuscules, MAJUSCULES, and Others', () => {
		const entries = [
			{
				sourceName: 'Joscelyn',
				assetFolderName: 'joscelyn-min-assets',
				graphEntries: [
					{
						img: 'a.png',
						character: 'a',
						source: 'Joscelyn',
						category: 'minuscules',
						relativePath: 'Joscelyn/joscelyn-min-assets/a.png',
					},
					{
						img: 'A.png',
						character: 'A',
						source: 'Joscelyn',
						category: 'MAJUSCULES',
						relativePath: 'Joscelyn/joscelyn-maj-assets/A.png',
					},
					{
						img: '1.png',
						character: '1',
						source: 'Joscelyn',
						category: 'Others',
						relativePath: 'Joscelyn/joscelyn-num-assets/1.png',
					},
				],
			},
		];

		const result = generateGraphSets(entries);

		expect(result).toHaveLength(3);
		expect(result[0].title).toBe('minuscules');
		expect(result[1].title).toBe('MAJUSCULES');
		expect(result[2].title).toBe('Others');
	});

	it('should set correct enabled flags', () => {
		const entries = [
			{
				sourceName: 'Joscelyn',
				assetFolderName: 'joscelyn-min-assets',
				graphEntries: [
					{
						img: 'a.png',
						character: 'a',
						source: 'Joscelyn',
						category: 'minuscules',
						relativePath: 'Joscelyn/joscelyn-min-assets/a.png',
					},
				],
			},
		];

		const result = generateGraphSets(entries);

		expect(result[0].enabled).toBe(true); // minuscules
		expect(result[1].enabled).toBe(true); // MAJUSCULES
		expect(result[2].enabled).toBe(false); // Others
	});

	it('should sort graphs alphabetically by character within each category', () => {
		const entries = [
			{
				sourceName: 'Test',
				assetFolderName: 'test-assets',
				graphEntries: [
					{
						img: 'z.png',
						character: 'z',
						source: 'Test',
						category: 'minuscules',
						relativePath: 'Test/test-assets/z.png',
					},
					{
						img: 'a.png',
						character: 'a',
						source: 'Test',
						category: 'minuscules',
						relativePath: 'Test/test-assets/a.png',
					},
					{
						img: 'm.png',
						character: 'm',
						source: 'Test',
						category: 'minuscules',
						relativePath: 'Test/test-assets/m.png',
					},
				],
			},
		];

		const result = generateGraphSets(entries);
		const minuscules = result.find(gs => gs.title === 'minuscules');

		expect(minuscules.graphs[0].character).toBe('a');
		expect(minuscules.graphs[1].character).toBe('m');
		expect(minuscules.graphs[2].character).toBe('z');
	});

	it('should use relativePath as img field', () => {
		const entries = [
			{
				sourceName: 'Joscelyn',
				assetFolderName: 'joscelyn-min-assets',
				graphEntries: [
					{
						img: 'a.png',
						character: 'a',
						source: 'Joscelyn',
						category: 'minuscules',
						relativePath: 'Joscelyn/joscelyn-min-assets/a.png',
					},
				],
			},
		];

		const result = generateGraphSets(entries);
		const minuscules = result.find(gs => gs.title === 'minuscules');

		expect(minuscules.graphs[0].img).toBe(
			'Joscelyn/joscelyn-min-assets/a.png'
		);
	});

	it('should handle empty entries', () => {
		const result = generateGraphSets([]);

		expect(result).toHaveLength(3);
		expect(result[0].graphs).toHaveLength(0);
		expect(result[1].graphs).toHaveLength(0);
		expect(result[2].graphs).toHaveLength(0);
	});

	it('should handle multiple entries and merge them correctly', () => {
		const entries = [
			{
				sourceName: 'Joscelyn',
				assetFolderName: 'joscelyn-min-assets',
				graphEntries: [
					{
						img: 'a.png',
						character: 'a',
						source: 'Joscelyn',
						category: 'minuscules',
						relativePath: 'Joscelyn/joscelyn-min-assets/a.png',
					},
				],
			},
			{
				sourceName: 'BeauChesne-Baildon',
				assetFolderName: 'BCB-AB-assets',
				graphEntries: [
					{
						img: 'b.png',
						character: 'b',
						source: 'BeauChesne-Baildon',
						category: 'minuscules',
						relativePath: 'BeauChesne-Baildon/BCB-AB-assets/b.png',
					},
				],
			},
		];

		const result = generateGraphSets(entries);
		const minuscules = result.find(gs => gs.title === 'minuscules');

		expect(minuscules.graphs).toHaveLength(2);
		expect(minuscules.graphs[0].source).toBe('Joscelyn');
		expect(minuscules.graphs[1].source).toBe('BeauChesne-Baildon');
	});

	it('should include note field in graph when present', () => {
		const entries = [
			{
				sourceName: 'Joscelyn',
				assetFolderName: 'joscelyn-maj-assets',
				graphEntries: [
					{
						img: 'A.png',
						character: 'A',
						source: 'Joscelyn',
						category: 'MAJUSCULES',
						relativePath: 'Joscelyn/joscelyn-maj-assets/A.png',
						note: 'First letter of word.',
					},
				],
			},
		];

		const result = generateGraphSets(entries);
		const majuscules = result.find(gs => gs.title === 'MAJUSCULES');

		expect(majuscules.graphs[0].note).toBe('First letter of word.');
	});

	it('should not include note field in graph when absent', () => {
		const entries = [
			{
				sourceName: 'Joscelyn',
				assetFolderName: 'joscelyn-min-assets',
				graphEntries: [
					{
						img: 'a.png',
						character: 'a',
						source: 'Joscelyn',
						category: 'minuscules',
						relativePath: 'Joscelyn/joscelyn-min-assets/a.png',
					},
				],
			},
		];

		const result = generateGraphSets(entries);
		const minuscules = result.find(gs => gs.title === 'minuscules');

		expect(minuscules.graphs[0]).not.toHaveProperty('note');
	});

	it('should preserve custom notes from metadata', () => {
		const entries = [
			{
				sourceName: 'Hill',
				assetFolderName: 'Hill-assets',
				graphEntries: [
					{
						img: 'c023.png',
						character: 'c',
						source: 'Hill',
						category: 'minuscules',
						relativePath: 'Hill/Hill-assets/c023.png',
						note: 'Round c with sharp turn.',
					},
				],
			},
		];

		const result = generateGraphSets(entries);
		const minuscules = result.find(gs => gs.title === 'minuscules');

		expect(minuscules.graphs[0].note).toBe('Round c with sharp turn.');
	});
});

describe('formatSourceEntry', () => {
	it('should format a source entry with proper indentation', () => {
		const result = formatSourceEntry('Joscelyn', {
			title: 'Joscelyn typeface, drawn by Peter Baker (2019)',
			sourceUri: 'https://github.com/psb1558/Joscelyn-font/releases',
		});

		expect(result).toContain('\t\t"Joscelyn": {');
		expect(result).toContain(
			"\t\t\ttitle: 'Joscelyn typeface, drawn by Peter Baker (2019)',"
		);
		expect(result).toContain(
			"\t\t\tsourceUri: 'https://github.com/psb1558/Joscelyn-font/releases'"
		);
		expect(result).toContain('\t\t}');
	});

	it('should handle source names with hyphens', () => {
		const result = formatSourceEntry('BeauChesne-Baildon', {
			title: 'BeauChesne-Baildon writing book',
			sourceUri: 'https://example.com/beaucheche-baildon',
		});

		expect(result).toContain('\t\t"BeauChesne-Baildon": {');
	});
});

describe('formatGraphEntry', () => {
	it('should format a graph entry with proper indentation', () => {
		const graph = {
			img: 'Joscelyn/joscelyn-min-assets/a.png',
			character: 'a',
			source: 'Joscelyn',
		};

		const result = formatGraphEntry(graph);

		expect(result).toContain('\t\t\t\t{');
		expect(result).toContain(
			'\t\t\t\t\timg: "Joscelyn/joscelyn-min-assets/a.png",'
		);
		expect(result).toContain('\t\t\t\t\tcharacter: "a",');
		expect(result).toContain('\t\t\t\t\tsource: "Joscelyn"');
		expect(result).toContain('\t\t\t\t}');
	});

	it('should use double quotes for strings', () => {
		const graph = {
			img: 'test.png',
			character: 'x',
			source: 'Test',
		};

		const result = formatGraphEntry(graph);

		expect(result).toContain('"test.png"');
		expect(result).toContain('"x"');
		expect(result).toContain('"Test"');
	});

	it('should include note field when present', () => {
		const graph = {
			img: 'A.png',
			character: 'A',
			source: 'Joscelyn',
			note: 'First letter of word.',
		};

		const result = formatGraphEntry(graph);

		expect(result).toContain('\t\t\t\t\tnote: "First letter of word."');
	});

	it('should not include note field when absent', () => {
		const graph = {
			img: 'a.png',
			character: 'a',
			source: 'Joscelyn',
		};

		const result = formatGraphEntry(graph);

		expect(result).not.toContain('note:');
	});
});

describe('formatGraphSetEntry', () => {
	it('should format a graphSet with graphs', () => {
		const graphSet = {
			title: 'minuscules',
			enabled: true,
			graphs: [
				{
					img: 'Joscelyn/joscelyn-min-assets/a.png',
					character: 'a',
					source: 'Joscelyn',
				},
			],
		};

		const result = formatGraphSetEntry(graphSet);

		expect(result).toContain('\t\t{');
		expect(result).toContain('\t\t\ttitle: "minuscules",');
		expect(result).toContain('\t\t\tenabled: true,');
		expect(result).toContain('\t\t\tgraphs: [');
		expect(result).toContain('\t\t\t]');
		expect(result).toContain('\t\t}');
	});

	it('should format enabled as boolean without quotes', () => {
		const graphSet = {
			title: 'Others',
			enabled: false,
			graphs: [],
		};

		const result = formatGraphSetEntry(graphSet);

		expect(result).toContain('enabled: false,');
		expect(result).not.toContain('"false"');
	});

	it('should format multiple graphs with commas', () => {
		const graphSet = {
			title: 'minuscules',
			enabled: true,
			graphs: [
				{
					img: 'a.png',
					character: 'a',
					source: 'Test',
				},
				{
					img: 'b.png',
					character: 'b',
					source: 'Test',
				},
			],
		};

		const result = formatGraphSetEntry(graphSet);
		const graphEntries = result
			.split(',\n')
			.filter(line => line.includes('img:'));

		expect(graphEntries).toHaveLength(2);
	});
});

describe('formatDBContent', () => {
	it('should format complete DB structure', () => {
		const sources = {
			Joscelyn: {
				title: 'Joscelyn typeface',
				sourceUri: 'https://github.com/psb1558/Joscelyn-font/releases',
			},
		};

		const graphSets = [
			{
				title: 'minuscules',
				enabled: true,
				graphs: [
					{
						img: 'Joscelyn/joscelyn-min-assets/a.png',
						character: 'a',
						source: 'Joscelyn',
					},
				],
			},
		];

		const result = formatDBContent(sources, graphSets);

		expect(result).toContain('export const DB = {');
		expect(result).toContain('\tsources: {');
		expect(result).toContain('\tgraphSets: [');
		expect(result).toContain('};');
	});

	it('should format empty sources and graphSets', () => {
		const result = formatDBContent({}, []);

		expect(result).toContain('export const DB = {');
		expect(result).toContain('\tsources: {');
		expect(result).toContain('\t},');
		expect(result).toContain('\tgraphSets: [');
		expect(result).toContain('\t]');
		expect(result).toContain('};');
	});

	it('should include newline at end of file', () => {
		const result = formatDBContent({}, []);
		expect(result.endsWith('\n')).toBe(true);
	});

	it('should include warning comment at top of file', () => {
		const result = formatDBContent({}, []);
		expect(result).toMatch(
			/^\/\/ This is a generated file\. Do not edit\./
		);
		expect(result).toContain('Run `npm run update-db` to regenerate');
	});

	it('should format multiple sources with commas between them', () => {
		const sources = {
			Source1: { title: 'Source 1', sourceUri: 'https://example.com/1' },
			Source2: { title: 'Source 2', sourceUri: 'https://example.com/2' },
		};

		const result = formatDBContent(sources, []);

		expect(result).toContain('"Source1": {');
		expect(result).toContain('"Source2": {');
		expect(
			result.match(/"Source1"[\s\S]*?,\n[\s\S]*?"Source2"/)
		).toBeTruthy();
	});

	it('should format multiple graphSets with commas between them', () => {
		const graphSets = [
			{
				title: 'minuscules',
				enabled: true,
				graphs: [],
			},
			{
				title: 'MAJUSCULES',
				enabled: true,
				graphs: [],
			},
		];

		const result = formatDBContent({}, graphSets);

		expect(result).toContain('title: "minuscules"');
		expect(result).toContain('title: "MAJUSCULES"');
	});
});
