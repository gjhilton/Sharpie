import * as db from '@lib/utilities/database.js';
import { GAME_MODES } from '@lib/constants/stages.js';

export const STATUS = {
	NONE: 'none',
	CORRECT: 'correct',
	INCORRECT: 'incorrect',
};

const DOUBLED_LETTERS = {
	i: 'j',
	j: 'i',
	I: 'J',
	J: 'I',
	u: 'v',
	v: 'u',
	U: 'V',
	V: 'U',
};

const getGraphSetTitle = gameMode => {
	if (gameMode === GAME_MODES.ALL) return null;
	return gameMode === GAME_MODES.MINUSCULE ? 'minuscules' : 'MAJUSCULES';
};

/**
 * Gets graphs for the current game mode
 * @param {object} DB - The database object
 * @param {string} gameMode - The game mode (minuscule, majuscule, or all)
 * @param {object} enabledHands - Optional object mapping hand names to enabled status
 */
export const getGraphsForGameMode = (DB, gameMode, enabledHands = null) => {
	let graphs;
	if (gameMode === GAME_MODES.ALL) {
		const enabledGraphSets = db.getEnabledGraphSets(DB);
		graphs = db.flattenGraphs(enabledGraphSets);
	} else {
		const title = getGraphSetTitle(gameMode);
		const graphSet = db.findGraphSetByTitle(DB, title);
		graphs = db.getGraphs(graphSet);
	}

	// Filter by enabled hands if provided
	if (enabledHands) {
		graphs = db.filterGraphsByEnabledHands(graphs, enabledHands);
	}

	return graphs;
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
 * @param {boolean} twentyFourLetterAlphabet - Whether I/J and U/V should be treated as the same
 * @returns {object} - { status, acceptedAs24Letter }
 */
export const checkAttempt = (
	attempt,
	correctAnswer,
	twentyFourLetterAlphabet = false
) => {
	if (!attempt) return { status: STATUS.NONE, acceptedAs24Letter: false };

	// Direct match
	if (attempt === correctAnswer) {
		return { status: STATUS.CORRECT, acceptedAs24Letter: false };
	}

	// Check 24-letter alphabet mode
	if (
		twentyFourLetterAlphabet &&
		DOUBLED_LETTERS[correctAnswer] === attempt
	) {
		return { status: STATUS.CORRECT, acceptedAs24Letter: true };
	}

	return { status: STATUS.INCORRECT, acceptedAs24Letter: false };
};

/**
 * Creates an attempt object with matching image paths
 * @param {string} button - The character the user pressed
 * @param {Array} graphs - Available graphs
 * @param {boolean} twentyFourLetterAlphabet - Whether to also look for paired letters (i/j, u/v)
 */
export const createAttempt = (
	button,
	graphs,
	twentyFourLetterAlphabet = false
) => {
	// In 24-letter mode, include both the button and its paired letter
	let attemptGraphs;
	if (twentyFourLetterAlphabet && DOUBLED_LETTERS[button]) {
		const pairedLetter = DOUBLED_LETTERS[button];
		attemptGraphs = graphs.filter(
			g => g.character === button || g.character === pairedLetter
		);
	} else {
		attemptGraphs = graphs.filter(g => g.character === button);
	}

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
	acceptedAs24Letter = false
) => ({
	graph: solution.graph,
	imagePath: solution.imagePath,
	userAnswer,
	correctAnswer: solution.graph.character,
	isCorrect,
	acceptedAs24Letter,
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
