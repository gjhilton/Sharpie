/**
 * GameOptionsContext - provides game options derived from URL
 */

import { createContext, useContext, useMemo, useCallback } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { deserializeOptions, serializeOption, getOptionByKey, OPTIONS } from '@lib/options/index.js';

const GameOptionsContext = createContext(null);

export const GameOptionsProvider = ({ children }) => {
	const search = useSearch({ strict: false });
	const navigate = useNavigate();

	const options = useMemo(() => deserializeOptions(search), [search]);

	const updateOption = useCallback((key, value) => {
		// Key can be either the schema key (e.g., 'alphabets') or option.key (e.g., 'enabledAlphabets')
		// First check if it's a schema key
		let schemaKey = key;
		if (!OPTIONS[key]) {
			// Not a schema key, try finding by option.key
			const optionConfig = getOptionByKey(key);
			if (!optionConfig) {
				console.warn(`updateOption called with unknown key: ${key}`);
				return;
			}
			// Find the schema key
			schemaKey = Object.keys(OPTIONS).find(
				k => OPTIONS[k] === optionConfig
			);
		}

		navigate({
			search: prev => ({ ...prev, ...serializeOption(schemaKey, value) }),
			replace: true,
		});
	}, [navigate]);

	const toggleOption = useCallback((key) => {
		const currentValue = options[key];
		if (typeof currentValue !== 'boolean') {
			console.warn(`toggleOption called on non-boolean option: ${key}`);
			return;
		}
		updateOption(key, !currentValue);
	}, [options, updateOption]);

	const cycleMode = useCallback(() => {
		const currentMode = options.mode;
		const modeOrder = ['minuscule', 'majuscule', 'all'];
		const currentIndex = modeOrder.indexOf(currentMode);
		const nextIndex = (currentIndex + 1) % modeOrder.length;
		updateOption('mode', modeOrder[nextIndex]);
	}, [options, updateOption]);

	const resetOptions = useCallback(() => {
		navigate({ search: {}, replace: true });
	}, [navigate]);

	const value = useMemo(
		() => ({ options, updateOption, toggleOption, cycleMode, resetOptions }),
		[options, updateOption, toggleOption, cycleMode, resetOptions]
	);

	return (
		<GameOptionsContext.Provider value={value}>
			{children}
		</GameOptionsContext.Provider>
	);
};

export const useGameOptionsContext = () => {
	const context = useContext(GameOptionsContext);
	if (!context) {
		throw new Error(
			'useGameOptionsContext must be used within GameOptionsProvider'
		);
	}
	return context;
};
