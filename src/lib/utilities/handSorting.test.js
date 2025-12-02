import { describe, it, expect } from 'vitest';
import {
	sortHandsByDate,
	sortHandsByName,
	sortHandsByDifficulty,
	groupHandsByDifficulty,
} from './handSorting.js';

describe('handSorting', () => {
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

	describe('sortHandsByDate', () => {
		it('sorts hands chronologically by date (oldest first)', () => {
			const result = sortHandsByDate(allNames, mockMetadata);
			expect(result).toEqual([
				'BeauChesne-Baildon',
				'Hill',
				'Howard',
				'NBacon',
				'Joscelyn',
			]);
		});

		it('handles dates with slashes correctly', () => {
			const result = sortHandsByDate(['Howard', 'Hill'], mockMetadata);
			// Hill is 1574/5, Howard is 1579/80
			expect(result).toEqual(['Hill', 'Howard']);
		});

		it('does not mutate the original array', () => {
			const original = [...allNames];
			sortHandsByDate(allNames, mockMetadata);
			expect(allNames).toEqual(original);
		});

		it('handles empty array', () => {
			const result = sortHandsByDate([], mockMetadata);
			expect(result).toEqual([]);
		});

		it('handles missing metadata by placing items at end', () => {
			const result = sortHandsByDate(['NBacon', 'Unknown'], mockMetadata);
			expect(result).toEqual(['NBacon', 'Unknown']);
		});
	});

	describe('sortHandsByName', () => {
		it('sorts hands alphabetically', () => {
			const result = sortHandsByName(allNames);
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
			sortHandsByName(allNames);
			expect(allNames).toEqual(original);
		});

		it('handles empty array', () => {
			const result = sortHandsByName([]);
			expect(result).toEqual([]);
		});

		it('handles single item', () => {
			const result = sortHandsByName(['NBacon']);
			expect(result).toEqual(['NBacon']);
		});

		it('is case-sensitive', () => {
			const result = sortHandsByName(['zebra', 'Apple', 'banana']);
			expect(result).toEqual(['Apple', 'banana', 'zebra']);
		});
	});

	describe('sortHandsByDifficulty', () => {
		it('sorts hands by difficulty level (easy, medium, hard)', () => {
			const result = sortHandsByDifficulty(allNames, mockMetadata);
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
			const result = sortHandsByDifficulty(mediumAlphabets, mockMetadata);
			// Howard (1579/80) before NBacon (1594)
			expect(result).toEqual(['Howard', 'NBacon']);
		});

		it('does not mutate the original array', () => {
			const original = [...allNames];
			sortHandsByDifficulty(allNames, mockMetadata);
			expect(allNames).toEqual(original);
		});

		it('handles empty array', () => {
			const result = sortHandsByDifficulty([], mockMetadata);
			expect(result).toEqual([]);
		});

		it('defaults to medium difficulty for missing metadata', () => {
			const metadata = {
				...mockMetadata,
				Unknown: { date: '1500' },
			};
			const result = sortHandsByDifficulty(
				['Joscelyn', 'Unknown', 'Hill'],
				metadata
			);
			// Joscelyn (easy), Unknown (medium default, 1500), Hill (hard)
			expect(result).toEqual(['Joscelyn', 'Unknown', 'Hill']);
		});
	});

	describe('groupHandsByDifficulty', () => {
		it('groups hands by difficulty level', () => {
			const result = groupHandsByDifficulty(allNames, mockMetadata);
			expect(result).toEqual({
				easy: ['Joscelyn'],
				medium: ['Howard', 'NBacon'],
				hard: ['BeauChesne-Baildon', 'Hill'],
			});
		});

		it('sorts each group by date', () => {
			const result = groupHandsByDifficulty(allNames, mockMetadata);
			// Check hard group is sorted by date
			expect(result.hard).toEqual(['BeauChesne-Baildon', 'Hill']);
			// Check medium group is sorted by date
			expect(result.medium).toEqual(['Howard', 'NBacon']);
		});

		it('handles empty array', () => {
			const result = groupHandsByDifficulty([], mockMetadata);
			expect(result).toEqual({});
		});

		it('defaults to medium difficulty for missing metadata', () => {
			const result = groupHandsByDifficulty(['Unknown'], {});
			expect(result).toEqual({
				medium: ['Unknown'],
			});
		});

		it('handles hands with only one difficulty level', () => {
			const easyOnly = ['Joscelyn'];
			const result = groupHandsByDifficulty(easyOnly, mockMetadata);
			expect(result).toEqual({
				easy: ['Joscelyn'],
			});
		});
	});
});
