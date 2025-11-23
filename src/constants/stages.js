export const STAGES = {
	MENU: 'menu',
	PLAYING: 'playing',
	SCORE: 'score',
	CATALOGUE: 'catalogue',
	FEEDBACK: 'feedback',
};

export const GAME_MODES = {
	MAJUSCULE: 'majuscule',
	MINUSCULE: 'minuscule',
	EXTRAS: 'extras',
	ALL: 'all',
};

export const GAME_MODE_OPTIONS = [
	{ value: GAME_MODES.MINUSCULE, label: 'minuscules only' },
	{ value: GAME_MODES.MAJUSCULE, label: 'MAJUSCULES only' },
	{ value: GAME_MODES.ALL, label: 'both minuscules AND MAJUSCULES' },
];

// Character sets for each game mode
export const CHARACTER_SETS = {
	[GAME_MODES.MAJUSCULE]: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	[GAME_MODES.MINUSCULE]: 'abcdefghijklmnopqrstuvwxyz',
	[GAME_MODES.EXTRAS]: '0123456789!@#$%&*(),.?;:\'"-',
	[GAME_MODES.ALL]:
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*(),.?;:\'"-',
};
