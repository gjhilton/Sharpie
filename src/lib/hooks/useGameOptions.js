/**
 * useGameOptions hook - access game options from context
 */

import { useGameOptionsContext } from '@context/GameOptionsContext.jsx';

export const useGameOptions = () => {
	return useGameOptionsContext();
};
