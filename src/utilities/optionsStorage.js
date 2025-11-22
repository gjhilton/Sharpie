import alphabetsData from '@data/alphabets.json';
import {
	DEFAULT_OPTIONS,
	OPTIONS_SOURCE,
	OPTIONS_STORAGE_KEY,
	URL_PARAMS,
	MODE_URL_MAP,
	URL_MODE_MAP,
	END_MODE_URL_MAP,
	URL_END_MODE_MAP,
	GAME_END_MODE,
	QUESTION_COUNTS,
} from '@constants/options.js';

// Build lookup maps for alphabet ID <-> name conversion
const alphabetIdToName = {};
const alphabetNameToId = {};
Object.entries(alphabetsData).forEach(([name, data]) => {
	alphabetIdToName[data.id] = name;
	alphabetNameToId[name] = data.id;
});

/**
 * Get alphabet name by ID
 */
export const getAlphabetNameById = id => alphabetIdToName[id] || null;

/**
 * Get alphabet ID by name
 */
export const getAlphabetIdByName = name => alphabetNameToId[name] || null;

/**
 * Convert enabledAlphabetIds array to enabledAlphabets object (name -> boolean)
 */
export const idsToEnabledAlphabets = ids => {
	const enabled = {};
	Object.keys(alphabetsData).forEach(name => {
		const id = alphabetNameToId[name];
		enabled[name] = ids.includes(id);
	});
	return enabled;
};

/**
 * Convert enabledAlphabets object (name -> boolean) to enabledAlphabetIds array
 */
export const enabledAlphabetsToIds = enabledAlphabets => {
	return Object.entries(enabledAlphabets)
		.filter(([, enabled]) => enabled)
		.map(([name]) => alphabetNameToId[name])
		.filter(id => id !== undefined)
		.sort((a, b) => a - b);
};

/**
 * Save options to localStorage
 */
export const saveOptionsToLocalStorage = options => {
	try {
		localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options));
	} catch {
		// localStorage might be unavailable (e.g., private browsing)
		console.warn('Failed to save options to localStorage');
	}
};

/**
 * Load options from localStorage
 * Returns null if not found or invalid
 */
export const loadOptionsFromLocalStorage = () => {
	try {
		const stored = localStorage.getItem(OPTIONS_STORAGE_KEY);
		if (!stored) return null;

		const parsed = JSON.parse(stored);

		// Validate core structure (required fields)
		if (
			typeof parsed.gameMode !== 'string' ||
			typeof parsed.twentyFourLetterAlphabet !== 'boolean' ||
			typeof parsed.showBaseline !== 'boolean' ||
			!Array.isArray(parsed.enabledAlphabetIds)
		) {
			return null;
		}

		// Apply defaults for new fields (backward compatibility)
		const options = {
			...DEFAULT_OPTIONS,
			...parsed,
		};

		// Validate gameEndMode if present
		if (
			options.gameEndMode &&
			!Object.values(GAME_END_MODE).includes(options.gameEndMode)
		) {
			options.gameEndMode = DEFAULT_OPTIONS.gameEndMode;
		}

		// Validate questionCount if present
		if (
			options.questionCount &&
			!QUESTION_COUNTS.includes(options.questionCount)
		) {
			options.questionCount = DEFAULT_OPTIONS.questionCount;
		}

		return options;
	} catch {
		return null;
	}
};

/**
 * Clear options from localStorage
 */
export const clearOptionsFromLocalStorage = () => {
	try {
		localStorage.removeItem(OPTIONS_STORAGE_KEY);
	} catch {
		// Ignore errors
	}
};

/**
 * Parse options from URL query string
 * Returns null if no valid options found
 */
export const parseOptionsFromUrl = searchString => {
	if (!searchString) return null;

	const params = new URLSearchParams(searchString);

	// Check if any of our params exist
	const hasAnyParam =
		params.has(URL_PARAMS.MODE) ||
		params.has(URL_PARAMS.TWENTY_FOUR) ||
		params.has(URL_PARAMS.BASELINE) ||
		params.has(URL_PARAMS.ALPHABETS) ||
		params.has(URL_PARAMS.END_MODE) ||
		params.has(URL_PARAMS.QUESTION_COUNT);

	if (!hasAnyParam) return null;

	// Start with defaults and override with URL values
	const options = { ...DEFAULT_OPTIONS };

	// Parse game mode
	const modeParam = params.get(URL_PARAMS.MODE);
	if (modeParam && URL_MODE_MAP[modeParam]) {
		options.gameMode = URL_MODE_MAP[modeParam];
	}

	// Parse 24-letter alphabet (presence of '24=1' means true)
	if (params.has(URL_PARAMS.TWENTY_FOUR)) {
		options.twentyFourLetterAlphabet =
			params.get(URL_PARAMS.TWENTY_FOUR) === '1';
	}

	// Parse baseline (base=0 means false, absent means true)
	if (params.has(URL_PARAMS.BASELINE)) {
		options.showBaseline = params.get(URL_PARAMS.BASELINE) !== '0';
	}

	// Parse alphabet IDs
	const alphParam = params.get(URL_PARAMS.ALPHABETS);
	if (alphParam) {
		const ids = alphParam
			.split(',')
			.map(s => parseInt(s, 10))
			.filter(id => !isNaN(id) && alphabetIdToName[id]);
		if (ids.length > 0) {
			options.enabledAlphabetIds = ids;
		}
	}

	// Parse game end mode
	const endModeParam = params.get(URL_PARAMS.END_MODE);
	if (endModeParam && URL_END_MODE_MAP[endModeParam]) {
		options.gameEndMode = URL_END_MODE_MAP[endModeParam];
	}

	// Parse question count
	const numParam = params.get(URL_PARAMS.QUESTION_COUNT);
	if (numParam) {
		const num = parseInt(numParam, 10);
		if (QUESTION_COUNTS.includes(num)) {
			options.questionCount = num;
		}
	}

	return options;
};

/**
 * Serialize options to URL query string
 */
export const serializeOptionsToUrl = options => {
	const params = new URLSearchParams();

	// Mode
	const modeAbbrev = MODE_URL_MAP[options.gameMode];
	if (modeAbbrev && options.gameMode !== DEFAULT_OPTIONS.gameMode) {
		params.set(URL_PARAMS.MODE, modeAbbrev);
	}

	// 24-letter alphabet (only include if true)
	if (options.twentyFourLetterAlphabet) {
		params.set(URL_PARAMS.TWENTY_FOUR, '1');
	}

	// Baseline (only include if false)
	if (!options.showBaseline) {
		params.set(URL_PARAMS.BASELINE, '0');
	}

	// Alphabets (only include if different from default)
	const defaultIds = DEFAULT_OPTIONS.enabledAlphabetIds
		.slice()
		.sort((a, b) => a - b);
	const currentIds = options.enabledAlphabetIds.slice().sort((a, b) => a - b);
	const sameAlphabets =
		defaultIds.length === currentIds.length &&
		defaultIds.every((id, i) => id === currentIds[i]);

	if (!sameAlphabets) {
		params.set(URL_PARAMS.ALPHABETS, currentIds.join(','));
	}

	// Game end mode (only include if not default)
	if (
		options.gameEndMode &&
		options.gameEndMode !== DEFAULT_OPTIONS.gameEndMode
	) {
		const endModeAbbrev = END_MODE_URL_MAP[options.gameEndMode];
		if (endModeAbbrev) {
			params.set(URL_PARAMS.END_MODE, endModeAbbrev);
		}
	}

	// Question count (only include if FIXED_NUM mode and not default)
	if (
		options.gameEndMode === GAME_END_MODE.FIXED_NUM &&
		options.questionCount !== DEFAULT_OPTIONS.questionCount
	) {
		params.set(URL_PARAMS.QUESTION_COUNT, options.questionCount.toString());
	}

	const queryString = params.toString();
	return queryString ? `?${queryString}` : '';
};

/**
 * Build full permalink URL with current options
 */
export const buildPermalink = options => {
	const base = window.location.origin + window.location.pathname;
	const query = serializeOptionsToUrl(options);
	return base + query;
};

/**
 * Load options with priority: URL -> localStorage -> defaults
 * Returns { options, source }
 */
export const loadOptions = () => {
	// Try URL first
	const urlOptions = parseOptionsFromUrl(window.location.search);
	if (urlOptions) {
		// Save to localStorage for persistence
		saveOptionsToLocalStorage(urlOptions);
		return { options: urlOptions, source: OPTIONS_SOURCE.QUERY_STRING };
	}

	// Try localStorage
	const storedOptions = loadOptionsFromLocalStorage();
	if (storedOptions) {
		return { options: storedOptions, source: OPTIONS_SOURCE.LOCAL_STORAGE };
	}

	// Fall back to defaults
	return { options: { ...DEFAULT_OPTIONS }, source: OPTIONS_SOURCE.DEFAULTS };
};
