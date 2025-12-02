/**
 * URL serialization/deserialization for options
 */

import { OPTIONS } from './schema.js';
import { getDefaults, isDefaultValue } from './defaults.js';
import {
	validateHandIds,
	getDefaultEnabledIds,
	getHandKeyById,
	getAllHandIds,
	getHandIdByKey,
} from './hands.js';

/**
 * Convert array of hand IDs to object mapping hand names to booleans
 * @param {string[]} ids - Array of hand IDs (e.g., ['beau1570', 'hill1574'])
 * @returns {Object} - Object mapping names to booleans (e.g., { 'BeauChesne-Baildon': true, 'Hill': true })
 */
const idsToEnabledObject = ids => {
	const allIds = getAllHandIds();
	const result = {};

	allIds.forEach(id => {
		const key = getHandKeyById(id);
		if (key) {
			result[key] = ids.includes(id);
		}
	});

	return result;
};

/**
 * Convert object mapping hand names to booleans to array of enabled hand IDs
 * @param {Object} enabledObj - Object mapping names to booleans (e.g., { 'BeauChesne-Baildon': true, 'Hill': false })
 * @returns {string[]} - Array of enabled hand IDs (e.g., ['beau1570'])
 */
const enabledObjectToIds = enabledObj => {
	return Object.entries(enabledObj)
		.filter(([, enabled]) => enabled === true)
		.map(([name]) => getHandIdByKey(name))
		.filter(Boolean);
};

/**
 * Serialize a single option value to URL format
 */
export const serializeValue = (optionKey, value) => {
	const option = OPTIONS[optionKey];
	if (!option) return null;

	switch (option.type) {
		case 'enum':
			return (
				option.values[value]?.urlValue ??
				option.values[option.default].urlValue
			);
		case 'boolean':
			return value ? '1' : '0';
		case 'handSet': {
			// Convert object format to array of IDs
			const ids = Array.isArray(value)
				? value
				: enabledObjectToIds(value);
			// Return empty string when no hands enabled (not null)
			// This allows distinguishing "user disabled all" from "not set"
			if (ids.length === 0) return '';
			return ids.join(',');
		}
		default:
			return String(value);
	}
};

/**
 * Deserialize a URL value to option value
 */
export const deserializeValue = (optionKey, urlValue) => {
	const option = OPTIONS[optionKey];
	if (!option || urlValue === null || urlValue === undefined) {
		return getDefaults()[option?.key];
	}

	switch (option.type) {
		case 'enum': {
			const entry = Object.entries(option.values).find(
				([, config]) => config.urlValue === urlValue
			);
			return entry ? entry[0] : option.default;
		}
		case 'boolean':
			return urlValue === '1';
		case 'handSet': {
			// Empty string means user explicitly disabled all hands
			if (urlValue === '') {
				return idsToEnabledObject([]);
			}
			const ids = urlValue.split(',').filter(Boolean);
			const validIds = validateHandIds(ids);
			const finalIds =
				validIds.length > 0 ? validIds : getDefaultEnabledIds();
			// Convert array of IDs to object format
			return idsToEnabledObject(finalIds);
		}
		default:
			return urlValue;
	}
};

/**
 * Serialize option to URL param object (for spreading into search params)
 */
export const serializeOption = (optionKey, value) => {
	const option = OPTIONS[optionKey];
	if (!option) return {};

	// Don't include default values in URL
	if (isDefaultValue(option.key, value)) {
		return { [option.urlParam]: undefined };
	}

	const serialized = serializeValue(optionKey, value);
	return serialized !== null ? { [option.urlParam]: serialized } : {};
};

/**
 * Deserialize all options from URL search params
 */
export const deserializeOptions = searchParams => {
	const defaults = getDefaults();

	return {
		mode: searchParams.m
			? deserializeValue('mode', searchParams.m)
			: defaults.mode,
		enabledHands:
			searchParams.a !== undefined
				? deserializeValue('hands', searchParams.a)
				: defaults.enabledHands,
		numLetters:
			searchParams.l !== undefined
				? deserializeValue('numLetters', searchParams.l)
				: defaults.numLetters,
		showBaseline:
			searchParams.b !== undefined
				? deserializeValue('showBaseline', searchParams.b)
				: defaults.showBaseline,
	};
};

/**
 * Serialize all options to URL search params
 */
export const serializeOptions = options => {
	const params = {};

	if (options.mode !== undefined) {
		Object.assign(params, serializeOption('mode', options.mode));
	}
	if (options.enabledHands !== undefined) {
		Object.assign(params, serializeOption('hands', options.enabledHands));
	}
	if (options.numLetters !== undefined) {
		Object.assign(
			params,
			serializeOption('numLetters', options.numLetters)
		);
	}
	if (options.showBaseline !== undefined) {
		Object.assign(
			params,
			serializeOption('showBaseline', options.showBaseline)
		);
	}

	// Remove undefined values
	return Object.fromEntries(
		Object.entries(params).filter(([, v]) => v !== undefined)
	);
};
