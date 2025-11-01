import { describe, test, expect } from 'vitest';
import * as db from './database.js';

const mockDB = {
	sources: {
		hill: {
			title: 'William Hill',
			sourceUri: 'http://example.com'
		},
		joscelyn: {
			title: 'Joscelyn',
			sourceUri: 'http://example.com'
		}
	},
	graphSets: [
		{
			title: 'minuscules',
			enabled: true,
			graphs: [
				{ img: 'a.png', character: 'a', source: 'joscelyn' },
				{ img: 'b.png', character: 'b', source: 'joscelyn' }
			]
		}
	]
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
				{ character: 'a', img: 'a2.png', source: 'joscelyn' }
			]
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
				{ character: 'a', img: 'a2.png', source: 'joscelyn' }
			]
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
				{ character: 'a', img: 'a2.png', source: 'joscelyn' }
			]
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
			{ character: 'b', img: 'b.png' }
		];
		const result = db.getRandomGraph(graphs);
		expect(graphs).toContain(result);
	});
});

describe('getImagePath', () => {
	test('builds path for minuscules', () => {
		const graph = { img: 'a.png', character: 'a' };
		const result = db.getImagePath(graph, 'minuscules');
		expect(result).toBe('/data/joscelyn-min/a.png');
	});

	test('builds path for MAJUSCULES', () => {
		const graph = { img: 'a.png', character: 'A' };
		const result = db.getImagePath(graph, 'MAJUSCULES');
		expect(result).toBe('/data/joscelyn-maj/a.png');
	});

	test('builds path for Numerals', () => {
		const graph = { img: '1.png', character: '1' };
		const result = db.getImagePath(graph, 'Numerals');
		expect(result).toBe('/data/joscelyn-num/1.png');
	});

	test('builds path for Brevigraphs', () => {
		const graph = { img: 'and.png', character: '&' };
		const result = db.getImagePath(graph, 'Brevigraphs');
		expect(result).toBe('/data/joscelyn-brev/and.png');
	});

	test('defaults to minuscules for unknown graphSet', () => {
		const graph = { img: 'x.png', character: 'x' };
		const result = db.getImagePath(graph, 'unknown');
		expect(result).toBe('/data/joscelyn-min/x.png');
	});
});

describe('flattenGraphs', () => {
	test('flattens graphs from multiple graphSets', () => {
		const result = db.flattenGraphs(mockDB.graphSets);
		expect(result).toHaveLength(2);
		expect(result[0]).toEqual(mockDB.graphSets[0].graphs[0]);
	});
});

describe('getEnabledGraphSets', () => {
	test('returns only enabled graphSets', () => {
		const mockDBWithDisabled = {
			...mockDB,
			graphSets: [
				...mockDB.graphSets,
				{ title: 'disabled', enabled: false, graphs: [] }
			]
		};
		const result = db.getEnabledGraphSets(mockDBWithDisabled);
		expect(result).toHaveLength(1);
		expect(result.every(gs => gs.enabled)).toBe(true);
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
				{ title: 'b', enabled: false, graphs: [] }
			]
		};
		const result = db.getEnabledGraphSets(allDisabled);
		expect(result).toEqual([]);
	});
});
