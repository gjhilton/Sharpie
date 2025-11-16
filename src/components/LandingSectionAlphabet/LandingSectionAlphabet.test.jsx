import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingSectionAlphabet from './LandingSectionAlphabet';

// Mock the markdown import
vi.mock('@data/alphabet.md?raw', () => ({
	default: `First paragraph about *alphabet* history.

{{ALPHABET_TOGGLE}}

Second paragraph about *option* behavior.`
}));

describe('LandingSectionAlphabet', () => {
	const mockSetTwentyFourLetterAlphabet = vi.fn();

	beforeEach(() => {
		mockSetTwentyFourLetterAlphabet.mockClear();
	});

	it('renders section heading', () => {
		render(
			<LandingSectionAlphabet
				twentyFourLetterAlphabet={false}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		expect(screen.getByText(/i \/ j & u \/ v/i)).toBeInTheDocument();
	});

	it('renders toggle with correct label', () => {
		render(
			<LandingSectionAlphabet
				twentyFourLetterAlphabet={false}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		expect(screen.getByLabelText('24-letter alphabet')).toBeInTheDocument();
	});

	it('toggle reflects checked state', () => {
		const { rerender } = render(
			<LandingSectionAlphabet
				twentyFourLetterAlphabet={false}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

		rerender(
			<LandingSectionAlphabet
				twentyFourLetterAlphabet={true}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
	});

	it('toggle calls onChange', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionAlphabet
				twentyFourLetterAlphabet={false}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);

		await user.click(screen.getByRole('switch'));
		expect(mockSetTwentyFourLetterAlphabet).toHaveBeenCalledWith(true);
	});

	it('renders first paragraph from markdown with emphasis', () => {
		render(
			<LandingSectionAlphabet
				twentyFourLetterAlphabet={false}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		expect(screen.getByText(/First paragraph/i)).toBeInTheDocument();
		const emphasisElement = screen.getByText('alphabet');
		expect(emphasisElement.tagName).toBe('EM');
	});

	it('renders second paragraph from markdown', () => {
		render(
			<LandingSectionAlphabet
				twentyFourLetterAlphabet={false}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		expect(screen.getByText(/Second paragraph/i)).toBeInTheDocument();
		const emphasisElement = screen.getByText('option');
		expect(emphasisElement.tagName).toBe('EM');
	});
});
