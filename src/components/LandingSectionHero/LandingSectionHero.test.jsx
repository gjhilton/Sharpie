import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingSectionHero from './LandingSectionHero';

describe('LandingSectionHero', () => {
	const mockOnSelectMode = vi.fn();

	it('renders logo', () => {
		const { container } = render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
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
			/>
		);
		expect(screen.getByText(/Hone your/i)).toBeInTheDocument();
		const secretary = screen.getAllByText(/Secretary/i);
		expect(secretary.length).toBeGreaterThan(0);
	});

	it('renders description paragraph', () => {
		render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
			/>
		);
		expect(
			screen.getByText(/Sharpie helps sharpen your eye/i)
		).toBeInTheDocument();
	});

	it('renders Start button', () => {
		render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
			/>
		);
		expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
	});

	it('Start button calls onSelectMode with correct args', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
			/>
		);
		await user.click(screen.getByRole('button', { name: /start/i }));
		expect(mockOnSelectMode).toHaveBeenCalledWith('all', false);
	});

	it('renders source link with correct attributes', () => {
		render(
			<LandingSectionHero
				onSelectMode={mockOnSelectMode}
				twentyFourLetterAlphabet={false}
			/>
		);
		const link = screen.getByRole('link', { name: /source/i });
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});
});
