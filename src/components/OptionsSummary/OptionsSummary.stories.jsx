import { fn } from 'storybook/test';
import { createMemoryHistory, RouterProvider, Outlet } from '@tanstack/react-router';
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { GameOptionsProvider } from '@context/GameOptionsContext.jsx';
import OptionsSummary from './OptionsSummary';

// Wrapper that provides full context stack for OptionsSummary
const StorybookWrapper = ({ children, searchParams = {} }) => {
	// Create a router with GameOptionsProvider in the tree
	const rootRoute = createRootRoute({
		component: () => (
			<GameOptionsProvider>
				<Outlet />
			</GameOptionsProvider>
		),
	});

	const indexRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: '/',
		component: () => children,
	});

	const routeTree = rootRoute.addChildren([indexRoute]);

	const memoryHistory = createMemoryHistory({
		initialEntries: [
			'/' + (Object.keys(searchParams).length ? '?' + new URLSearchParams(searchParams).toString() : ''),
		],
	});

	const router = createRouter({
		routeTree,
		history: memoryHistory,
	});

	return <RouterProvider router={router} />;
};

export default {
	title: 'Components/OptionsSummary',
	component: OptionsSummary,
	tags: ['autodocs'],
	argTypes: {
		options: {
			description: 'Current game options object',
		},
		alphabetCount: {
			control: 'number',
			description: 'Number of enabled alphabets',
		},
	},
	decorators: [
		(Story, context) => (
			<StorybookWrapper searchParams={context.args.searchParams || {}}>
				<div style={{ maxWidth: '600px', padding: '20px' }}>
					<Story />
				</div>
			</StorybookWrapper>
		),
	],
};

// Story: Default settings
export const DefaultSettings = {
	args: {
		options: {
			mode: 'all',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: true,
				Howard: true,
				Joscelyn: true,
			},
			twentyFourLetterAlphabet: true,
			showBaseline: true,
		},
		alphabetCount: 4,
		searchParams: {},
	},
};

// Story: Custom mode (minuscules only)
export const MinusculesOnlyMode = {
	args: {
		options: {
			mode: 'minuscule',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: true,
				Howard: true,
				Joscelyn: true,
			},
			twentyFourLetterAlphabet: true,
			showBaseline: true,
		},
		alphabetCount: 4,
		searchParams: { m: 'i' },
	},
};

// Story: Majuscules only mode
export const MajusculesOnlyMode = {
	args: {
		options: {
			mode: 'majuscule',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: true,
				Howard: true,
				Joscelyn: true,
			},
			twentyFourLetterAlphabet: true,
			showBaseline: true,
		},
		alphabetCount: 4,
		searchParams: { m: 'j' },
	},
};

// Story: Custom alphabets (limited selection)
export const LimitedAlphabets = {
	args: {
		options: {
			mode: 'all',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: false,
				Howard: false,
				Joscelyn: false,
			},
			twentyFourLetterAlphabet: true,
			showBaseline: true,
		},
		alphabetCount: 1,
		searchParams: {},
	},
};

// Story: Single alphabet (test singular label)
export const SingleAlphabet = {
	args: {
		options: {
			mode: 'all',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: false,
				Howard: false,
				Joscelyn: false,
			},
			twentyFourLetterAlphabet: true,
			showBaseline: true,
		},
		alphabetCount: 1,
		searchParams: {},
	},
};

// Story: 26 letters mode
export const TwentySixLetters = {
	args: {
		options: {
			mode: 'all',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: true,
				Howard: true,
				Joscelyn: true,
			},
			twentyFourLetterAlphabet: false,
			showBaseline: true,
		},
		alphabetCount: 4,
		searchParams: { l: '0' },
	},
};

// Story: Baselines off
export const BaselinesOff = {
	args: {
		options: {
			mode: 'all',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: true,
				Howard: true,
				Joscelyn: true,
			},
			twentyFourLetterAlphabet: true,
			showBaseline: false,
		},
		alphabetCount: 4,
		searchParams: { b: '0' },
	},
};

// Story: All custom settings
export const AllCustomSettings = {
	args: {
		options: {
			mode: 'minuscule',
			enabledAlphabets: {
				'BeauChesne-Baildon': true,
				Hill: true,
				Howard: false,
				Joscelyn: false,
			},
			twentyFourLetterAlphabet: false,
			showBaseline: false,
		},
		alphabetCount: 2,
		searchParams: { m: 'i', l: '0', b: '0' },
	},
};
