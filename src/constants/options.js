import alphabetsData from '@data/alphabets.json';

// Game end mode options
export const GAME_END_MODE = {
	ON_QUIT: 'on_quit',
	FIXED_NUM: 'fixed_num',
	SUDDEN_DEATH: 'sudden_death',
	THREE_LIVES: 'three_lives',
};

// Available question counts for FIXED_NUM mode
export const QUESTION_COUNTS = [10, 25, 50, 100];

// Default game options
export const DEFAULT_OPTIONS = {
	gameMode: 'all', // 'minuscule' | 'majuscule' | 'all'
	twentyFourLetterAlphabet: false,
	showBaseline: true,
	enabledAlphabetIds: Object.values(alphabetsData).map(a => a.id), // all alphabets enabled by default
	gameEndMode: GAME_END_MODE.ON_QUIT,
	questionCount: 25,
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
	END_MODE: 'end',
	QUESTION_COUNT: 'num',
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

// Game end mode abbreviations for URL
export const END_MODE_URL_MAP = {
	[GAME_END_MODE.ON_QUIT]: 'q',
	[GAME_END_MODE.FIXED_NUM]: 'n',
	[GAME_END_MODE.SUDDEN_DEATH]: 's',
	[GAME_END_MODE.THREE_LIVES]: '3',
};

export const URL_END_MODE_MAP = {
	q: GAME_END_MODE.ON_QUIT,
	n: GAME_END_MODE.FIXED_NUM,
	s: GAME_END_MODE.SUDDEN_DEATH,
	3: GAME_END_MODE.THREE_LIVES,
};
