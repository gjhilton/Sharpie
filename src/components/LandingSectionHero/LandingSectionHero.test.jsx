import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingSectionHero from './LandingSectionHero';
import { GAME_MODES } from '@constants/stages.js';

// Mock the markdown imports
vi.mock('@data/hero.md?raw', () => ({
	default: `This is the *test body* content with emphasis.`
}));

vi.mock('@data/identify.md?raw', () => ({
	default: 'Identify content'
}));

vi.mock('@data/alphabet.md?raw', () => ({
	default: 'Alphabet content {{ALPHABET_TOGGLE}}'
}));

vi.mock('@data/baselines.md?raw', () => ({
	default: 'Baselines content {{BASELINE_TOGGLE}} {{BASELINE_EXAMPLES}}'
}));

vi.mock('@data/how-to-use.md?raw', () => ({
	default: 'How to use content'
}));

vi.mock('@data/letters-in-context.md?raw', () => ({
	default: 'Letters in context {{CONTEXT_IMAGE}}'
}));

vi.mock('@data/hints.md?raw', () => ({
	default: 'Hints content'
}));

vi.mock('@data/next-steps.md?raw', () => ({
	default: 'Next steps content'
}));

// Mock the alphabets JSON
vi.mock('@data/alphabets.json', () => ({
	default: {
		'BeauChesne-Baildon': {
			title: 'BeauChesne-Baildon Title',
			sourceUri: 'https://example.com/source'
		}
	}
}));

// Mock the changelog JSON
vi.mock('@data/changelog.json', () => ({
	default: [
		{ version: '1.0.0', description: 'Initial release' }
	]
}));

// Mock database utilities
vi.mock('@utilities/database.js', () => ({
	countEnabledCharacters: vi.fn(() => 196),
	countEnabledAlphabets: vi.fn(() => 5)
}));

// Mock DB
vi.mock('@data/DB.js', () => ({
	DB: []
}));

describe('LandingSectionHero', () => {
	const mockOnSelectMode = vi.fn();
	const mockOnShowCatalogue = vi.fn();
	const mockSetTwentyFourLetterAlphabet = vi.fn();
	const mockSetSelectedMode = vi.fn();
	const mockSetShowBaseline = vi.fn();

	const defaultProps = {
		onSelectMode: mockOnSelectMode,
		twentyFourLetterAlphabet: false,
		setTwentyFourLetterAlphabet: mockSetTwentyFourLetterAlphabet,
		selectedMode: GAME_MODES.ALL,
		setSelectedMode: mockSetSelectedMode,
		enabledAlphabets: { 'BeauChesne-Baildon': true },
		onShowCatalogue: mockOnShowCatalogue,
		showBaseline: true,
		setShowBaseline: mockSetShowBaseline
	};

	beforeEach(() => {
		mockOnSelectMode.mockClear();
		mockOnShowCatalogue.mockClear();
		mockSetTwentyFourLetterAlphabet.mockClear();
		mockSetSelectedMode.mockClear();
		mockSetShowBaseline.mockClear();
	});

	it('renders logo', () => {
		const { container } = render(
			<LandingSectionHero {...defaultProps} />
		);
		const logo = container.querySelector('svg');
		expect(logo).toBeInTheDocument();
	});

	it('renders secretary hand GIF with correct alt text', () => {
		render(<LandingSectionHero {...defaultProps} />);
		const gif = screen.getByAltText('Secretary Hand');
		expect(gif).toBeInTheDocument();
	});

	it('renders title with "Hone your Secretary"', () => {
		render(<LandingSectionHero {...defaultProps} />);
		expect(screen.getByText(/Hone your/i)).toBeInTheDocument();
		const secretary = screen.getAllByText(/Secretary/i);
		expect(secretary.length).toBeGreaterThan(0);
	});

	it('renders body content from markdown with emphasis', () => {
		render(<LandingSectionHero {...defaultProps} />);
		// Body should be rendered from markdown
		expect(screen.getByText(/test body/i)).toBeInTheDocument();
		// Check that emphasis is rendered
		const emphasisElement = screen.getByText('test body');
		expect(emphasisElement.tagName).toBe('EM');
	});

	it('renders Play button', () => {
		render(<LandingSectionHero {...defaultProps} />);
		expect(screen.getByRole('button', { name: /^play$/i })).toBeInTheDocument();
	});

	it('Play button calls onSelectMode with selectedMode prop', async () => {
		const user = userEvent.setup();
		render(<LandingSectionHero {...defaultProps} />);
		await user.click(screen.getByRole('button', { name: /^play$/i }));
		expect(mockOnSelectMode).toHaveBeenCalledWith(GAME_MODES.ALL, false);
	});

	it('Play button uses MINUSCULE mode when selectedMode is minuscule', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionHero {...defaultProps} selectedMode={GAME_MODES.MINUSCULE} />
		);
		await user.click(screen.getByRole('button', { name: /^play$/i }));
		expect(mockOnSelectMode).toHaveBeenCalledWith(GAME_MODES.MINUSCULE, false);
	});

	it('Play button uses MAJUSCULE mode when selectedMode is majuscule', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionHero {...defaultProps} selectedMode={GAME_MODES.MAJUSCULE} />
		);
		await user.click(screen.getByRole('button', { name: /^play$/i }));
		expect(mockOnSelectMode).toHaveBeenCalledWith(GAME_MODES.MAJUSCULE, false);
	});

	it('Play button passes twentyFourLetterAlphabet correctly', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionHero {...defaultProps} twentyFourLetterAlphabet={true} />
		);
		await user.click(screen.getByRole('button', { name: /^play$/i }));
		expect(mockOnSelectMode).toHaveBeenCalledWith(GAME_MODES.ALL, true);
	});

	it('renders source link with correct attributes', () => {
		render(<LandingSectionHero {...defaultProps} />);
		const link = screen.getByRole('link', { name: /source/i });
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('renders Options disclosure section', () => {
		render(<LandingSectionHero {...defaultProps} />);
		expect(screen.getByRole('button', { name: /options/i })).toBeInTheDocument();
	});

	it('renders How to play disclosure section', () => {
		render(<LandingSectionHero {...defaultProps} />);
		expect(screen.getByRole('button', { name: /how to play/i })).toBeInTheDocument();
	});

	it('renders Next steps for learners disclosure section', () => {
		render(<LandingSectionHero {...defaultProps} />);
		expect(screen.getByRole('button', { name: /next steps for learners/i })).toBeInTheDocument();
	});

	it('renders What\'s new disclosure section', () => {
		render(<LandingSectionHero {...defaultProps} />);
		expect(screen.getByRole('button', { name: /what.*new/i })).toBeInTheDocument();
	});

	it('displays question bank statistics', async () => {
		const user = userEvent.setup();
		render(<LandingSectionHero {...defaultProps} />);

		// Expand Options section
		await user.click(screen.getByRole('button', { name: /options/i }));

		expect(screen.getByText(/Question bank:/i)).toBeInTheDocument();
		expect(screen.getByText('196')).toBeInTheDocument();
		expect(screen.getByText('5')).toBeInTheDocument();
	});

	it('renders Choose alphabets button', async () => {
		const user = userEvent.setup();
		render(<LandingSectionHero {...defaultProps} />);

		// Expand Options section
		await user.click(screen.getByRole('button', { name: /options/i }));

		expect(screen.getByRole('button', { name: /choose alphabets/i })).toBeInTheDocument();
	});

	it('calls onShowCatalogue when Choose alphabets button is clicked', async () => {
		const user = userEvent.setup();
		render(<LandingSectionHero {...defaultProps} />);

		// Expand Options section
		await user.click(screen.getByRole('button', { name: /options/i }));

		await user.click(screen.getByRole('button', { name: /choose alphabets/i }));
		expect(mockOnShowCatalogue).toHaveBeenCalled();
	});
});
