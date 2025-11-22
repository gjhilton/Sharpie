import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingSectionHero from './LandingSectionHero';
import { DEFAULT_OPTIONS, OPTIONS_SOURCE } from '@constants/options.js';

// Mock the markdown imports
vi.mock('@data/hero.md?raw', () => ({
	default: `This is the *test body* content with emphasis.`,
}));

vi.mock('@data/identify.md?raw', () => ({
	default: 'Identify content',
}));

vi.mock('@data/alphabet.md?raw', () => ({
	default: 'Alphabet content {{ALPHABET_TOGGLE}}',
}));

vi.mock('@data/baselines.md?raw', () => ({
	default: 'Baselines content {{BASELINE_TOGGLE}} {{BASELINE_EXAMPLES}}',
}));

vi.mock('@data/how-to-use.md?raw', () => ({
	default: 'How to use content',
}));

vi.mock('@data/letters-in-context.md?raw', () => ({
	default: 'Letters in context {{CONTEXT_IMAGE}}',
}));

vi.mock('@data/hints.md?raw', () => ({
	default: 'Hints content',
}));

vi.mock('@data/next-steps.md?raw', () => ({
	default: 'Next steps content',
}));

// Mock the alphabets JSON
vi.mock('@data/alphabets.json', () => ({
	default: {
		'BeauChesne-Baildon': {
			id: 4,
			title: 'BeauChesne-Baildon Title',
			sourceUri: 'https://example.com/source',
		},
	},
}));

// Mock the changelog JSON
vi.mock('@data/changelog.json', () => ({
	default: [{ version: '1.0.0', description: 'Initial release' }],
}));

// Mock database utilities
vi.mock('@utilities/database.js', () => ({
	countEnabledCharacters: vi.fn(() => 196),
	countEnabledAlphabets: vi.fn(() => 5),
}));

// Mock DB
vi.mock('@data/DB.js', () => ({
	DB: [],
}));

describe('LandingSectionHero', () => {
	const mockOnSelectMode = vi.fn();
	const mockOnShowCatalogue = vi.fn();
	const mockSetOption = vi.fn();
	const mockResetOptions = vi.fn();

	const defaultProps = {
		onSelectMode: mockOnSelectMode,
		options: { ...DEFAULT_OPTIONS },
		optionsSource: OPTIONS_SOURCE.DEFAULTS,
		setOption: mockSetOption,
		resetOptions: mockResetOptions,
		enabledAlphabets: { 'BeauChesne-Baildon': true },
		onShowCatalogue: mockOnShowCatalogue,
	};

	beforeEach(() => {
		mockOnSelectMode.mockClear();
		mockOnShowCatalogue.mockClear();
		mockSetOption.mockClear();
		mockResetOptions.mockClear();
	});

	it('renders logo', () => {
		const { container } = render(<LandingSectionHero {...defaultProps} />);
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
		expect(
			screen.getByRole('button', { name: /^play$/i })
		).toBeInTheDocument();
	});

	it('Play button calls onSelectMode', async () => {
		const user = userEvent.setup();
		render(<LandingSectionHero {...defaultProps} />);
		await user.click(screen.getByRole('button', { name: /^play$/i }));
		expect(mockOnSelectMode).toHaveBeenCalled();
	});

	it('renders source link with correct attributes', () => {
		render(<LandingSectionHero {...defaultProps} />);
		const link = screen.getByRole('link', { name: /source/i });
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('renders Options disclosure section', () => {
		render(<LandingSectionHero {...defaultProps} />);
		expect(
			screen.getByRole('button', { name: /options/i })
		).toBeInTheDocument();
	});

	it('renders How to play disclosure section', () => {
		render(<LandingSectionHero {...defaultProps} />);
		expect(
			screen.getByRole('button', { name: /how to play/i })
		).toBeInTheDocument();
	});

	it('renders Next steps for learners disclosure section', () => {
		render(<LandingSectionHero {...defaultProps} />);
		expect(
			screen.getByRole('button', { name: /next steps for learners/i })
		).toBeInTheDocument();
	});

	it("renders What's new disclosure section", () => {
		render(<LandingSectionHero {...defaultProps} />);
		expect(
			screen.getByRole('button', { name: /what.*new/i })
		).toBeInTheDocument();
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

		expect(
			screen.getByRole('button', { name: /choose alphabets/i })
		).toBeInTheDocument();
	});

	it('calls onShowCatalogue when Choose alphabets button is clicked', async () => {
		const user = userEvent.setup();
		render(<LandingSectionHero {...defaultProps} />);

		// Expand Options section
		await user.click(screen.getByRole('button', { name: /options/i }));

		await user.click(
			screen.getByRole('button', { name: /choose alphabets/i })
		);
		expect(mockOnShowCatalogue).toHaveBeenCalled();
	});

	describe('Options summary', () => {
		it('displays OptionsSummary component in Options section', async () => {
			const user = userEvent.setup();
			render(<LandingSectionHero {...defaultProps} />);

			// Expand Options section
			await user.click(screen.getByRole('button', { name: /options/i }));

			// Should show current settings summary
			expect(screen.getByText(/both cases/i)).toBeInTheDocument();
		});

		it('shows reset to defaults link', async () => {
			const user = userEvent.setup();
			render(<LandingSectionHero {...defaultProps} />);

			// Expand Options section
			await user.click(screen.getByRole('button', { name: /options/i }));

			expect(screen.getByText('Reset to defaults')).toBeInTheDocument();
		});

		it('shows copy link to share button', async () => {
			const user = userEvent.setup();
			render(<LandingSectionHero {...defaultProps} />);

			// Expand Options section
			await user.click(screen.getByRole('button', { name: /options/i }));

			expect(screen.getByText('Copy link to share')).toBeInTheDocument();
		});
	});

	describe('Game mode selection', () => {
		it('calls setOption when game mode is changed', async () => {
			const user = userEvent.setup();
			render(<LandingSectionHero {...defaultProps} />);

			// Expand Options section
			await user.click(screen.getByRole('button', { name: /options/i }));

			// Click minuscules only radio
			await user.click(screen.getByLabelText(/minuscules only/i));

			expect(mockSetOption).toHaveBeenCalledWith('gameMode', 'minuscule');
		});
	});
});
