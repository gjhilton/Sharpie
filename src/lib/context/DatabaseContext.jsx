import { createContext, useContext } from 'react';
import { DB } from '@data/DB.js';
import * as db from '@lib/utilities/database.js';

/**
 * DatabaseContext provides access to the DB and database utilities
 * throughout the component tree without requiring direct imports
 */
const DatabaseContext = createContext(null);

/**
 * DatabaseProvider wraps the app and provides DB + utilities
 */
export const DatabaseProvider = ({ children }) => {
	const value = {
		DB,
		...db,
	};

	return (
		<DatabaseContext.Provider value={value}>
			{children}
		</DatabaseContext.Provider>
	);
};

/**
 * useDatabase hook provides access to DB and database utilities
 * @returns {object} Object containing DB and all database utility functions
 */
export const useDatabase = () => {
	const context = useContext(DatabaseContext);
	if (!context) {
		throw new Error('useDatabase must be used within a DatabaseProvider');
	}
	return context;
};
