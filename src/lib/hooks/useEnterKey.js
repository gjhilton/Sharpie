import { useEffect } from 'react';

/**
 * Hook that triggers a callback when Enter key is pressed.
 * Automatically handles event listener setup and cleanup.
 *
 * @param {Function} callback - Function to call when Enter is pressed
 */
const useEnterKey = callback => {
	useEffect(() => {
		const handleKeyDown = e => {
			if (e.key === 'Enter') {
				e.preventDefault();
				callback();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [callback]);
};

export { useEnterKey };
