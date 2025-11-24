import { describe, it, expect } from 'vitest';
import {
	sortAlphabetsByDate,
	sortAlphabetsByName,
	sortAlphabetsByDifficulty,
	groupAlphabetsByDifficulty,
} from './alphabetSorting.js';

describe('alphabetSorting', () => {
	const mockMetadata = {
		NBacon: {
			title: 'Letter from the Privy Council to Nathaniel Bacon',
			date: '1594',
			difficulty: 'medium',
		},
		Howard: {
			title: 'Letter: Charles Howard, Lord Chamberlain',
			date: '1579/80',
			difficulty: 'medium',
		},
		Joscelyn: {
			title: 'Joscelyn typeface, drawn by Peter Baker',
			date: '2019',
			difficulty: 'easy',
		},
		'BeauChesne-Baildon': {
			title: 'The secretarie Alphabete',
			date: '1570',
			difficulty: 'hard',
		},
		Hill: {
			title: 'Commonplace book of William Hill',
			date: '1574/5',
			difficulty: 'hard',
		},
	};

	const allNames = [
		'NBacon',
		'Howard',
		'Joscelyn',
		'BeauChesne-Baildon',
		'Hill',
	];

	describe('sortAlphabetsByDate', () => {
		it('sorts alphabets chronologically by date (oldest first)', () => {
			const result = sortAlphabetsByDate(allNames, mockMetadata);
			expect(result).toEqual([
				'BeauChesne-Baildon',
				'Hill',
				'Howard',
				'NBacon',
				'Joscelyn',
			]);
		});

		it('handles dates with slashes correctly', () => {
			const result = sortAlphabetsByDate(
				['Howard', 'Hill'],
				mockMetadata
			);
			// Hill is 1574/5, Howard is 1579/80
			expect(result).toEqual(['Hill', 'Howard']);
		});

		it('does not mutate the original array', () => {
			const original = [...allNames];
			sortAlphabetsByDate(allNames, mockMetadata);
			expect(allNames).toEqual(original);
		});

		it('handles empty array', () => {
			const result = sortAlphabetsByDate([], mockMetadata);
			expect(result).toEqual([]);
		});

		it('handles missing metadata by placing items at end', () => {
			const result = sortAlphabetsByDate(
				['NBacon', 'Unknown'],
				mockMetadata
			);
			expect(result).toEqual(['NBacon', 'Unknown']);
		});
	});

	describe('sortAlphabetsByName', () => {
		it('sorts alphabets alphabetically', () => {
			const result = sortAlphabetsByName(allNames);
			expect(result).toEqual([
				'BeauChesne-Baildon',
				'Hill',
				'Howard',
				'Joscelyn',
				'NBacon',
			]);
		});

		it('does not mutate the original array', () => {
			const original = [...allNames];
			sortAlphabetsByName(allNames);
			expect(allNames).toEqual(original);
		});

		it('handles empty array', () => {
			const result = sortAlphabetsByName([]);
			expect(result).toEqual([]);
		});

		it('handles single item', () => {
			const result = sortAlphabetsByName(['NBacon']);
			expect(result).toEqual(['NBacon']);
		});

		it('is case-sensitive', () => {
			const result = sortAlphabetsByName(['zebra', 'Apple', 'banana']);
			expect(result).toEqual(['Apple', 'banana', 'zebra']);
		});
	});

	describe('sortAlphabetsByDifficulty', () => {
		it('sorts alphabets by difficulty level (easy, medium, hard)', () => {
			const result = sortAlphabetsByDifficulty(allNames, mockMetadata);
			expect(result).toEqual([
				'Joscelyn', // easy
				'Howard', // medium (1579/80)
				'NBacon', // medium (1594)
				'BeauChesne-Baildon', // hard (1570)
				'Hill', // hard (1574/5)
			]);
		});

		it('sorts by date within same difficulty level', () => {
			const mediumAlphabets = ['NBacon', 'Howard'];
			const result = sortAlphabetsByDifficulty(
				mediumAlphabets,
				mockMetadata
			);
			// Howard (1579/80) before NBacon (1594)
			expect(result).toEqual(['Howard', 'NBacon']);
		});

		it('does not mutate the original array', () => {
			const original = [...allNames];
			sortAlphabetsByDifficulty(allNames, mockMetadata);
			expect(allNames).toEqual(original);
		});

		it('handles empty array', () => {
			const result = sortAlphabetsByDifficulty([], mockMetadata);
			expect(result).toEqual([]);
		});

		it('defaults to medium difficulty for missing metadata', () => {
			const metadata = {
				...mockMetadata,
				Unknown: { date: '1500' },
			};
			const result = sortAlphabetsByDifficulty(
				['Joscelyn', 'Unknown', 'Hill'],
				metadata
			);
			// Joscelyn (easy), Unknown (medium default, 1500), Hill (hard)
			expect(result).toEqual(['Joscelyn', 'Unknown', 'Hill']);
		});
	});

	describe('groupAlphabetsByDifficulty', () => {
		it('groups alphabets by difficulty level', () => {
			const result = groupAlphabetsByDifficulty(allNames, mockMetadata);
			expect(result).toEqual({
				easy: ['Joscelyn'],
				medium: ['Howard', 'NBacon'],
				hard: ['BeauChesne-Baildon', 'Hill'],
			});
		});

		it('sorts each group by date', () => {
			const result = groupAlphabetsByDifficulty(allNames, mockMetadata);
			// Check hard group is sorted by date
			expect(result.hard).toEqual(['BeauChesne-Baildon', 'Hill']);
			// Check medium group is sorted by date
			expect(result.medium).toEqual(['Howard', 'NBacon']);
		});

		it('handles empty array', () => {
			const result = groupAlphabetsByDifficulty([], mockMetadata);
			expect(result).toEqual({});
		});

		it('defaults to medium difficulty for missing metadata', () => {
			const result = groupAlphabetsByDifficulty(['Unknown'], {});
			expect(result).toEqual({
				medium: ['Unknown'],
			});
		});

		it('handles alphabets with only one difficulty level', () => {
			const easyOnly = ['Joscelyn'];
			const result = groupAlphabetsByDifficulty(easyOnly, mockMetadata);
			expect(result).toEqual({
				easy: ['Joscelyn'],
			});
		});
	});
});
