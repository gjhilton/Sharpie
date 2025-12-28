import {
	createMemoryHistory,
	RouterProvider,
	Outlet,
} from '@tanstack/react-router';
import {
	createRootRoute,
	createRoute,
	createRouter,
} from '@tanstack/react-router';
import { GameOptionsProvider } from '@lib/context/GameOptionsContext';
import { DatabaseProvider } from '@lib/context/DatabaseContext';
import { CatalogueScreen } from './CatalogueScreen';

const StorybookWrapper = ({ children }) => {
	const rootRoute = createRootRoute({
		component: () => (
			<DatabaseProvider>
				<GameOptionsProvider>
					<Outlet />
				</GameOptionsProvider>
			</DatabaseProvider>
		),
		notFoundComponent: () => null,
	});

	const indexRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: '/',
		component: () => children,
	});

	const catalogueRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: '/catalogue',
		component: () => children,
	});

	const feedbackRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: '/feedback',
		component: () => <div>Feedback</div>,
	});

	const routeTree = rootRoute.addChildren([
		indexRoute,
		catalogueRoute,
		feedbackRoute,
	]);

	const memoryHistory = createMemoryHistory({
		initialEntries: ['/'],
	});

	const router = createRouter({
		routeTree,
		history: memoryHistory,
		defaultNotFoundComponent: () => null,
	});

	return <RouterProvider router={router} />;
};

export default {
	title: 'Screens/CatalogueScreen',
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	decorators: [
		Story => (
			<StorybookWrapper>
				<Story />
			</StorybookWrapper>
		),
	],
};

export const Default = {
	render: () => <CatalogueScreen />,
	parameters: {
		docs: {
			description: {
				story: 'The Catalogue Screen showing the hands header image and all available character hands for selection.',
			},
		},
	},
};
