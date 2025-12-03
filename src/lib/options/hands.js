/**
 * Hand ID utilities
 */

import handsData from '@data/hands.json';

const getHandById = id => {
	return Object.entries(handsData).find(([, data]) => data.id === id);
};

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
