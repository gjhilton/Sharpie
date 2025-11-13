import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingSectionOptions from './LandingSectionOptions';

describe('LandingSectionOptions', () => {
	const mockOnSelectMode = vi.fn();
	const mockOnShowCatalogue = vi.fn();

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

	it('renders description', () => {
		render(
			<LandingSectionOptions
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);
		expect(screen.getByText(/You can practice just/i)).toBeInTheDocument();
		expect(screen.getAllByText(/minuscules/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/majuscules/i).length).toBeGreaterThan(0);
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
