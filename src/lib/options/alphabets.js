/**
 * Alphabet ID utilities
 */

import alphabetsData from '@data/alphabets.json';

/**
 * Get alphabet data by ID
 */
export const getAlphabetById = id => {
	return Object.entries(alphabetsData).find(([, data]) => data.id === id);
};

/**
 * Get alphabet key (name) by ID
 */
export const getAlphabetKeyById = id => {
	const entry = getAlphabetById(id);
	return entry ? entry[0] : null;
};

/**
 * Get alphabet ID by key (name)
 */
export const getAlphabetIdByKey = key => {
	return alphabetsData[key]?.id ?? null;
};

/**
 * Get all alphabet IDs
 */
export const getAllAlphabetIds = () => {
	return Object.values(alphabetsData).map(data => data.id);
};

/**
 * Get all default-enabled alphabet IDs
 */
export const getDefaultEnabledIds = () => {
	return Object.values(alphabetsData)
		.filter(data => data.isDefaultEnabled)
		.map(data => data.id);
};

/**
 * Validate alphabet IDs - returns only valid IDs
 */
export const validateAlphabetIds = ids => {
	const allIds = getAllAlphabetIds();
	return ids.filter(id => allIds.includes(id));
};

/**
 * Convert alphabet keys to IDs
 */
export const keysToIds = keys => {
	return keys.map(key => getAlphabetIdByKey(key)).filter(Boolean);
};

/**
 * Convert alphabet IDs to keys
 */
export const idsToKeys = ids => {
	return ids.map(id => getAlphabetKeyById(id)).filter(Boolean);
};
