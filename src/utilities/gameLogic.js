import * as db from './database.js';
import { GAME_MODES } from '../constants/stages.js';

export const STATUS = {
	NONE: 'none',
	CORRECT: 'correct',
	INCORRECT: 'incorrect',
};

/**
 * Doubled letter pairs for historical mode
 * In secretary hand, I/J and U/V were not distinguished
 */
export const DOUBLED_LETTERS = {
	i: 'j',
	j: 'i',
	I: 'J',
	J: 'I',
	u: 'v',
	v: 'u',
	U: 'V',
	V: 'U',
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
 * @param {string} attempt - The user's guess
 * @param {string} correctAnswer - The correct answer
 * @param {boolean} doubledLetterMode - Whether I/J and U/V should be treated as the same
 * @returns {object} - { status, acceptedAsDoubled }
 */
export const checkAttempt = (
	attempt,
	correctAnswer,
	doubledLetterMode = false
) => {
	if (!attempt) return { status: STATUS.NONE, acceptedAsDoubled: false };

	// Direct match
	if (attempt === correctAnswer) {
		return { status: STATUS.CORRECT, acceptedAsDoubled: false };
	}

	// Check doubled letter mode
	if (doubledLetterMode && DOUBLED_LETTERS[correctAnswer] === attempt) {
		return { status: STATUS.CORRECT, acceptedAsDoubled: true };
	}

	return { status: STATUS.INCORRECT, acceptedAsDoubled: false };
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
export const createHistoryEntry = (
	solution,
	userAnswer,
	isCorrect,
	acceptedAsDoubled = false
) => ({
	graph: solution.graph,
	imagePath: solution.imagePath,
	userAnswer,
	correctAnswer: solution.graph.character,
	isCorrect,
	acceptedAsDoubled,
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
