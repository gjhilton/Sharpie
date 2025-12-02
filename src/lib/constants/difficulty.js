/**
 * Difficulty configuration - single source of truth
 * Maps difficulty keys to their display labels
 */
const DIFFICULTIES = {
	easy: 'Easy',
	medium: 'Medium',
	hard: 'Hard',
};

/**
 * Difficulty level constants
 * Creates constants like DIFFICULTY_LEVELS.EASY = 'easy'
 */
export const DIFFICULTY_LEVELS = Object.keys(DIFFICULTIES).reduce(
	(acc, key) => {
		acc[key.toUpperCase()] = key;
		return acc;
	},
	{}
);

/**
 * Difficulty keys in order (easy -> medium -> hard)
 * Used for sorting alphabets by difficulty
 */
export const DIFFICULTY_ORDER = Object.keys(DIFFICULTIES);

/**
 * Map of difficulty keys to display labels
 * Used for rendering difficulty headings
 */
export const DIFFICULTY_LABELS = DIFFICULTIES;
