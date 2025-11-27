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
		badge: {
			order: 1,
			renderLabel: value => {
				const labels = {
					all: { min: '✓', maj: '✓' },
					minuscule: { min: '✓', maj: '✗' },
					majuscule: { min: '✗', maj: '✓' },
				};
				const { min, maj } = labels[value] || labels.all;
				return {
					text: 'minuscules',
					icon: min,
					text2: 'MAJUSCULES',
					icon2: maj,
				};
			},
			action: 'cycle',
		},
	},

	alphabets: {
		key: 'enabledAlphabets',
		type: 'alphabetSet',
		urlParam: 'a',
		default: null, // uses alphabets.json isDefaultEnabled
		badge: {
			order: 2,
			renderLabel: (value, { alphabetCount }) => ({
				text: 'Alphabets',
				value: alphabetCount,
			}),
			action: 'navigate',
			navigationPath: '/catalogue',
		},
	},

	numLetters: {
		key: 'numLetters',
		type: 'boolean',
		urlParam: 'l',
		default: true,
		badge: {
			order: 3,
			renderLabel: value => ({
				text: 'Letters',
				value: value ? '24' : '26',
			}),
			action: 'toggle',
		},
	},

	showBaseline: {
		key: 'showBaseline',
		type: 'boolean',
		urlParam: 'b',
		default: true,
		badge: {
			order: 4,
			renderLabel: value => ({
				text: 'Baseline',
				icon: value ? '✓' : '✗',
			}),
			action: 'toggle',
		},
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
