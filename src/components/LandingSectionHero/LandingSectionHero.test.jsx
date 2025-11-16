import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingSectionHero from './LandingSectionHero';
import { GAME_MODES } from '@constants/stages.js';

// Mock the markdown import
vi.mock('@data/hero.md?raw', () => ({
	default: `This is the *test body* content with emphasis.`
}));

describe('LandingSectionHero', () => {
	const mockOnSelectMode = vi.fn();

	beforeEach(() => {
		mockOnSelectMode.mockClear();
	});

	it('renders logo', () => {
		const { container } = render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				selectedMode={GAME_MODES.ALL}
			/>
		);
		const logo = container.querySelector('svg');
		expect(logo).toBeInTheDocument();
	});

	it('renders secretary hand GIF with correct alt text', () => {
		render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				selectedMode={GAME_MODES.ALL}
			/>
		);
		const gif = screen.getByAltText('Secretary Hand');
		expect(gif).toBeInTheDocument();
	});

	it('renders title with "Hone your Secretary"', () => {
		render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				selectedMode={GAME_MODES.ALL}
			/>
		);
		expect(screen.getByText(/Hone your/i)).toBeInTheDocument();
		const secretary = screen.getAllByText(/Secretary/i);
		expect(secretary.length).toBeGreaterThan(0);
	});

	it('renders body content from markdown with emphasis', () => {
		render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				selectedMode={GAME_MODES.ALL}
			/>
		);
		// Body should be rendered from markdown
		expect(screen.getByText(/test body/i)).toBeInTheDocument();
		// Check that emphasis is rendered
		const emphasisElement = screen.getByText('test body');
		expect(emphasisElement.tagName).toBe('EM');
	});

	it('renders Start button', () => {
		render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				selectedMode={GAME_MODES.ALL}
			/>
		);
		expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
	});

	it('Start button calls onSelectMode with selectedMode prop', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				selectedMode={GAME_MODES.ALL}
			/>
		);
		await user.click(screen.getByRole('button', { name: /start/i }));
		expect(mockOnSelectMode).toHaveBeenCalledWith(GAME_MODES.ALL, false);
	});

	it('Start button uses MINUSCULE mode when selectedMode is minuscule', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				selectedMode={GAME_MODES.MINUSCULE}
			/>
		);
		await user.click(screen.getByRole('button', { name: /start/i }));
		expect(mockOnSelectMode).toHaveBeenCalledWith(GAME_MODES.MINUSCULE, false);
	});

	it('Start button uses MAJUSCULE mode when selectedMode is majuscule', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				selectedMode={GAME_MODES.MAJUSCULE}
			/>
		);
		await user.click(screen.getByRole('button', { name: /start/i }));
		expect(mockOnSelectMode).toHaveBeenCalledWith(GAME_MODES.MAJUSCULE, false);
	});

	it('Start button passes twentyFourLetterAlphabet correctly', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={true}
				selectedMode={GAME_MODES.ALL}
			/>
		);
		await user.click(screen.getByRole('button', { name: /start/i }));
		expect(mockOnSelectMode).toHaveBeenCalledWith(GAME_MODES.ALL, true);
	});

	it('renders source link with correct attributes', () => {
		render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				selectedMode={GAME_MODES.ALL}
			/>
		);
		const link = screen.getByRole('link', { name: /source/i });
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});
});
