import { lazy, Suspense } from 'react';
import {
	createRouter,
	createRootRoute,
	createRoute,
	Outlet,
} from '@tanstack/react-router';
import { GameOptionsProvider } from '@lib/context/GameOptionsContext';
import { ErrorBoundary } from '@components/ErrorBoundary/ErrorBoundary';
import { LoadingScreen } from '@components/LoadingScreen/LoadingScreen';

const LandingScreen = lazy(() =>
	import('@components/LandingScreen/LandingScreen').then((m) => ({
		default: m.LandingScreen,
	}))
);
const GameScreen = lazy(() =>
	import('@components/GameScreen/GameScreen').then((m) => ({
		default: m.GameScreen,
	}))
);
const ScoreScreen = lazy(() =>
	import('@components/ScoreScreen/ScoreScreen').then((m) => ({
		default: m.ScoreScreen,
	}))
);
const CatalogueScreen = lazy(() =>
	import('@components/CatalogueScreen/CatalogueScreen').then((m) => ({
		default: m.CatalogueScreen,
	}))
);
const FeedbackScreen = lazy(() =>
	import('@components/FeedbackScreen/FeedbackScreen').then((m) => ({
		default: m.FeedbackScreen,
	}))
);

const BASEPATH = '/Sharpie';
const DEFAULT_PRELOAD = 'intent';
const PATH_ROOT = '/';
const PATH_PLAY = '/play';
const PATH_SCORE = '/score';
const PATH_CATALOGUE = '/catalogue';
const PATH_FEEDBACK = '/feedback';

const RootLayout = () => (
	<ErrorBoundary>
		<GameOptionsProvider>
			<Suspense fallback={<LoadingScreen />}>
				<Outlet />
			</Suspense>
		</GameOptionsProvider>
	</ErrorBoundary>
);

const rootRoute = createRootRoute({
	component: RootLayout,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: PATH_ROOT,
	component: LandingScreen,
});

const playRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: PATH_PLAY,
	component: GameScreen,
});

const scoreRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: PATH_SCORE,
	component: ScoreScreen,
});

const catalogueRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: PATH_CATALOGUE,
	component: CatalogueScreen,
});

const feedbackRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: PATH_FEEDBACK,
	component: FeedbackScreen,
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	playRoute,
	scoreRoute,
	catalogueRoute,
	feedbackRoute,
]);

export const router = createRouter({
	routeTree,
	basepath: BASEPATH,
	defaultPreload: DEFAULT_PRELOAD,
	defaultNotFoundComponent: () => (
		<Suspense fallback={<LoadingScreen />}>
			<LandingScreen />
		</Suspense>
	),
});

export {
	rootRoute,
	indexRoute,
	playRoute,
	scoreRoute,
	catalogueRoute,
	feedbackRoute,
};
