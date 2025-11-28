import { describe, test, expect } from 'vitest';
import * as db from '@utilities/database.js';

const mockDB = {
	sources: {
		hill: {
			title: 'William Hill',
			sourceUri: 'http://example.com',
		},
		joscelyn: {
			title: 'Joscelyn',
			sourceUri: 'http://example.com',
		},
	},
	graphSets: [
		{
			title: 'minuscules',
			enabled: true,
			graphs: [
				{ img: 'joscelyn/a.png', character: 'a', source: 'joscelyn' },
				{ img: 'joscelyn/b.png', character: 'b', source: 'joscelyn' },
			],
		},
		{
			title: 'MAJUSCULES',
			enabled: true,
			graphs: [
				{ img: 'joscelyn/A.png', character: 'A', source: 'joscelyn' },
				{ img: 'joscelyn/B.png', character: 'B', source: 'joscelyn' },
			],
		},
	],
};

describe('getAllSources', () => {
	test('returns sources object', () => {
		const result = db.getAllSources(mockDB);
		expect(result).toEqual(mockDB.sources);
	});
});

describe('getSource', () => {
	test('returns specific source by key', () => {
		const result = db.getSource(mockDB.sources, 'hill');
		expect(result).toEqual(mockDB.sources.hill);
	});

	test('returns undefined for missing key', () => {
		const result = db.getSource(mockDB.sources, 'missing');
		expect(result).toBeUndefined();
	});
});

describe('getCredit', () => {
	test('returns title from source', () => {
		const source = mockDB.sources.hill;
		const result = db.getCredit(source);
		expect(result).toBe('William Hill');
	});
});

describe('getLink', () => {
	test('returns sourceUri from source', () => {
		const source = mockDB.sources.joscelyn;
		const result = db.getLink(source);
		expect(result).toBe('http://example.com');
	});
});

describe('getAllGraphsets', () => {
	test('returns all graphSets array', () => {
		const result = db.getAllGraphsets(mockDB);
		expect(result).toEqual(mockDB.graphSets);
	});
});

describe('getGraphset', () => {
	test('returns specific graphSet by index', () => {
		const result = db.getGraphset(mockDB.graphSets, 0);
		expect(result).toEqual(mockDB.graphSets[0]);
	});

	test('returns undefined for missing index', () => {
		const result = db.getGraphset(mockDB.graphSets, 5);
		expect(result).toBeUndefined();
	});
});

describe('getGraphs', () => {
	test('returns graphs array from graphSet', () => {
		const result = db.getGraphs(mockDB.graphSets[0]);
		expect(result).toEqual(mockDB.graphSets[0].graphs);
	});
});

describe('getTitle', () => {
	test('returns title from graphSet', () => {
		const result = db.getTitle(mockDB.graphSets[0]);
		expect(result).toBe('minuscules');
	});
});

describe('isEnabled', () => {
	test('returns enabled status', () => {
		const result = db.isEnabled(mockDB.graphSets[0]);
		expect(result).toBe(true);
	});
});

describe('getAllCharacters', () => {
	test('returns unique characters from graphSet', () => {
		const result = db.getAllCharacters(mockDB.graphSets[0]);
		expect(result).toEqual(['a', 'b']);
	});

	test('deduplicates characters', () => {
		const graphSetWithDupes = {
			graphs: [
				{ character: 'a', img: 'a1.png', source: 'hill' },
				{ character: 'b', img: 'b.png', source: 'hill' },
				{ character: 'a', img: 'a2.png', source: 'joscelyn' },
			],
		};
		const result = db.getAllCharacters(graphSetWithDupes);
		expect(result).toEqual(['a', 'b']);
	});

	test('returns empty array for graphSet with no graphs', () => {
		const emptyGraphSet = { graphs: [] };
		const result = db.getAllCharacters(emptyGraphSet);
		expect(result).toEqual([]);
	});
});

describe('getAllGraphsForCharacter', () => {
	test('returns all graphs matching character', () => {
		const result = db.getAllGraphsForCharacter(mockDB.graphSets[0], 'a');
		expect(result).toHaveLength(1);
		expect(result[0].character).toBe('a');
	});

	test('returns empty array when character not found', () => {
		const result = db.getAllGraphsForCharacter(mockDB.graphSets[0], 'z');
		expect(result).toEqual([]);
	});

	test('returns multiple graphs for same character', () => {
		const graphSetWithDupes = {
			graphs: [
				{ character: 'a', img: 'a1.png', source: 'hill' },
				{ character: 'b', img: 'b.png', source: 'hill' },
				{ character: 'a', img: 'a2.png', source: 'joscelyn' },
			],
		};
		const result = db.getAllGraphsForCharacter(graphSetWithDupes, 'a');
		expect(result).toHaveLength(2);
		expect(result[0].img).toBe('a1.png');
		expect(result[1].img).toBe('a2.png');
	});
});

describe('getAllGraphs', () => {
	test('returns object with characters as keys and graph arrays as values', () => {
		const result = db.getAllGraphs(mockDB.graphSets[0]);
		expect(result).toHaveProperty('a');
		expect(result).toHaveProperty('b');
		expect(result.a).toHaveLength(1);
		expect(result.b).toHaveLength(1);
	});

	test('groups multiple graphs by character', () => {
		const graphSetWithDupes = {
			graphs: [
				{ character: 'a', img: 'a1.png', source: 'hill' },
				{ character: 'b', img: 'b.png', source: 'hill' },
				{ character: 'a', img: 'a2.png', source: 'joscelyn' },
			],
		};
		const result = db.getAllGraphs(graphSetWithDupes);
		expect(result.a).toHaveLength(2);
		expect(result.b).toHaveLength(1);
	});

	test('returns empty object for graphSet with no graphs', () => {
		const emptyGraphSet = { graphs: [] };
		const result = db.getAllGraphs(emptyGraphSet);
		expect(result).toEqual({});
	});
});

describe('findGraphSetByTitle', () => {
	test('finds graphSet by title', () => {
		const result = db.findGraphSetByTitle(mockDB, 'minuscules');
		expect(result).toEqual(mockDB.graphSets[0]);
	});

	test('returns undefined when title not found', () => {
		const result = db.findGraphSetByTitle(mockDB, 'missing');
		expect(result).toBeUndefined();
	});
});

describe('getRandomGraph', () => {
	test('returns a graph from the array', () => {
		const graphs = [
			{ character: 'a', img: 'a.png' },
			{ character: 'b', img: 'b.png' },
		];
		const result = db.getRandomGraph(graphs);
		expect(graphs).toContain(result);
	});

	test('uses custom random function when provided', () => {
		const graphs = [
			{ character: 'a', img: 'a.png' },
			{ character: 'b', img: 'b.png' },
			{ character: 'c', img: 'c.png' },
		];

		// Seeded random always returns 0.5, which should select index 1
		const seededRandom = () => 0.5;
		const result = db.getRandomGraph(graphs, seededRandom);

		expect(result).toEqual({ character: 'b', img: 'b.png' });
	});

	test('is deterministic with seeded random function', () => {
		const graphs = [
			{ character: 'a', img: 'a.png' },
			{ character: 'b', img: 'b.png' },
			{ character: 'c', img: 'c.png' },
		];

		const seededRandom = () => 0.1;
		const result1 = db.getRandomGraph(graphs, seededRandom);
		const result2 = db.getRandomGraph(graphs, seededRandom);

		expect(result1).toEqual(result2);
		expect(result1).toEqual({ character: 'a', img: 'a.png' });
	});
});

describe('getImagePath', () => {
	test('returns path with BASE_URL and data prefix for minuscule', () => {
		const graph = {
			img: 'Joscelyn/joscelyn-min-assets/a.png',
			character: 'a',
		};
		const result = db.getImagePath(graph);
		// BASE_URL defaults to '/' in test environment
		expect(result).toBe('/data/Joscelyn/joscelyn-min-assets/a.png');
	});

	test('returns path with BASE_URL and data prefix for MAJUSCULE', () => {
		const graph = {
			img: 'Joscelyn/joscelyn-maj-assets/A.png',
			character: 'A',
		};
		const result = db.getImagePath(graph);
		expect(result).toBe('/data/Joscelyn/joscelyn-maj-assets/A.png');
	});

	test('returns path with BASE_URL and data prefix for different source', () => {
		const graph = {
			img: 'BeauChesne-Baildon/BCB-AB-assets/b.png',
			character: 'b',
		};
		const result = db.getImagePath(graph);
		expect(result).toBe('/data/BeauChesne-Baildon/BCB-AB-assets/b.png');
	});

	test('handles different file naming conventions', () => {
		const graph = {
			img: 'Joscelyn/joscelyn-min-assets/a1.png',
			character: 'a',
		};
		const result = db.getImagePath(graph);
		expect(result).toBe('/data/Joscelyn/joscelyn-min-assets/a1.png');
	});
});

describe('flattenGraphs', () => {
	test('flattens graphs from multiple graphSets', () => {
		const result = db.flattenGraphs(mockDB.graphSets);
		expect(result).toHaveLength(4); // 2 minuscules + 2 MAJUSCULES
		expect(result[0]).toEqual(mockDB.graphSets[0].graphs[0]);
		expect(result[2]).toEqual(mockDB.graphSets[1].graphs[0]);
	});
});

describe('getEnabledGraphSets', () => {
	test('returns only enabled graphSets', () => {
		const mockDBWithDisabled = {
			...mockDB,
			graphSets: [
				...mockDB.graphSets,
				{ title: 'disabled', enabled: false, graphs: [] },
			],
		};
		const result = db.getEnabledGraphSets(mockDBWithDisabled);
		expect(result).toHaveLength(2); // minuscules + MAJUSCULES (disabled one excluded)
		expect(result.every(gs => gs.enabled)).toBe(true);
	});
});

describe('Case sensitivity tests', () => {
	test('getAllCharacters returns lowercase and uppercase as separate characters', () => {
		const minusculesResult = db.getAllCharacters(mockDB.graphSets[0]);
		const majusculesResult = db.getAllCharacters(mockDB.graphSets[1]);

		expect(minusculesResult).toEqual(['a', 'b']);
		expect(majusculesResult).toEqual(['A', 'B']);
	});

	test('getAllGraphsForCharacter is case-sensitive for lowercase', () => {
		const minusculesGraphSet = mockDB.graphSets[0];
		const resultLower = db.getAllGraphsForCharacter(
			minusculesGraphSet,
			'a'
		);
		const resultUpper = db.getAllGraphsForCharacter(
			minusculesGraphSet,
			'A'
		);

		expect(resultLower).toHaveLength(1);
		expect(resultLower[0].character).toBe('a');
		expect(resultLower[0].img).toBe('joscelyn/a.png');
		expect(resultUpper).toEqual([]); // Should not find 'A' in minuscules
	});

	test('getAllGraphsForCharacter is case-sensitive for uppercase', () => {
		const majusculesGraphSet = mockDB.graphSets[1];
		const resultUpper = db.getAllGraphsForCharacter(
			majusculesGraphSet,
			'A'
		);
		const resultLower = db.getAllGraphsForCharacter(
			majusculesGraphSet,
			'a'
		);

		expect(resultUpper).toHaveLength(1);
		expect(resultUpper[0].character).toBe('A');
		expect(resultUpper[0].img).toBe('joscelyn/A.png');
		expect(resultLower).toEqual([]); // Should not find 'a' in MAJUSCULES
	});

	test('four files (a.png, A.png, b.png, B.png) are treated as four different characters', () => {
		const minusculesChars = db.getAllCharacters(mockDB.graphSets[0]);
		const majusculesChars = db.getAllCharacters(mockDB.graphSets[1]);

		const allChars = [...minusculesChars, ...majusculesChars];
		expect(allChars).toEqual(['a', 'b', 'A', 'B']);
		expect(new Set(allChars).size).toBe(4); // All unique
	});

	test('getAllGraphs groups by case-sensitive character keys', () => {
		const minusculesResult = db.getAllGraphs(mockDB.graphSets[0]);
		const majusculesResult = db.getAllGraphs(mockDB.graphSets[1]);

		expect(minusculesResult).toHaveProperty('a');
		expect(minusculesResult).toHaveProperty('b');
		expect(minusculesResult).not.toHaveProperty('A');
		expect(minusculesResult).not.toHaveProperty('B');

		expect(majusculesResult).toHaveProperty('A');
		expect(majusculesResult).toHaveProperty('B');
		expect(majusculesResult).not.toHaveProperty('a');
		expect(majusculesResult).not.toHaveProperty('b');
	});

	test('getImagePath works correctly for both minuscules and MAJUSCULES', () => {
		const minusculeGraph = mockDB.graphSets[0].graphs[0];
		const majusculeGraph = mockDB.graphSets[1].graphs[0];

		const minusculePath = db.getImagePath(minusculeGraph);
		const majusculePath = db.getImagePath(majusculeGraph);

		expect(minusculePath).toBe('/data/joscelyn/a.png');
		expect(majusculePath).toBe('/data/joscelyn/A.png');
		expect(minusculePath).not.toBe(majusculePath);
	});

	test('flattenGraphs preserves case sensitivity across graphSets', () => {
		const flattened = db.flattenGraphs(mockDB.graphSets);

		const characters = flattened.map(g => g.character);
		expect(characters).toContain('a');
		expect(characters).toContain('A');
		expect(characters).toContain('b');
		expect(characters).toContain('B');
		expect(characters).toHaveLength(4);
	});

	test('mixed case graphSet maintains case sensitivity', () => {
		const mixedGraphSet = {
			graphs: [
				{ character: 'a', img: 'a1.png', source: 'source1' },
				{ character: 'A', img: 'A1.png', source: 'source1' },
				{ character: 'a', img: 'a2.png', source: 'source2' },
				{ character: 'B', img: 'B1.png', source: 'source1' },
			],
		};

		const chars = db.getAllCharacters(mixedGraphSet);
		expect(chars).toEqual(['a', 'A', 'B']);
		expect(chars).toHaveLength(3);

		const lowerA = db.getAllGraphsForCharacter(mixedGraphSet, 'a');
		const upperA = db.getAllGraphsForCharacter(mixedGraphSet, 'A');

		expect(lowerA).toHaveLength(2);
		expect(upperA).toHaveLength(1);
		expect(lowerA[0].img).toBe('a1.png');
		expect(upperA[0].img).toBe('A1.png');
	});
});

describe('filterGraphsByEnabledHands', () => {
	test('filters graphs by enabled hands', () => {
		const graphs = [
			{ character: 'a', img: 'a.png', source: 'joscelyn' },
			{ character: 'b', img: 'b.png', source: 'hill' },
			{ character: 'c', img: 'c.png', source: 'joscelyn' },
		];
		const enabledHands = { joscelyn: true, hill: false };
		const result = db.filterGraphsByEnabledHands(graphs, enabledHands);
		expect(result).toHaveLength(2);
		expect(result[0].source).toBe('joscelyn');
		expect(result[1].source).toBe('joscelyn');
	});

	test('returns empty array when no hands enabled', () => {
		const graphs = [
			{ character: 'a', img: 'a.png', source: 'joscelyn' },
			{ character: 'b', img: 'b.png', source: 'hill' },
		];
		const enabledHands = { joscelyn: false, hill: false };
		const result = db.filterGraphsByEnabledHands(graphs, enabledHands);
		expect(result).toEqual([]);
	});

	test('returns all graphs when all hands enabled', () => {
		const graphs = [
			{ character: 'a', img: 'a.png', source: 'joscelyn' },
			{ character: 'b', img: 'b.png', source: 'hill' },
		];
		const enabledHands = { joscelyn: true, hill: true };
		const result = db.filterGraphsByEnabledHands(graphs, enabledHands);
		expect(result).toHaveLength(2);
	});
});

describe('countTotalCharacters', () => {
	test('counts all characters across all graphSets', () => {
		const result = db.countTotalCharacters(mockDB);
		expect(result).toBe(4); // 2 minuscules + 2 majuscules
	});

	test('returns 0 for empty graphSets', () => {
		const emptyDB = { graphSets: [] };
		const result = db.countTotalCharacters(emptyDB);
		expect(result).toBe(0);
	});

	test('counts correctly with single graphSet', () => {
		const singleSetDB = {
			graphSets: [
				{
					title: 'test',
					enabled: true,
					graphs: [
						{ character: 'a', img: 'a.png', source: 'test' },
						{ character: 'b', img: 'b.png', source: 'test' },
						{ character: 'c', img: 'c.png', source: 'test' },
					],
				},
			],
		};
		const result = db.countTotalCharacters(singleSetDB);
		expect(result).toBe(3);
	});
});

describe('countEnabledCharacters', () => {
	test('counts characters from enabled hands only', () => {
		const enabledHands = { joscelyn: true, hill: false };
		const result = db.countEnabledCharacters(mockDB, enabledHands);
		expect(result).toBe(4); // All graphs in mockDB have source: 'joscelyn'
	});

	test('returns 0 when no hands enabled', () => {
		const enabledHands = { joscelyn: false, hill: false };
		const result = db.countEnabledCharacters(mockDB, enabledHands);
		expect(result).toBe(0);
	});

	test('counts correctly with mixed enabled/disabled', () => {
		const mixedDB = {
			graphSets: [
				{
					title: 'test',
					enabled: true,
					graphs: [
						{ character: 'a', img: 'a.png', source: 'alpha' },
						{ character: 'b', img: 'b.png', source: 'beta' },
						{ character: 'c', img: 'c.png', source: 'alpha' },
					],
				},
			],
		};
		const enabledHands = { alpha: true, beta: false };
		const result = db.countEnabledCharacters(mixedDB, enabledHands);
		expect(result).toBe(2); // Only 'a' and 'c' from alpha
	});
});

describe('getAllHandNames', () => {
	test('returns all source keys', () => {
		const result = db.getAllHandNames(mockDB);
		expect(result).toEqual(['hill', 'joscelyn']);
	});

	test('returns empty array for db with no sources', () => {
		const emptySourcesDB = { sources: {} };
		const result = db.getAllHandNames(emptySourcesDB);
		expect(result).toEqual([]);
	});
});

describe('countEnabledHands', () => {
	test('counts hands with true values', () => {
		const enabledHands = { joscelyn: true, hill: true, other: false };
		const result = db.countEnabledHands(enabledHands);
		expect(result).toBe(2);
	});

	test('returns 0 when none enabled', () => {
		const enabledHands = { joscelyn: false, hill: false };
		const result = db.countEnabledHands(enabledHands);
		expect(result).toBe(0);
	});

	test('returns count for all enabled', () => {
		const enabledHands = { a: true, b: true, c: true };
		const result = db.countEnabledHands(enabledHands);
		expect(result).toBe(3);
	});

	test('returns 0 for empty object', () => {
		const result = db.countEnabledHands({});
		expect(result).toBe(0);
	});
});

describe('sortHandsByDate', () => {
	test('sorts hands by date in ascending order', () => {
		const alphabetNames = ['modern', 'medieval', 'ancient'];
		const handsMetadata = {
			modern: { date: '2019' },
			medieval: { date: '1574' },
			ancient: { date: '1200' },
		};
		const result = db.sortHandsByDate(alphabetNames, handsMetadata);
		expect(result).toEqual(['ancient', 'medieval', 'modern']);
	});

	test('handles dates with slashes like "1574/5"', () => {
		const alphabetNames = ['a', 'b', 'c'];
		const handsMetadata = {
			a: { date: '1579/80' },
			b: { date: '1574/5' },
			c: { date: '1570' },
		};
		const result = db.sortHandsByDate(alphabetNames, handsMetadata);
		expect(result).toEqual(['c', 'b', 'a']);
	});

	test('puts hands without dates at the end', () => {
		const alphabetNames = ['noDate', 'hasDate'];
		const handsMetadata = {
			hasDate: { date: '1500' },
			noDate: {},
		};
		const result = db.sortHandsByDate(alphabetNames, handsMetadata);
		expect(result).toEqual(['hasDate', 'noDate']);
	});

	test('handles missing metadata entries', () => {
		const alphabetNames = ['known', 'unknown'];
		const handsMetadata = {
			known: { date: '1600' },
		};
		const result = db.sortHandsByDate(alphabetNames, handsMetadata);
		expect(result).toEqual(['known', 'unknown']);
	});

	test('does not mutate original array', () => {
		const alphabetNames = ['b', 'a', 'c'];
		const handsMetadata = {
			a: { date: '1500' },
			b: { date: '1600' },
			c: { date: '1550' },
		};
		const original = [...alphabetNames];
		db.sortHandsByDate(alphabetNames, handsMetadata);
		expect(alphabetNames).toEqual(original);
	});

	test('handles hands with same date', () => {
		const alphabetNames = ['first', 'second'];
		const handsMetadata = {
			first: { date: '1574' },
			second: { date: '1574' },
		};
		const result = db.sortHandsByDate(alphabetNames, handsMetadata);
		expect(result).toHaveLength(2);
		expect(result).toContain('first');
		expect(result).toContain('second');
	});
});

describe('Edge cases and defensive tests', () => {
	test('getRandomGraph with single graph', () => {
		const graphs = [{ character: 'a', img: 'a.png' }];
		const result = db.getRandomGraph(graphs);
		expect(result).toEqual(graphs[0]);
	});

	test('flattenGraphs with empty graphSets', () => {
		const emptyGraphSets = [{ graphs: [] }, { graphs: [] }];
		const result = db.flattenGraphs(emptyGraphSets);
		expect(result).toEqual([]);
	});

	test('getAllCharacters handles empty graphs array', () => {
		const emptyGraphSet = { graphs: [] };
		const result = db.getAllCharacters(emptyGraphSet);
		expect(result).toEqual([]);
	});

	test('findGraphSetByTitle returns undefined for empty db', () => {
		const emptyDB = { graphSets: [] };
		const result = db.findGraphSetByTitle(emptyDB, 'missing');
		expect(result).toBeUndefined();
	});

	test('getEnabledGraphSets returns empty array when all disabled', () => {
		const allDisabled = {
			graphSets: [
				{ title: 'a', enabled: false, graphs: [] },
				{ title: 'b', enabled: false, graphs: [] },
			],
		};
		const result = db.getEnabledGraphSets(allDisabled);
		expect(result).toEqual([]);
	});
});
