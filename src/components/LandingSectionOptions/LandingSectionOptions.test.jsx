import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingSectionOptions from './LandingSectionOptions';

// Mock the markdown import
vi.mock('@data/options.md?raw', () => ({
	default: `Practice *lowercase* or *uppercase* characters.`
}));

describe('LandingSectionOptions', () => {
	const mockOnSelectMode = vi.fn();
	const mockOnShowCatalogue = vi.fn();

	beforeEach(() => {
		mockOnSelectMode.mockClear();
		mockOnShowCatalogue.mockClear();
	});

	it('renders section heading', () => {
		render(
			<LandingSectionOptions
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);
		expect(screen.getByText('Options')).toBeInTheDocument();
	});

	it('renders description from markdown with emphasis', () => {
		render(
			<LandingSectionOptions
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);
		expect(screen.getByText(/Practice/i)).toBeInTheDocument();
		const lowercaseEmphasis = screen.getByText('lowercase');
		expect(lowercaseEmphasis.tagName).toBe('EM');
	});

	it('renders both buttons', () => {
		render(
			<LandingSectionOptions
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);
		expect(screen.getByRole('button', { name: /^minuscules$/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /^MAJUSCULES$/i })).toBeInTheDocument();
	});

	it('buttons call onSelectMode correctly', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionOptions
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);

		await user.click(screen.getByRole('button', { name: /^minuscules$/i }));
		expect(mockOnSelectMode).toHaveBeenCalledWith('minuscule', false);

		mockOnSelectMode.mockClear();
		await user.click(screen.getByRole('button', { name: /^MAJUSCULES$/i }));
		expect(mockOnSelectMode).toHaveBeenCalledWith('majuscule', false);
	});

	it('renders catalogue link', () => {
		render(
			<LandingSectionOptions
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);
		expect(screen.getByText(/view all characters/i)).toBeInTheDocument();
	});

	it('catalogue link calls onShowCatalogue', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionOptions
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);

		await user.click(screen.getByRole('link', { name: /view all characters/i }));
		expect(mockOnShowCatalogue).toHaveBeenCalled();
	});
});
