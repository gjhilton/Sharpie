import * as db from './database.js';
import { GAME_MODES } from '../constants/stages.js';

export const STATUS = {
	NONE: 'none',
	CORRECT: 'correct',
	INCORRECT: 'incorrect',
};

/**
 * Gets the title for a graph set based on game mode
 */
export const getGraphSetTitle = gameMode => {
	if (gameMode === GAME_MODES.ALL) return null;
	return gameMode === GAME_MODES.MINUSCULE ? 'minuscules' : 'MAJUSCULES';
};

/**
 * Gets graphs for the current game mode
 */
export const getGraphsForGameMode = (DB, gameMode) => {
	if (gameMode === GAME_MODES.ALL) {
		const enabledGraphSets = db.getEnabledGraphSets(DB);
		return db.flattenGraphs(enabledGraphSets);
	}
	const title = getGraphSetTitle(gameMode);
	const graphSet = db.findGraphSetByTitle(DB, title);
	return db.getGraphs(graphSet);
};

/**
 * Determines if a new solution should be created
 */
export const shouldCreateNewSolution = (attempt, attemptStatus) => {
	return attempt === null && attemptStatus === STATUS.NONE;
};

/**
 * Gets the initial keyboard layout based on game mode
 */
export const getInitialKeyboardLayout = gameMode => {
	return gameMode === GAME_MODES.MAJUSCULE ? 'shift' : 'default';
};

/**
 * Creates a random solution from available graphs
 * @param {Array} graphs - Available graphs to choose from
 * @param {Function} randomFn - Optional random function (defaults to Math.random)
 */
export const createRandomSolution = (graphs, randomFn = Math.random) => {
	const graph = db.getRandomGraph(graphs, randomFn);
	const imagePath = db.getImagePath(graph);
	return { graph, imagePath };
};

/**
 * Checks if an attempt matches the correct answer
 */
export const checkAttempt = (attempt, correctAnswer) => {
	if (!attempt) return STATUS.NONE;
	return attempt === correctAnswer ? STATUS.CORRECT : STATUS.INCORRECT;
};

/**
 * Creates an attempt object with matching image paths
 */
export const createAttempt = (button, graphs) => {
	const attemptGraphs = graphs.filter(g => g.character === button);
	const imagePaths =
		attemptGraphs.length > 0
			? attemptGraphs.map(g => db.getImagePath(g))
			: [];

	return {
		character: button,
		imagePaths,
	};
};

/**
 * Creates a history entry for an attempt
 */
export const createHistoryEntry = (solution, userAnswer, isCorrect) => ({
	graph: solution.graph,
	imagePath: solution.imagePath,
	userAnswer,
	correctAnswer: solution.graph.character,
	isCorrect,
});

/**
 * Processes incorrect attempts to create a unique, sorted list of mistakes
 */
export const processIncorrectAttempts = history => {
	const incorrectAttempts = history.filter(h => !h.isCorrect);
	const uniqueMistakes = [];
	const seen = new Set();

	incorrectAttempts.forEach(attempt => {
		const key = `${attempt.graph.character}-${attempt.graph.img}`;
		if (!seen.has(key)) {
			seen.add(key);
			uniqueMistakes.push({
				graph: attempt.graph,
				imagePath: attempt.imagePath,
			});
		}
	});

	// Sort alphabetically by character
	uniqueMistakes.sort((a, b) =>
		a.graph.character.localeCompare(b.graph.character)
	);

	return uniqueMistakes;
};

/**
 * Calculates game statistics
 */
export const calculateGameStats = (correctCount, incorrectCount, startTime) => {
	const endTime = Date.now();
	const timeElapsed = Math.round((endTime - startTime) / 1000);
	const total = correctCount + incorrectCount;
	const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

	return {
		correct: correctCount,
		incorrect: incorrectCount,
		percentage,
		timeElapsed,
	};
};
