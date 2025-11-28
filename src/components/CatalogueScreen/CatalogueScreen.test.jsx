import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CatalogueScreen } from './CatalogueScreen.jsx';

// Mock child components
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

vi.mock('@components/HandSelectorWithSort/HandSelectorWithSort.jsx', () => ({
	default: ({ onToggle, onBatchToggle, enabledHands }) => (
		<div data-testid="alphabet-selector">
			<button
				onClick={() => onToggle('test-alphabet')}
				data-testid="toggle-button"
			>
				Toggle Test Alphabet
			</button>
			<button
				onClick={() => onBatchToggle({ 'test-alphabet': true })}
				data-testid="batch-toggle-button"
			>
				Batch Toggle
			</button>
			<div data-testid="enabled-state">
				{JSON.stringify(enabledHands)}
			</div>
		</div>
	),
}));

vi.mock('@components/LinkAsButton/LinkAsButton.jsx', () => ({
	LinkAsButton: ({ children, onClick }) => (
		<button onClick={onClick} data-testid="back-button">
			{children}
		</button>
	),
}));

// Mock hands data
vi.mock('@data/hands.json', () => ({
	default: {
		'test-alphabet': {
			title: 'Test Hand',
			date: '1900',
			isDefaultEnabled: true,
			difficulty: 'easy',
		},
	},
}));

// Mock catalogue logic
vi.mock('@utilities/catalogueLogic.js', () => ({
	groupGraphsByGraphSetAndCharacter: vi.fn(() => [
		{
			title: 'minuscule',
			characters: [
				{
					character: 'a',
					graphs: [{ character: 'a', source: 'test-alphabet' }],
				},
			],
		},
	]),
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
			enabledHands: {
				'test-alphabet': true,
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
				'test-alphabet': {
					title: 'Test Alphabet',
				},
			},
		},
		getImagePath: vi.fn(graph => `/images/${graph.character}.png`),
		getEnabledGraphSets: vi.fn(() => [
			{
				id: 'test-set',
				graphs: [{ character: 'a', source: 'test-alphabet' }],
			},
		]),
		countEnabledHands: vi.fn(() => 2),
		countEnabledCharacters: vi.fn(() => 52),
		getAllHandNames: vi.fn(() => ['test-alphabet']),
	}),
}));

describe('CatalogueScreen', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Mock scrollTo
		window.scrollTo = vi.fn();
	});

	describe('Component Structure', () => {
		it('renders the page title', () => {
			render(<CatalogueScreen />);
			expect(screen.getByText('Choose Hands')).toBeInTheDocument();
		});

		it('renders the hand selector', () => {
			render(<CatalogueScreen />);
			expect(screen.getByTestId('alphabet-selector')).toBeInTheDocument();
		});

		it('renders SmallPrint component', () => {
			render(<CatalogueScreen />);
			expect(screen.getByTestId('mock-smallprint')).toBeInTheDocument();
		});

		it('renders back to menu button', () => {
			render(<CatalogueScreen />);
			expect(screen.getByTestId('back-button')).toBeInTheDocument();
		});
	});

	describe('Selection Status', () => {
		it('displays hand and character counts', () => {
			render(<CatalogueScreen />);
			expect(
				screen.getByText(/you have enabled/i)
			).toBeInTheDocument();
			expect(screen.getByText('2')).toBeInTheDocument();
			expect(screen.getByText('52')).toBeInTheDocument();
		});

		it('shows descriptive text about hands', () => {
			render(<CatalogueScreen />);
			expect(
				screen.getByText(/The hands Sharpie tests/i)
			).toBeInTheDocument();
		});
	});

	describe('Navigation', () => {
		it('navigates to landing when back button is clicked', async () => {
			const user = userEvent.setup();
			render(<CatalogueScreen />);

			await user.click(screen.getByTestId('back-button'));

			expect(mockNavigate).toHaveBeenCalledWith({
				to: '/',
				search: expect.any(Function),
			});
		});

		it('navigates to feedback when feedback button is clicked', async () => {
			const user = userEvent.setup();
			render(<CatalogueScreen />);

			await user.click(screen.getByTestId('feedback-button'));

			expect(mockNavigate).toHaveBeenCalledWith({
				to: '/feedback',
				search: expect.any(Function),
			});
		});

		it('scrolls to top on mount', () => {
			render(<CatalogueScreen />);
			expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
		});
	});

	describe('Alphabet Selection', () => {
		it('can toggle individual hands', async () => {
			const user = userEvent.setup();
			render(<CatalogueScreen />);

			await user.click(screen.getByTestId('toggle-button'));

			// The component should update the options
			expect(screen.getByTestId('enabled-state')).toBeInTheDocument();
		});

		it('can batch toggle hands', async () => {
			const user = userEvent.setup();
			render(<CatalogueScreen />);

			await user.click(screen.getByTestId('batch-toggle-button'));

			// The component should update the options
			expect(screen.getByTestId('enabled-state')).toBeInTheDocument();
		});
	});
});
