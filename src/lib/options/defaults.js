/**
 * Default option values - matches current app behavior
 */

import { OPTIONS } from './schema.js';
import alphabetsData from '@data/alphabets.json';

/**
 * Get default enabled alphabet IDs based on isDefaultEnabled flag
 */
export const getDefaultAlphabetIds = () => {
	return Object.entries(alphabetsData)
		.filter(([, data]) => data.isDefaultEnabled)
		.map(([, data]) => data.id);
};

/**
 * Get default enabled alphabets as object mapping names to booleans
 */
export const getDefaultEnabledAlphabets = () => {
	const result = {};
	Object.entries(alphabetsData).forEach(([name, data]) => {
		result[name] = data.isDefaultEnabled === true;
	});
	return result;
};

/**
 * Get all default option values
 */
export const getDefaults = () => {
	return {
		mode: OPTIONS.mode.default,
		enabledAlphabets: getDefaultEnabledAlphabets(),
		twentyFourLetterAlphabet: OPTIONS.twentyFourLetter.default,
		showBaseline: OPTIONS.showBaseline.default,
	};
};

/**
 * Check if a value equals the default for an option
 */
export const isDefaultValue = (key, value) => {
	const defaults = getDefaults();
	if (key === 'enabledAlphabets') {
		const defaultObj = defaults.enabledAlphabets;
		if (typeof value !== 'object' || value === null) return false;

		// Check if all keys match and all values match
		const valueKeys = Object.keys(value).sort();
		const defaultKeys = Object.keys(defaultObj).sort();

		if (valueKeys.length !== defaultKeys.length) return false;
		if (!valueKeys.every((k, i) => k === defaultKeys[i])) return false;

		return Object.keys(value).every(k => value[k] === defaultObj[k]);
	}
	return defaults[key] === value;
};
