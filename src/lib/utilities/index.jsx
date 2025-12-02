/**
 * Shared test utilities with pre-configured providers
 */

import { render } from '@testing-library/react';
import {
	createRouter,
	createRootRoute,
	createRoute,
	createMemoryHistory,
	RouterProvider,
} from '@tanstack/react-router';
import { GameOptionsProvider } from '@lib/context/GameOptionsContext.jsx';

/**
 * Create a test router with optional initial path
 */
const createTestRouter = (component, initialPath = '/') => {
	const rootRoute = createRootRoute({
		component: () => <GameOptionsProvider>{component}</GameOptionsProvider>,
	});

	const routeTree = rootRoute.addChildren([
		createRoute({
			getParentRoute: () => rootRoute,
			path: '/',
		}),
		createRoute({
			getParentRoute: () => rootRoute,
			path: '/play',
		}),
		createRoute({
			getParentRoute: () => rootRoute,
			path: '/score',
		}),
		createRoute({
			getParentRoute: () => rootRoute,
			path: '/catalogue',
		}),
		createRoute({
			getParentRoute: () => rootRoute,
			path: '/feedback',
		}),
	]);

	const history = createMemoryHistory({
		initialEntries: [initialPath],
	});

	return createRouter({
		routeTree,
		history,
	});
};

/**
 * Custom render with router and game options providers
 */
export const renderWithProviders = (ui, options = {}) => {
	const { initialPath = '/', ...renderOptions } = options;

	const router = createTestRouter(ui, initialPath);

	const Wrapper = ({ children }) => (
		<RouterProvider router={router}>{children}</RouterProvider>
	);

	return {
		...render(ui, { wrapper: Wrapper, ...renderOptions }),
		router,
	};
};

/**
 * Create mock game options for testing
 * Returns the options object format expected by components
 */
export const createMockOptions = (overrides = {}) => ({
	mode: 'all',
	enabledAlphabets: {
		McKerrow: true,
		PCAttorney: true,
		NBacon: true,
		Howard: true,
		Joscelyn: false,
		'BeauChesne-Baildon': false,
		Hill: false,
	},
	twentyFourLetterAlphabet: false,
	showBaseline: true,
	...overrides,
});

/**
 * Create mock alphabet data for testing
 */
export const createMockAlphabet = (overrides = {}) => ({
	id: '001',
	title: 'Test Alphabet',
	sourceUri: 'https://example.com',
	date: '1900',
	isDefaultEnabled: true,
	difficulty: 'easy',
	...overrides,
});

// Re-export everything from testing-library for convenience
export * from '@testing-library/react';
