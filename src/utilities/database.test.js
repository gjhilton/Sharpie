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
