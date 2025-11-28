import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreScreen } from './ScoreScreen.jsx';

// Mock Layout components
vi.mock('@components/Layout/Layout.jsx', () => ({
	Heading: ({ children }) => <h1>{children}</h1>,
}));

// Mock child components
vi.mock('@components/Button/Button.jsx', () => ({
	default: ({ onClick, label }) => (
		<button onClick={onClick} data-testid="mock-button">
			{label}
		</button>
	),
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

vi.mock('@components/CharacterImage/CharacterImage.jsx', () => ({
	default: ({ imagePath, caption }) => (
		<div data-testid={`char-img-${caption}`}>{imagePath}</div>
	),
}));

// Mock router navigate
const mockNavigate = vi.fn();
const mockRouterState = {
	location: {
		state: {},
	},
};

vi.mock('@tanstack/react-router', async () => {
	const actual = await vi.importActual('@tanstack/react-router');
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useRouterState: () => mockRouterState,
	};
});

// Mock useGameOptions hook
vi.mock('@lib/hooks/useGameOptions.js', () => ({
	useGameOptions: () => ({
		options: {
			mode: 'all',
			enabledHands: {},
			twentyFourLetterAlphabet: false,
			showBaseline: true,
		},
		updateOption: vi.fn(),
		updateOptions: vi.fn(),
	}),
}));

describe('ScoreScreen', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset router state
		mockRouterState.location.state = {};
	});

	describe('Score Display', () => {
		it('displays correct score statistics', () => {
			mockRouterState.location.state = {
				score: {
					correct: 15,
					incorrect: 3,
					percentage: 83,
					timeElapsed: 45,
					mistakes: [],
				},
			};

			render(<ScoreScreen />);

			expect(screen.getByText('15')).toBeInTheDocument();
			expect(screen.getByText('3')).toBeInTheDocument();
			expect(screen.getByText('83%')).toBeInTheDocument();
			expect(screen.getByText('45s')).toBeInTheDocument();
		});

		it('formats time correctly with minutes', () => {
			mockRouterState.location.state = {
				score: {
					correct: 10,
					incorrect: 2,
					percentage: 83,
					timeElapsed: 125, // 2m 5s
					mistakes: [],
				},
			};

			render(<ScoreScreen />);

			expect(screen.getByText('2m 5s')).toBeInTheDocument();
		});

		it('handles default scores when no data provided', () => {
			render(<ScoreScreen />);

			expect(screen.getAllByText('0')).toHaveLength(2); // correct and incorrect both show 0
			expect(screen.getByText('0%')).toBeInTheDocument();
			expect(screen.getByText('0s')).toBeInTheDocument();
		});
	});

	describe('Mistakes Display', () => {
		it('displays mistake cards when mistakes exist', () => {
			mockRouterState.location.state = {
				score: {
					correct: 10,
					incorrect: 2,
					percentage: 83,
					timeElapsed: 45,
					mistakes: [
						{
							graph: { character: 'a' },
							imagePath: '/images/a.png',
						},
						{
							graph: { character: 'b' },
							imagePath: '/images/b.png',
						},
					],
				},
			};

			render(<ScoreScreen />);

			expect(screen.getByTestId('char-img-a')).toBeInTheDocument();
			expect(screen.getByTestId('char-img-b')).toBeInTheDocument();
		});

		it('handles empty mistakes array', () => {
			mockRouterState.location.state = {
				score: {
					correct: 10,
					incorrect: 0,
					percentage: 100,
					timeElapsed: 45,
					mistakes: [],
				},
			};

			render(<ScoreScreen />);

			expect(screen.getByText('Correct Answers')).toBeInTheDocument();
			expect(screen.getByText('10')).toBeInTheDocument();
		});
	});

	describe('Component Structure', () => {
		it('renders the score stats', () => {
			render(<ScoreScreen />);

			expect(screen.getByText('Correct Answers')).toBeInTheDocument();
			expect(screen.getByText('Accuracy')).toBeInTheDocument();
		});

		it('renders SmallPrint component', () => {
			render(<ScoreScreen />);

			expect(screen.getByTestId('mock-smallprint')).toBeInTheDocument();
		});

		it('renders navigation button', () => {
			render(<ScoreScreen />);

			expect(screen.getByTestId('mock-button')).toBeInTheDocument();
		});
	});
});
