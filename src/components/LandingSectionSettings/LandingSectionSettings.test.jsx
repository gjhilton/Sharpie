import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingSectionSettings from './LandingSectionSettings';

describe('LandingSectionSettings', () => {
	const mockSetTwentyFourLetterAlphabet = vi.fn();

	it('renders section heading', () => {
		render(
			<LandingSectionSettings
				twentyFourLetterAlphabet={false}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		expect(screen.getByText('Settings')).toBeInTheDocument();
	});

	it('renders 24-letter alphabet subsection heading', () => {
		render(
			<LandingSectionSettings
				twentyFourLetterAlphabet={false}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		expect(screen.getByText(/i \/ j & u \/ v/i)).toBeInTheDocument();
	});

	it('renders 24-letter alphabet toggle with correct label', () => {
		render(
			<LandingSectionSettings
				twentyFourLetterAlphabet={false}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		expect(screen.getByLabelText('24-letter alphabet')).toBeInTheDocument();
	});

	it('24-letter alphabet toggle reflects checked state', () => {
		const { rerender } = render(
			<LandingSectionSettings
				twentyFourLetterAlphabet={false}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		const toggle = screen.getByLabelText('24-letter alphabet');
		expect(toggle).toHaveAttribute('aria-checked', 'false');

		rerender(
			<LandingSectionSettings
				twentyFourLetterAlphabet={true}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		expect(toggle).toHaveAttribute('aria-checked', 'true');
	});

	it('24-letter alphabet toggle calls onChange', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionSettings
				twentyFourLetterAlphabet={false}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);

		await user.click(screen.getByLabelText('24-letter alphabet'));
		expect(mockSetTwentyFourLetterAlphabet).toHaveBeenCalledWith(true);
	});

	it('renders alphabet explanation paragraphs', () => {
		render(
			<LandingSectionSettings
				twentyFourLetterAlphabet={false}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		expect(screen.getByText(/During this era, the alphabet had 24 letters/i)).toBeInTheDocument();
		expect(screen.getByText(/When this option is enabled, if you are shown a 'J'/i)).toBeInTheDocument();
	});

	it('renders introduction paragraph', () => {
		render(
			<LandingSectionSettings
				twentyFourLetterAlphabet={false}
				setTwentyFourLetterAlphabet={mockSetTwentyFourLetterAlphabet}
			/>
		);
		expect(
			screen.getByText(/Configure options to customize your experience/i)
		).toBeInTheDocument();
	});
});
