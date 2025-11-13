import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingSectionAlphabet from './LandingSectionAlphabet';

describe('LandingSectionAlphabet', () => {
	const mockSetTwentyFourLetterAlphabet = vi.fn();

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
		const toggle = screen.getByRole('switch');
		expect(toggle).toHaveAttribute('aria-checked', 'false');

		rerender(
			<LandingSectionAlphabet
				twentyFourLetterAlphabet={true}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		expect(toggle).toHaveAttribute('aria-checked', 'true');
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

	it('renders explanation paragraphs', () => {
		render(
			<LandingSectionAlphabet
				twentyFourLetterAlphabet={false}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		expect(screen.getByText(/During this era, the alphabet had 24 letters/i)).toBeInTheDocument();
		expect(screen.getByText(/When this option is enabled/i)).toBeInTheDocument();
	});
});
