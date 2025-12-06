import { OPTIONS } from '@lib/options/schema.js';

// Derive game mode constants from OPTIONS schema
export const GAME_MODES = Object.keys(OPTIONS.mode.values).reduce(
	(acc, key) => {
		acc[key.toUpperCase()] = key;
		return acc;
	},
	{}
);

// Derive game mode options from OPTIONS schema
// Order: minuscule, majuscule, all
export const GAME_MODE_OPTIONS = ['minuscule', 'majuscule', 'all'].map(
	mode => ({
		value: mode,
		label: OPTIONS.mode.values[mode].label,
	})
);
