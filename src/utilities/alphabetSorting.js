import { DIFFICULTY_ORDER } from '@constants/difficulty.js';

/**
 * Sort alphabets chronologically by date (oldest first)
 * @param {Array} alphabetNames - Array of alphabet name strings
 * @param {Object} alphabetsMetadata - Metadata object containing date, difficulty, etc.
 * @returns {Array} Sorted array of alphabet names
 */
export const sortAlphabetsByDate = (alphabetNames, alphabetsMetadata) => {
	return [...alphabetNames].sort((a, b) => {
		const dateA = alphabetsMetadata[a]?.date || '9999';
		const dateB = alphabetsMetadata[b]?.date || '9999';
		// Extract first year from date string (handles "1574/5" -> 1574)
		const yearA = parseInt(dateA.split('/')[0], 10);
		const yearB = parseInt(dateB.split('/')[0], 10);
		return yearA - yearB;
	});
};

/**
 * Sort alphabets alphabetically by name
 * @param {Array} alphabetNames - Array of alphabet name strings
 * @returns {Array} Sorted array of alphabet names
 */
export const sortAlphabetsByName = alphabetNames => {
	return [...alphabetNames].sort((a, b) => a.localeCompare(b));
};

/**
 * Sort alphabets by difficulty level, then by date within each difficulty group
 * @param {Array} alphabetNames - Array of alphabet name strings
 * @param {Object} alphabetsMetadata - Metadata object containing date, difficulty, etc.
 * @returns {Array} Sorted array of alphabet names
 */
export const sortAlphabetsByDifficulty = (alphabetNames, alphabetsMetadata) => {
	return [...alphabetNames].sort((a, b) => {
		const difficultyA = alphabetsMetadata[a]?.difficulty || 'medium';
		const difficultyB = alphabetsMetadata[b]?.difficulty || 'medium';

		// Get difficulty order indices
		const orderA = DIFFICULTY_ORDER.indexOf(difficultyA);
		const orderB = DIFFICULTY_ORDER.indexOf(difficultyB);

		// First sort by difficulty
		if (orderA !== orderB) {
			return orderA - orderB;
		}

		// If same difficulty, sort by date
		const dateA = alphabetsMetadata[a]?.date || '9999';
		const dateB = alphabetsMetadata[b]?.date || '9999';
		const yearA = parseInt(dateA.split('/')[0], 10);
		const yearB = parseInt(dateB.split('/')[0], 10);
		return yearA - yearB;
	});
};

/**
 * Group alphabets by difficulty level
 * @param {Array} alphabetNames - Array of alphabet name strings
 * @param {Object} alphabetsMetadata - Metadata object containing date, difficulty, etc.
 * @returns {Object} Object with difficulty levels as keys, arrays of alphabet names as values
 */
export const groupAlphabetsByDifficulty = (
	alphabetNames,
	alphabetsMetadata
) => {
	const groups = {};

	alphabetNames.forEach(name => {
		const difficulty = alphabetsMetadata[name]?.difficulty || 'medium';
		if (!groups[difficulty]) {
			groups[difficulty] = [];
		}
		groups[difficulty].push(name);
	});

	// Sort each group by date
	Object.keys(groups).forEach(difficulty => {
		groups[difficulty] = sortAlphabetsByDate(
			groups[difficulty],
			alphabetsMetadata
		);
	});

	return groups;
};
