import alphabetsData from '@data/alphabets.json';

// Default game options
export const DEFAULT_OPTIONS = {
	gameMode: 'all', // 'minuscule' | 'majuscule' | 'all'
	twentyFourLetterAlphabet: false,
	showBaseline: true,
	enabledAlphabetIds: Object.values(alphabetsData).map(a => a.id), // all alphabets enabled by default
};

// Source of where options were loaded from
export const OPTIONS_SOURCE = {
	QUERY_STRING: 'query string',
	LOCAL_STORAGE: 'previous session',
	DEFAULTS: 'defaults',
};

// LocalStorage key
export const OPTIONS_STORAGE_KEY = 'sharpie-options';

// Query string parameter keys
export const URL_PARAMS = {
	MODE: 'mode',
	TWENTY_FOUR: '24',
	BASELINE: 'base',
	ALPHABETS: 'alph',
};

// Mode abbreviations for URL
export const MODE_URL_MAP = {
	minuscule: 'm',
	majuscule: 'M',
	all: 'a',
};

export const URL_MODE_MAP = {
	m: 'minuscule',
	M: 'majuscule',
	a: 'all',
};
