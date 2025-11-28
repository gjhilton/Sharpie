/**
 * Hand ID utilities
 */

import handsData from '@data/hands.json';

/**
 * Get hand data by ID
 */
export const getHandById = id => {
	return Object.entries(handsData).find(([, data]) => data.id === id);
};

/**
 * Get hand key (name) by ID
 */
export const getHandKeyById = id => {
	const entry = getHandById(id);
	return entry ? entry[0] : null;
};

/**
 * Get hand ID by key (name)
 */
export const getHandIdByKey = key => {
	return handsData[key]?.id ?? null;
};

/**
 * Get all hand IDs
 */
export const getAllHandIds = () => {
	return Object.values(handsData).map(data => data.id);
};

/**
 * Get all default-enabled hand IDs
 */
export const getDefaultEnabledIds = () => {
	return Object.values(handsData)
		.filter(data => data.isDefaultEnabled)
		.map(data => data.id);
};

/**
 * Validate hand IDs - returns only valid IDs
 */
export const validateHandIds = ids => {
	const allIds = getAllHandIds();
	return ids.filter(id => allIds.includes(id));
};

/**
 * Convert hand keys to IDs
 */
export const keysToIds = keys => {
	return keys.map(key => getHandIdByKey(key)).filter(Boolean);
};

/**
 * Convert hand IDs to keys
 */
export const idsToKeys = ids => {
	return ids.map(id => getHandKeyById(id)).filter(Boolean);
};
