/**
 * TanStack Router configuration
 * URL = source of truth for game options
 */

import { lazy, Suspense } from 'react';
import {
	createRouter,
	createRootRoute,
	createRoute,
	Outlet,
} from '@tanstack/react-router';
import { GameOptionsProvider } from '@lib/context/GameOptionsContext.jsx';
import { ErrorBoundary } from '@components/ErrorBoundary/ErrorBoundary.jsx';
import { LoadingScreen } from '@components/LoadingScreen/LoadingScreen.jsx';

// Lazy load screens
const LandingScreen = lazy(
	() => import('@components/LandingScreen/LandingScreen.jsx')
);
const GameScreen = lazy(
	() => import('@components/GameScreen/GameScreen.jsx')
);
const ScoreScreen = lazy(
	() => import('@components/ScoreScreen/ScoreScreen.jsx')
);
const CatalogueScreen = lazy(
	() => import('@components/CatalogueScreen/CatalogueScreen.jsx')
);
const FeedbackScreen = lazy(
	() => import('@components/FeedbackScreen/FeedbackScreen.jsx')
);

// Root layout - wraps all routes with providers
const RootLayout = () => (
	<ErrorBoundary>
		<GameOptionsProvider>
			<Suspense fallback={<LoadingScreen />}>
				<Outlet />
			</Suspense>
		</GameOptionsProvider>
	</ErrorBoundary>
);

// Root route
const rootRoute = createRootRoute({
	component: RootLayout,
});

// Route definitions
const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	component: LandingScreen,
});

const playRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/play',
	component: GameScreen,
});

const scoreRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/score',
	component: ScoreScreen,
});

const catalogueRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/catalogue',
	component: CatalogueScreen,
});

const feedbackRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/feedback',
	component: FeedbackScreen,
});

// Build route tree
const routeTree = rootRoute.addChildren([
	indexRoute,
	playRoute,
	scoreRoute,
	catalogueRoute,
	feedbackRoute,
]);

// Create router instance
export const router = createRouter({
	routeTree,
	basepath: '/Sharpie',
	defaultPreload: 'intent',
});

// Export routes for type-safe navigation
export {
	rootRoute,
	indexRoute,
	playRoute,
	scoreRoute,
	catalogueRoute,
	feedbackRoute,
};
