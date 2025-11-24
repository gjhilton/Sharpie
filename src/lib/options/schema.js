/**
 * Options schema - defines all game options and their URL serialization
 */

export const OPTIONS = {
	mode: {
		key: 'mode',
		type: 'enum',
		urlParam: 'm',
		default: 'all',
		values: {
			all: { label: 'both minuscules AND MAJUSCULES', urlValue: 'a' },
			minuscule: { label: 'minuscules only', urlValue: 'i' },
			majuscule: { label: 'MAJUSCULES only', urlValue: 'j' },
		},
	},

	alphabets: {
		key: 'enabledAlphabets',
		type: 'alphabetSet',
		urlParam: 'a',
		default: null, // uses alphabets.json isDefaultEnabled
	},

	twentyFourLetter: {
		key: 'twentyFourLetterAlphabet',
		type: 'boolean',
		urlParam: 'l',
		default: false,
	},

	showBaseline: {
		key: 'showBaseline',
		type: 'boolean',
		urlParam: 'b',
		default: true,
	},
};

/**
 * Get option config by key
 */
export const getOptionByKey = key => {
	return Object.values(OPTIONS).find(opt => opt.key === key);
};

/**
 * Get option config by URL param
 */
export const getOptionByUrlParam = param => {
	return Object.values(OPTIONS).find(opt => opt.urlParam === param);
};
