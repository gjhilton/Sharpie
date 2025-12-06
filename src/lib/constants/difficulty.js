/**
 * Difficulty configuration - single source of truth
 * Maps difficulty keys to their display labels
 */
const DIFFICULTIES = {
	easy: 'Easy',
	medium: 'Medium',
	hard: 'Hard',
};

export const DIFFICULTY_ORDER = Object.keys(DIFFICULTIES);

/**
 * Map of difficulty keys to display labels
 * Used for rendering difficulty headings
 */
export const DIFFICULTY_LABELS = DIFFICULTIES;
