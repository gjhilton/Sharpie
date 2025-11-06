import { describe, it, expect, vi } from 'vitest';
import * as catalogueLogic from './catalogueLogic.js';
import * as db from './database.js';

vi.mock('./database.js');

describe('catalogueLogic', () => {
	describe('groupGraphsByGraphSetAndCharacter', () => {
		it('should group graphs by graphset and character', () => {
			const mockGraphSets = [
				{
					title: 'minuscules',
					graphs: [
						{ character: 'a', img: 'a1.png', source: 'test' },
						{ character: 'b', img: 'b1.png', source: 'test' },
						{ character: 'a', img: 'a2.png', source: 'test' },
					],
				},
			];

			db.getGraphs.mockImplementation(gs => gs.graphs);
			db.getTitle.mockImplementation(gs => gs.title);

			const result =
				catalogueLogic.groupGraphsByGraphSetAndCharacter(mockGraphSets);

			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('minuscules');
			expect(result[0].characters).toHaveLength(2);
		});

		it('should sort characters alphabetically', () => {
			const mockGraphSets = [
				{
					title: 'test',
					graphs: [
						{ character: 'c', img: 'c1.png', source: 'test' },
						{ character: 'a', img: 'a1.png', source: 'test' },
						{ character: 'b', img: 'b1.png', source: 'test' },
					],
				},
			];

			db.getGraphs.mockImplementation(gs => gs.graphs);
			db.getTitle.mockImplementation(gs => gs.title);

			const result =
				catalogueLogic.groupGraphsByGraphSetAndCharacter(mockGraphSets);

			expect(result[0].characters[0].character).toBe('a');
			expect(result[0].characters[1].character).toBe('b');
			expect(result[0].characters[2].character).toBe('c');
		});

		it('should group multiple graphs for same character', () => {
			const mockGraphSets = [
				{
					title: 'test',
					graphs: [
						{ character: 'a', img: 'a1.png', source: 'test1' },
						{ character: 'a', img: 'a2.png', source: 'test2' },
						{ character: 'a', img: 'a3.png', source: 'test3' },
					],
				},
			];

			db.getGraphs.mockImplementation(gs => gs.graphs);
			db.getTitle.mockImplementation(gs => gs.title);

			const result =
				catalogueLogic.groupGraphsByGraphSetAndCharacter(mockGraphSets);

			expect(result[0].characters[0].graphs).toHaveLength(3);
			expect(result[0].characters[0].graphs[0].img).toBe('a1.png');
			expect(result[0].characters[0].graphs[1].img).toBe('a2.png');
			expect(result[0].characters[0].graphs[2].img).toBe('a3.png');
		});

		it('should handle multiple graphsets', () => {
			const mockGraphSets = [
				{
					title: 'minuscules',
					graphs: [{ character: 'a', img: 'a1.png', source: 'test' }],
				},
				{
					title: 'MAJUSCULES',
					graphs: [{ character: 'A', img: 'A1.png', source: 'test' }],
				},
			];

			db.getGraphs.mockImplementation(gs => gs.graphs);
			db.getTitle.mockImplementation(gs => gs.title);

			const result =
				catalogueLogic.groupGraphsByGraphSetAndCharacter(mockGraphSets);

			expect(result).toHaveLength(2);
			expect(result[0].title).toBe('minuscules');
			expect(result[1].title).toBe('MAJUSCULES');
		});

		it('should filter out empty graphsets', () => {
			const mockGraphSets = [
				{
					title: 'empty',
					graphs: [],
				},
			];

			db.getGraphs.mockImplementation(gs => gs.graphs);
			db.getTitle.mockImplementation(gs => gs.title);

			const result =
				catalogueLogic.groupGraphsByGraphSetAndCharacter(mockGraphSets);

			expect(result).toHaveLength(0);
		});

		it('should filter out empty graphsets but keep non-empty ones', () => {
			const mockGraphSets = [
				{
					title: 'minuscules',
					graphs: [{ character: 'a', img: 'a1.png', source: 'test' }],
				},
				{
					title: 'empty',
					graphs: [],
				},
				{
					title: 'MAJUSCULES',
					graphs: [{ character: 'A', img: 'A1.png', source: 'test' }],
				},
			];

			db.getGraphs.mockImplementation(gs => gs.graphs);
			db.getTitle.mockImplementation(gs => gs.title);

			const result =
				catalogueLogic.groupGraphsByGraphSetAndCharacter(mockGraphSets);

			expect(result).toHaveLength(2);
			expect(result[0].title).toBe('minuscules');
			expect(result[1].title).toBe('MAJUSCULES');
		});

		it('should be case-sensitive in sorting', () => {
			const mockGraphSets = [
				{
					title: 'test',
					graphs: [
						{ character: 'a', img: 'a1.png', source: 'test' },
						{ character: 'A', img: 'A1.png', source: 'test' },
						{ character: 'b', img: 'b1.png', source: 'test' },
						{ character: 'B', img: 'B1.png', source: 'test' },
					],
				},
			];

			db.getGraphs.mockImplementation(gs => gs.graphs);
			db.getTitle.mockImplementation(gs => gs.title);

			const result =
				catalogueLogic.groupGraphsByGraphSetAndCharacter(mockGraphSets);

			// localeCompare sorts lowercase before uppercase for same letter
			const characters = result[0].characters.map(c => c.character);
			expect(characters).toEqual(['a', 'A', 'b', 'B']);
		});
	});
});
