/**
 * useGameOptions hook - access game options from context
 */

import { useGameOptionsContext } from '@lib/context/GameOptionsContext.jsx';

export const useGameOptions = () => {
	return useGameOptionsContext();
};
