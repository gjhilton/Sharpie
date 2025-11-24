// Game mode constants still used by gameLogic.js and GamePresentation.jsx
export const GAME_MODES = {
	MAJUSCULE: 'majuscule',
	MINUSCULE: 'minuscule',
	EXTRAS: 'extras',
	ALL: 'all',
};

// Game mode options used by OptionsSection for radio buttons
export const GAME_MODE_OPTIONS = [
	{ value: GAME_MODES.MINUSCULE, label: 'minuscules only' },
	{ value: GAME_MODES.MAJUSCULE, label: 'MAJUSCULES only' },
	{ value: GAME_MODES.ALL, label: 'both minuscules AND MAJUSCULES' },
];
