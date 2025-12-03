import { describe, it, expect, vi } from 'vitest';
import * as gameLogic from '@lib/utilities/gameLogic.js';
import * as db from '@lib/utilities/database.js';
import { GAME_MODES } from '@lib/constants/stages.js';

vi.mock('@lib/utilities/database.js');

describe('gameLogic', () => {
	describe('STATUS constants', () => {
		it('should export status constants', () => {
			expect(gameLogic.STATUS.NONE).toBe('none');
			expect(gameLogic.STATUS.CORRECT).toBe('correct');
			expect(gameLogic.STATUS.INCORRECT).toBe('incorrect');
		});
	});

	describe('getGraphsForGameMode', () => {
		it('should get all enabled graphs for ALL mode', () => {
			const mockDB = { test: 'db' };
			const mockGraphSets = [{ enabled: true }, { enabled: false }];
			const mockGraphs = [{ character: 'a' }, { character: 'b' }];

			db.getEnabledGraphSets.mockReturnValue(mockGraphSets);
			db.flattenGraphs.mockReturnValue(mockGraphs);

			const result = gameLogic.getGraphsForGameMode(
				mockDB,
				GAME_MODES.ALL
			);

			expect(result).toEqual(mockGraphs);
			expect(db.getEnabledGraphSets).toHaveBeenCalledWith(mockDB);
			expect(db.flattenGraphs).toHaveBeenCalledWith(mockGraphSets);
		});

		it('should get specific graphset for MINUSCULE mode', () => {
			const mockDB = { test: 'db' };
			const mockGraphSet = {
				title: 'minuscules',
				graphs: [{ character: 'a' }],
			};
			const mockGraphs = [{ character: 'a' }];

			db.findGraphSetByTitle.mockReturnValue(mockGraphSet);
			db.getGraphs.mockReturnValue(mockGraphs);

			const result = gameLogic.getGraphsForGameMode(
				mockDB,
				GAME_MODES.MINUSCULE
			);

			expect(result).toEqual(mockGraphs);
			expect(db.findGraphSetByTitle).toHaveBeenCalledWith(
				mockDB,
				'minuscules'
			);
			expect(db.getGraphs).toHaveBeenCalledWith(mockGraphSet);
		});
	});

	describe('shouldCreateNewSolution', () => {
		it('should return true when attempt is null and status is NONE', () => {
			const result = gameLogic.shouldCreateNewSolution(
				null,
				gameLogic.STATUS.NONE
			);
			expect(result).toBe(true);
		});

		it('should return false when attempt is not null', () => {
			const result = gameLogic.shouldCreateNewSolution(
				'a',
				gameLogic.STATUS.NONE
			);
			expect(result).toBe(false);
		});

		it('should return false when status is not NONE', () => {
			const result = gameLogic.shouldCreateNewSolution(
				null,
				gameLogic.STATUS.CORRECT
			);
			expect(result).toBe(false);
		});
	});

	describe('getInitialKeyboardLayout', () => {
		it('should return shift for MAJUSCULE mode', () => {
			const result = gameLogic.getInitialKeyboardLayout(
				GAME_MODES.MAJUSCULE
			);
			expect(result).toBe('shift');
		});

		it('should return default for MINUSCULE mode', () => {
			const result = gameLogic.getInitialKeyboardLayout(
				GAME_MODES.MINUSCULE
			);
			expect(result).toBe('default');
		});

		it('should return default for ALL mode', () => {
			const result = gameLogic.getInitialKeyboardLayout(GAME_MODES.ALL);
			expect(result).toBe('default');
		});
	});

	describe('createRandomSolution', () => {
		it('should create a solution with graph and image path', () => {
			const mockGraph = {
				character: 'a',
				img: 'test.png',
				source: 'test',
			};
			const mockImagePath = '/data/test.png';
			const graphs = [mockGraph];

			db.getRandomGraph.mockReturnValue(mockGraph);
			db.getImagePath.mockReturnValue(mockImagePath);

			const solution = gameLogic.createRandomSolution(graphs);

			expect(solution).toEqual({
				graph: mockGraph,
				imagePath: mockImagePath,
			});
			expect(db.getRandomGraph).toHaveBeenCalledWith(graphs, Math.random);
			expect(db.getImagePath).toHaveBeenCalledWith(mockGraph);
		});

		it('should pass custom random function to getRandomGraph', () => {
			const mockGraph = {
				character: 'a',
				img: 'test.png',
				source: 'test',
			};
			const mockImagePath = '/data/test.png';
			const graphs = [mockGraph];
			const customRandom = () => 0.5;

			db.getRandomGraph.mockReturnValue(mockGraph);
			db.getImagePath.mockReturnValue(mockImagePath);

			const solution = gameLogic.createRandomSolution(
				graphs,
				customRandom
			);

			expect(solution).toEqual({
				graph: mockGraph,
				imagePath: mockImagePath,
			});
			expect(db.getRandomGraph).toHaveBeenCalledWith(
				graphs,
				customRandom
			);
			expect(db.getImagePath).toHaveBeenCalledWith(mockGraph);
		});

		it('should be deterministic with seeded random function', () => {
			const mockGraph1 = {
				character: 'a',
				img: 'test.png',
				source: 'test',
			};
			const mockImagePath1 = '/data/test.png';
			const graphs = [mockGraph1];
			const seededRandom = () => 0.3;

			db.getRandomGraph.mockReturnValue(mockGraph1);
			db.getImagePath.mockReturnValue(mockImagePath1);

			const solution1 = gameLogic.createRandomSolution(
				graphs,
				seededRandom
			);
			const solution2 = gameLogic.createRandomSolution(
				graphs,
				seededRandom
			);

			expect(solution1).toEqual(solution2);
		});
	});

	describe('checkAttempt', () => {
		it('should return NONE when attempt is null', () => {
			const result = gameLogic.checkAttempt(null, 'a');
			expect(result).toEqual({
				status: gameLogic.STATUS.NONE,
				acceptedAs24Letter: false,
			});
		});

		it('should return NONE when attempt is undefined', () => {
			const result = gameLogic.checkAttempt(undefined, 'a');
			expect(result).toEqual({
				status: gameLogic.STATUS.NONE,
				acceptedAs24Letter: false,
			});
		});

		it('should return CORRECT when attempt matches correct answer', () => {
			const result = gameLogic.checkAttempt('a', 'a');
			expect(result).toEqual({
				status: gameLogic.STATUS.CORRECT,
				acceptedAs24Letter: false,
			});
		});

		it('should return INCORRECT when attempt does not match correct answer', () => {
			const result = gameLogic.checkAttempt('b', 'a');
			expect(result).toEqual({
				status: gameLogic.STATUS.INCORRECT,
				acceptedAs24Letter: false,
			});
		});

		it('should be case-sensitive', () => {
			const result = gameLogic.checkAttempt('A', 'a');
			expect(result).toEqual({
				status: gameLogic.STATUS.INCORRECT,
				acceptedAs24Letter: false,
			});
		});

		describe('24-letter hand mode', () => {
			it('should accept i for j when mode is enabled', () => {
				const result = gameLogic.checkAttempt('i', 'j', true);
				expect(result).toEqual({
					status: gameLogic.STATUS.CORRECT,
					acceptedAs24Letter: true,
				});
			});

			it('should accept j for i when mode is enabled', () => {
				const result = gameLogic.checkAttempt('j', 'i', true);
				expect(result).toEqual({
					status: gameLogic.STATUS.CORRECT,
					acceptedAs24Letter: true,
				});
			});

			it('should accept I for J when mode is enabled', () => {
				const result = gameLogic.checkAttempt('I', 'J', true);
				expect(result).toEqual({
					status: gameLogic.STATUS.CORRECT,
					acceptedAs24Letter: true,
				});
			});

			it('should accept J for I when mode is enabled', () => {
				const result = gameLogic.checkAttempt('J', 'I', true);
				expect(result).toEqual({
					status: gameLogic.STATUS.CORRECT,
					acceptedAs24Letter: true,
				});
			});

			it('should accept u for v when mode is enabled', () => {
				const result = gameLogic.checkAttempt('u', 'v', true);
				expect(result).toEqual({
					status: gameLogic.STATUS.CORRECT,
					acceptedAs24Letter: true,
				});
			});

			it('should accept v for u when mode is enabled', () => {
				const result = gameLogic.checkAttempt('v', 'u', true);
				expect(result).toEqual({
					status: gameLogic.STATUS.CORRECT,
					acceptedAs24Letter: true,
				});
			});

			it('should accept U for V when mode is enabled', () => {
				const result = gameLogic.checkAttempt('U', 'V', true);
				expect(result).toEqual({
					status: gameLogic.STATUS.CORRECT,
					acceptedAs24Letter: true,
				});
			});

			it('should accept V for U when mode is enabled', () => {
				const result = gameLogic.checkAttempt('V', 'U', true);
				expect(result).toEqual({
					status: gameLogic.STATUS.CORRECT,
					acceptedAs24Letter: true,
				});
			});

			it('should NOT accept i for j when mode is disabled', () => {
				const result = gameLogic.checkAttempt('i', 'j', false);
				expect(result).toEqual({
					status: gameLogic.STATUS.INCORRECT,
					acceptedAs24Letter: false,
				});
			});

			it('should NOT accept u for v when mode is disabled', () => {
				const result = gameLogic.checkAttempt('u', 'v', false);
				expect(result).toEqual({
					status: gameLogic.STATUS.INCORRECT,
					acceptedAs24Letter: false,
				});
			});

			it('should still reject unrelated incorrect letters in 24-letter hand mode', () => {
				const result = gameLogic.checkAttempt('x', 'j', true);
				expect(result).toEqual({
					status: gameLogic.STATUS.INCORRECT,
					acceptedAs24Letter: false,
				});
			});

			it('should not accept lowercase for uppercase in 24-letter hand mode', () => {
				const result = gameLogic.checkAttempt('i', 'J', true);
				expect(result).toEqual({
					status: gameLogic.STATUS.INCORRECT,
					acceptedAs24Letter: false,
				});
			});
		});
	});

	describe('createAttempt', () => {
		it('should return attempt with image paths when matching graphs exist', () => {
			const graphs = [
				{ character: 'a', img: 'a1.png', source: 'test' },
				{ character: 'a', img: 'a2.png', source: 'test' },
				{ character: 'b', img: 'b1.png', source: 'test' },
			];

			db.getImagePath
				.mockReturnValueOnce('/data/a1.png')
				.mockReturnValueOnce('/data/a2.png');

			const attempt = gameLogic.createAttempt('a', graphs);

			expect(attempt).toEqual({
				character: 'a',
				imagePaths: ['/data/a1.png', '/data/a2.png'],
			});
		});

		it('should return empty image paths when no matching graphs exist', () => {
			const graphs = [
				{ character: 'a', img: 'a1.png', source: 'test' },
				{ character: 'b', img: 'b1.png', source: 'test' },
			];

			const attempt = gameLogic.createAttempt('z', graphs);

			expect(attempt).toEqual({
				character: 'z',
				imagePaths: [],
			});
		});

		it('should be case-sensitive', () => {
			const graphs = [
				{ character: 'a', img: 'a1.png', source: 'test' },
				{ character: 'A', img: 'A1.png', source: 'test' },
			];

			db.getImagePath.mockReturnValueOnce('/data/A1.png');

			const attempt = gameLogic.createAttempt('A', graphs);

			expect(attempt).toEqual({
				character: 'A',
				imagePaths: ['/data/A1.png'],
			});
		});
	});

	describe('createHistoryEntry', () => {
		it('should create a history entry with all required fields', () => {
			const solution = {
				graph: { character: 'a', img: 'a1.png', source: 'test' },
				imagePath: '/data/a1.png',
			};
			const userAnswer = 'b';
			const isCorrect = false;

			const entry = gameLogic.createHistoryEntry(
				solution,
				userAnswer,
				isCorrect
			);

			expect(entry).toEqual({
				graph: solution.graph,
				imagePath: solution.imagePath,
				userAnswer: 'b',
				correctAnswer: 'a',
				isCorrect: false,
				acceptedAs24Letter: false,
			});
		});

		it('should create a history entry with acceptedAs24Letter flag', () => {
			const solution = {
				graph: { character: 'j', img: 'j1.png', source: 'test' },
				imagePath: '/data/j1.png',
			};
			const userAnswer = 'i';
			const isCorrect = true;
			const acceptedAs24Letter = true;

			const entry = gameLogic.createHistoryEntry(
				solution,
				userAnswer,
				isCorrect,
				acceptedAs24Letter
			);

			expect(entry).toEqual({
				graph: solution.graph,
				imagePath: solution.imagePath,
				userAnswer: 'i',
				correctAnswer: 'j',
				isCorrect: true,
				acceptedAs24Letter: true,
			});
		});
	});

	describe('processIncorrectAttempts', () => {
		it('should filter out correct attempts', () => {
			const history = [
				{
					graph: { character: 'a', img: 'a1.png' },
					imagePath: '/data/a1.png',
					isCorrect: true,
				},
				{
					graph: { character: 'b', img: 'b1.png' },
					imagePath: '/data/b1.png',
					isCorrect: false,
				},
			];

			const mistakes = gameLogic.processIncorrectAttempts(history);

			expect(mistakes).toHaveLength(1);
			expect(mistakes[0].graph.character).toBe('b');
		});

		it('should deduplicate mistakes by character and image', () => {
			const history = [
				{
					graph: { character: 'a', img: 'a1.png' },
					imagePath: '/data/a1.png',
					isCorrect: false,
				},
				{
					graph: { character: 'a', img: 'a1.png' },
					imagePath: '/data/a1.png',
					isCorrect: false,
				},
				{
					graph: { character: 'a', img: 'a2.png' },
					imagePath: '/data/a2.png',
					isCorrect: false,
				},
			];

			const mistakes = gameLogic.processIncorrectAttempts(history);

			expect(mistakes).toHaveLength(2);
		});

		it('should sort mistakes alphabetically by character', () => {
			const history = [
				{
					graph: { character: 'c', img: 'c1.png' },
					imagePath: '/data/c1.png',
					isCorrect: false,
				},
				{
					graph: { character: 'a', img: 'a1.png' },
					imagePath: '/data/a1.png',
					isCorrect: false,
				},
				{
					graph: { character: 'b', img: 'b1.png' },
					imagePath: '/data/b1.png',
					isCorrect: false,
				},
			];

			const mistakes = gameLogic.processIncorrectAttempts(history);

			expect(mistakes[0].graph.character).toBe('a');
			expect(mistakes[1].graph.character).toBe('b');
			expect(mistakes[2].graph.character).toBe('c');
		});

		it('should return empty array when no incorrect attempts', () => {
			const history = [
				{
					graph: { character: 'a', img: 'a1.png' },
					imagePath: '/data/a1.png',
					isCorrect: true,
				},
			];

			const mistakes = gameLogic.processIncorrectAttempts(history);

			expect(mistakes).toHaveLength(0);
		});
	});

	describe('calculateGameStats', () => {
		it('should calculate stats correctly', () => {
			const startTime = Date.now() - 60000; // 60 seconds ago
			const stats = gameLogic.calculateGameStats(8, 2, startTime);

			expect(stats.correct).toBe(8);
			expect(stats.incorrect).toBe(2);
			expect(stats.percentage).toBe(80);
			expect(stats.timeElapsed).toBeGreaterThanOrEqual(59);
			expect(stats.timeElapsed).toBeLessThanOrEqual(61);
		});

		it('should handle zero total attempts', () => {
			const startTime = Date.now();
			const stats = gameLogic.calculateGameStats(0, 0, startTime);

			expect(stats.correct).toBe(0);
			expect(stats.incorrect).toBe(0);
			expect(stats.percentage).toBe(0);
		});

		it('should handle all correct answers', () => {
			const startTime = Date.now();
			const stats = gameLogic.calculateGameStats(10, 0, startTime);

			expect(stats.percentage).toBe(100);
		});

		it('should handle all incorrect answers', () => {
			const startTime = Date.now();
			const stats = gameLogic.calculateGameStats(0, 10, startTime);

			expect(stats.percentage).toBe(0);
		});

		it('should round percentage', () => {
			const startTime = Date.now();
			const stats = gameLogic.calculateGameStats(1, 2, startTime);

			// 1/3 = 33.33%, should round to 33
			expect(stats.percentage).toBe(33);
		});
	});
});
