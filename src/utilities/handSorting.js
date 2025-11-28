import { DIFFICULTY_ORDER } from '@constants/difficulty.js';

/**
 * Sort hands chronologically by date (oldest first)
 * @param {Array} handNames - Array of hand name strings
 * @param {Object} handsMetadata - Metadata object containing date, difficulty, etc.
 * @returns {Array} Sorted array of hand names
 */
export const sortHandsByDate = (handNames, handsMetadata) => {
	return [...handNames].sort((a, b) => {
		const dateA = handsMetadata[a]?.date || '9999';
		const dateB = handsMetadata[b]?.date || '9999';
		// Extract first year from date string (handles "1574/5" -> 1574)
		const yearA = parseInt(dateA.split('/')[0], 10);
		const yearB = parseInt(dateB.split('/')[0], 10);
		return yearA - yearB;
	});
};

/**
 * Sort hands alphabetically by name
 * @param {Array} handNames - Array of hand name strings
 * @returns {Array} Sorted array of hand names
 */
export const sortHandsByName = handNames => {
	return [...handNames].sort((a, b) => a.localeCompare(b));
};

/**
 * Sort hands by difficulty level, then by date within each difficulty group
 * @param {Array} handNames - Array of hand name strings
 * @param {Object} handsMetadata - Metadata object containing date, difficulty, etc.
 * @returns {Array} Sorted array of hand names
 */
export const sortHandsByDifficulty = (handNames, handsMetadata) => {
	return [...handNames].sort((a, b) => {
		const difficultyA = handsMetadata[a]?.difficulty || 'medium';
		const difficultyB = handsMetadata[b]?.difficulty || 'medium';

		// Get difficulty order indices
		const orderA = DIFFICULTY_ORDER.indexOf(difficultyA);
		const orderB = DIFFICULTY_ORDER.indexOf(difficultyB);

		// First sort by difficulty
		if (orderA !== orderB) {
			return orderA - orderB;
		}

		// If same difficulty, sort by date
		const dateA = handsMetadata[a]?.date || '9999';
		const dateB = handsMetadata[b]?.date || '9999';
		const yearA = parseInt(dateA.split('/')[0], 10);
		const yearB = parseInt(dateB.split('/')[0], 10);
		return yearA - yearB;
	});
};

/**
 * Group hands by difficulty level
 * @param {Array} handNames - Array of hand name strings
 * @param {Object} handsMetadata - Metadata object containing date, difficulty, etc.
 * @returns {Object} Object with difficulty levels as keys, arrays of hand names as values
 */
export const groupHandsByDifficulty = (handNames, handsMetadata) => {
	const groups = {};

	handNames.forEach(name => {
		const difficulty = handsMetadata[name]?.difficulty || 'medium';
		if (!groups[difficulty]) {
			groups[difficulty] = [];
		}
		groups[difficulty].push(name);
	});

	// Sort each group by date
	Object.keys(groups).forEach(difficulty => {
		groups[difficulty] = sortHandsByDate(groups[difficulty], handsMetadata);
	});

	return groups;
};
