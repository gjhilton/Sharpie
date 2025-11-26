/**
 * GameOptionsContext - provides game options derived from URL
 */

import { createContext, useContext, useMemo, useCallback } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { deserializeOptions, serializeOption } from '@lib/options/index.js';

const GameOptionsContext = createContext(null);

export const GameOptionsProvider = ({ children }) => {
	const search = useSearch({ strict: false });
	const navigate = useNavigate();

	const options = useMemo(() => deserializeOptions(search), [search]);

	const updateOption = useCallback((key, value) => {
		navigate({
			search: prev => ({ ...prev, ...serializeOption(key, value) }),
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
