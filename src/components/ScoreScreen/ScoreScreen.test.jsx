import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScoreScreen from './ScoreScreen';

// Mock child components
vi.mock('@components/Button/Button.jsx', () => ({
	default: ({ onClick, label }) => <button onClick={onClick}>{label}</button>,
}));

vi.mock('@components/SmallPrint/SmallPrint.jsx', () => ({
	default: ({ onShowFeedback }) => (
		<div data-testid="small-print">
			<button onClick={onShowFeedback}>Feedback</button>
		</div>
	),
}));

vi.mock('@components/Layout/Layout.jsx', () => ({
	Heading: ({ children }) => <h2>{children}</h2>,
}));

describe('ScoreScreen', () => {
	const mockScore = {
		correct: 8,
		incorrect: 2,
		percentage: 80,
		timeElapsed: 125, // 2 minutes 5 seconds
		mistakes: [],
	};

	it('should render score statistics', () => {
		render(<ScoreScreen score={mockScore} onReturnToMenu={() => {}} />);

		expect(screen.getByText('Correct Answers')).toBeInTheDocument();
		expect(screen.getByText('8')).toBeInTheDocument();
		expect(screen.getByText('Incorrect Answers')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText('Accuracy')).toBeInTheDocument();
		expect(screen.getByText('80%')).toBeInTheDocument();
	});

	it('should format time correctly for minutes and seconds', () => {
		render(<ScoreScreen score={mockScore} onReturnToMenu={() => {}} />);

		expect(screen.getByText('Time Taken')).toBeInTheDocument();
		expect(screen.getByText('2m 5s')).toBeInTheDocument();
	});

	it('should format time correctly for seconds only', () => {
		const score = { ...mockScore, timeElapsed: 45 };
		render(<ScoreScreen score={score} onReturnToMenu={() => {}} />);

		expect(screen.getByText('45s')).toBeInTheDocument();
	});

	it('should call onReturnToMenu when Return to Menu is clicked', async () => {
		const handleReturn = vi.fn();
		const user = userEvent.setup();

		render(<ScoreScreen score={mockScore} onReturnToMenu={handleReturn} />);

		const button = screen.getByRole('button', { name: /return to menu/i });
		await user.click(button);

		expect(handleReturn).toHaveBeenCalledTimes(1);
	});

	it('should not show mistakes section when no mistakes', () => {
		render(<ScoreScreen score={mockScore} onReturnToMenu={() => {}} />);

		expect(screen.queryByText('Letters to Review')).not.toBeInTheDocument();
	});

	it('should show mistakes section when mistakes exist', () => {
		const scoreWithMistakes = {
			...mockScore,
			mistakes: [
				{
					graph: { character: 'A' },
					imagePath: '/images/a.png',
				},
				{
					graph: { character: 'B' },
					imagePath: '/images/b.png',
				},
			],
		};

		render(
			<ScoreScreen score={scoreWithMistakes} onReturnToMenu={() => {}} />
		);

		expect(screen.getByText('Letters to Review')).toBeInTheDocument();
		expect(screen.getByAltText('A')).toBeInTheDocument();
		expect(screen.getByAltText('B')).toBeInTheDocument();
	});

	it('should render mistake images with correct paths', () => {
		const scoreWithMistakes = {
			...mockScore,
			mistakes: [
				{
					graph: { character: 'C' },
					imagePath: '/images/c.png',
				},
			],
		};

		render(
			<ScoreScreen score={scoreWithMistakes} onReturnToMenu={() => {}} />
		);

		const img = screen.getByAltText('C');
		expect(img).toHaveAttribute('src', '/images/c.png');
	});

	it('should render SmallPrint component', () => {
		render(
			<ScoreScreen
				score={mockScore}
				onReturnToMenu={() => {}}
				onShowFeedback={() => {}}
			/>
		);

		expect(screen.getByTestId('small-print')).toBeInTheDocument();
	});

	it('should pass onShowFeedback to SmallPrint', async () => {
		const handleFeedback = vi.fn();
		const user = userEvent.setup();

		render(
			<ScoreScreen
				score={mockScore}
				onReturnToMenu={() => {}}
				onShowFeedback={handleFeedback}
			/>
		);

		const feedbackButton = screen.getByRole('button', {
			name: /feedback/i,
		});
		await user.click(feedbackButton);

		expect(handleFeedback).toHaveBeenCalledTimes(1);
	});

	it('should handle perfect score (100%)', () => {
		const perfectScore = {
			correct: 10,
			incorrect: 0,
			percentage: 100,
			timeElapsed: 60,
			mistakes: [],
		};

		render(<ScoreScreen score={perfectScore} onReturnToMenu={() => {}} />);

		expect(screen.getByText('100%')).toBeInTheDocument();
		expect(screen.getByText('0')).toBeInTheDocument();
	});

	it('should handle score with no correct answers', () => {
		const zeroScore = {
			correct: 0,
			incorrect: 10,
			percentage: 0,
			timeElapsed: 120,
			mistakes: [],
		};

		render(<ScoreScreen score={zeroScore} onReturnToMenu={() => {}} />);

		expect(screen.getByText('0%')).toBeInTheDocument();
		expect(screen.getByText(/^0$/)).toBeInTheDocument(); // correct answers
	});
});
