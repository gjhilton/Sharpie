import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LandingScreen } from './LandingScreen.jsx';

// Mock child components
vi.mock('@components/Logo/Logo.jsx', () => ({
	default: () => <div data-testid="mock-logo">Logo</div>,
	SIZE: { S: 's' },
}));

vi.mock('@components/HeroSection/HeroSection.jsx', () => ({
	default: ({ onPlay }) => (
		<div data-testid="mock-hero">
			<button onClick={onPlay} data-testid="play-button">
				Play
			</button>
		</div>
	),
}));

vi.mock('@components/DisclosureSection/DisclosureSection.jsx', () => ({
	default: ({ title, children }) => (
		<div data-testid={`disclosure-${title.toLowerCase().replace(/\s+/g, '-')}`}>
			<h2>{title}</h2>
			{children}
		</div>
	),
}));

vi.mock('@components/OptionsSection/OptionsSection.jsx', () => ({
	default: ({ onShowCatalogue }) => (
		<div data-testid="mock-options">
			<button onClick={onShowCatalogue} data-testid="catalogue-button">
				Choose alphabets
			</button>
		</div>
	),
}));

vi.mock('@components/HowToPlaySection/HowToPlaySection.jsx', () => ({
	default: () => <div data-testid="mock-how-to-play">How to play</div>,
}));

vi.mock('@components/NextStepsSection/NextStepsSection.jsx', () => ({
	default: () => <div data-testid="mock-next-steps">Next steps</div>,
}));

vi.mock('@components/WhatsNewSection/WhatsNewSection.jsx', () => ({
	default: () => <div data-testid="mock-whats-new">What's new</div>,
}));

vi.mock('@components/SmallPrint/SmallPrint.jsx', () => ({
	default: ({ onShowFeedback }) => (
		<div data-testid="mock-smallprint">
			{onShowFeedback && (
				<button onClick={onShowFeedback} data-testid="feedback-button">
					Feedback
				</button>
			)}
		</div>
	),
}));

// Mock database
vi.mock('@data/DB.js', () => ({
	DB: {
		sources: {
			'test-source': {
				title: 'Test Source',
			},
		},
	},
}));

// Mock database utilities
vi.mock('@utilities/database.js', () => ({
	countEnabledAlphabets: vi.fn(() => 5),
	countEnabledCharacters: vi.fn(() => 123),
}));

// Mock router navigate
const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', async () => {
	const actual = await vi.importActual('@tanstack/react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

// Mock useGameOptions hook
vi.mock('@lib/hooks/useGameOptions.js', () => ({
	useGameOptions: () => ({
		options: {
			mode: 'all',
			enabledAlphabets: {
				McKerrow: true,
				PCAttorney: true,
			},
			twentyFourLetterAlphabet: false,
			showBaseline: true,
		},
		updateOption: vi.fn(),
		updateOptions: vi.fn(),
	}),
}));

// Mock database context
vi.mock('@context/DatabaseContext.jsx', () => ({
	useDatabase: () => ({
		DB: {
			sources: {
				'test-source': {
					title: 'Test Source',
				},
			},
		},
		countEnabledCharacters: vi.fn(() => 123),
		countEnabledAlphabets: vi.fn(() => 5),
	}),
}));

describe('LandingScreen', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Component Structure', () => {
		it('renders the logo', () => {
			render(<LandingScreen />);
			expect(screen.getByTestId('mock-logo')).toBeInTheDocument();
		});

		it('renders the hero section', () => {
			render(<LandingScreen />);
			expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
		});

		it('renders all disclosure sections', () => {
			render(<LandingScreen />);
			expect(screen.getByTestId('disclosure-options')).toBeInTheDocument();
			expect(
				screen.getByTestId('disclosure-how-to-play')
			).toBeInTheDocument();
			expect(
				screen.getByTestId('disclosure-next-steps-for-learners')
			).toBeInTheDocument();
			expect(screen.getByTestId("disclosure-what's-new?")).toBeInTheDocument();
		});

		it('renders SmallPrint component', () => {
			render(<LandingScreen />);
			expect(screen.getByTestId('mock-smallprint')).toBeInTheDocument();
		});
	});

	describe('Navigation', () => {
		it('navigates to play screen when play button is clicked', async () => {
			const user = userEvent.setup();
			render(<LandingScreen />);

			await user.click(screen.getByTestId('play-button'));

			expect(mockNavigate).toHaveBeenCalledWith({
				to: '/play',
				search: expect.any(Function),
			});
		});

		it('navigates to catalogue when catalogue button is clicked', async () => {
			const user = userEvent.setup();
			render(<LandingScreen />);

			await user.click(screen.getByTestId('catalogue-button'));

			expect(mockNavigate).toHaveBeenCalledWith({
				to: '/catalogue',
				search: expect.any(Function),
			});
		});

		it('navigates to feedback when feedback button is clicked', async () => {
			const user = userEvent.setup();
			render(<LandingScreen />);

			await user.click(screen.getByTestId('feedback-button'));

			expect(mockNavigate).toHaveBeenCalledWith({
				to: '/feedback',
				search: expect.any(Function),
			});
		});
	});

	describe('Content Sections', () => {
		it('renders options section content', () => {
			render(<LandingScreen />);
			expect(screen.getByTestId('mock-options')).toBeInTheDocument();
		});

		it('renders how to play section content', () => {
			render(<LandingScreen />);
			expect(screen.getByTestId('mock-how-to-play')).toBeInTheDocument();
		});

		it('renders next steps section content', () => {
			render(<LandingScreen />);
			expect(screen.getByTestId('mock-next-steps')).toBeInTheDocument();
		});

		it('renders whats new section content', () => {
			render(<LandingScreen />);
			expect(screen.getByTestId('mock-whats-new')).toBeInTheDocument();
		});
	});
});
