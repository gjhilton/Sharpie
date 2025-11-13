import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App.jsx';

// Mock the screen components
vi.mock('@components/LandingScreen/LandingScreen.jsx', () => ({
	default: ({ onSelectMode, onShowCatalogue, onShowFeedback }) => (
		<div data-testid="landing-screen">
			<button onClick={() => onSelectMode('easy')}>
				Select Easy Mode
			</button>
			<button onClick={onShowCatalogue}>Show Catalogue</button>
			<button onClick={onShowFeedback}>Show Feedback</button>
		</div>
	),
}));

vi.mock('@components/GameScreen/GameScreen.jsx', () => ({
	default: ({ onEndGame, gameMode }) => (
		<div data-testid="game-screen">
			<span data-testid="game-mode">{gameMode}</span>
			<button onClick={() => onEndGame({ points: 100, correct: 10 })}>
				End Game
			</button>
		</div>
	),
}));

vi.mock('@components/ScoreScreen/ScoreScreen.jsx', () => ({
	default: ({ score, onReturnToMenu, onShowFeedback }) => (
		<div data-testid="score-screen">
			<span data-testid="score-data">{JSON.stringify(score)}</span>
			<button onClick={onReturnToMenu}>Return to Menu</button>
			<button onClick={onShowFeedback}>Show Feedback</button>
		</div>
	),
}));

vi.mock('@components/CatalogueScreen/CatalogueScreen.jsx', () => ({
	default: ({ onReturnToMenu, onShowFeedback }) => (
		<div data-testid="catalogue-screen">
			<button onClick={onReturnToMenu}>Return to Menu</button>
			<button onClick={onShowFeedback}>Show Feedback</button>
		</div>
	),
}));

vi.mock('@components/FeedbackScreen/FeedbackScreen.jsx', () => ({
	default: ({ onReturnToMenu, onShowFeedback }) => (
		<div data-testid="feedback-screen">
			<button onClick={onReturnToMenu}>Return to Menu</button>
			<button onClick={onShowFeedback}>Show Feedback</button>
		</div>
	),
}));

// Mock the STAGES constants
vi.mock('@constants/stages.js', () => ({
	STAGES: {
		MENU: 'menu',
		PLAYING: 'playing',
		SCORE: 'score',
		CATALOGUE: 'catalogue',
		FEEDBACK: 'feedback',
	},
}));

describe('App Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Initial Render', () => {
		it('renders LandingScreen by default', () => {
			render(<App />);
			expect(screen.getByTestId('landing-screen')).toBeInTheDocument();
		});

		it('does not render other screens initially', () => {
			render(<App />);
			expect(screen.queryByTestId('game-screen')).not.toBeInTheDocument();
			expect(
				screen.queryByTestId('score-screen')
			).not.toBeInTheDocument();
			expect(
				screen.queryByTestId('catalogue-screen')
			).not.toBeInTheDocument();
			expect(
				screen.queryByTestId('feedback-screen')
			).not.toBeInTheDocument();
		});
	});

	describe('handleSelectMode', () => {
		it('switches to GameScreen when mode is selected', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Select Easy Mode'));

			await waitFor(() => {
				expect(screen.getByTestId('game-screen')).toBeInTheDocument();
			});
			expect(screen.queryByTestId('landing-screen')).not.toBeInTheDocument();
		});

		it('sets gameMode correctly', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Select Easy Mode'));

			expect(screen.getByTestId('game-mode')).toHaveTextContent('easy');
		});

		it('passes gameMode prop to GameScreen', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Select Easy Mode'));

			expect(screen.getByTestId('game-mode')).toBeInTheDocument();
		});
	});

	describe('handleEndGame', () => {
		it('switches to ScoreScreen when game ends', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Select Easy Mode'));
			await waitFor(() => {
				expect(screen.getByTestId('game-screen')).toBeInTheDocument();
			});
			await user.click(screen.getByText('End Game'));

			await waitFor(() => {
				expect(screen.getByTestId('score-screen')).toBeInTheDocument();
			});
			expect(screen.queryByTestId('game-screen')).not.toBeInTheDocument();
		});

		it('sets score data correctly', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Select Easy Mode'));
			await user.click(screen.getByText('End Game'));

			const scoreData = JSON.parse(
				screen.getByTestId('score-data').textContent
			);
			expect(scoreData).toEqual({ points: 100, correct: 10 });
		});

		it('passes score prop to ScoreScreen', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Select Easy Mode'));
			await user.click(screen.getByText('End Game'));

			expect(screen.getByTestId('score-data')).toBeInTheDocument();
		});
	});

	describe('handleReturnToMenu', () => {
		it('switches back to LandingScreen from ScoreScreen', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Select Easy Mode'));
			await user.click(screen.getByText('End Game'));
			await user.click(screen.getByText('Return to Menu'));

			expect(screen.getByTestId('landing-screen')).toBeInTheDocument();
			expect(
				screen.queryByTestId('score-screen')
			).not.toBeInTheDocument();
		});

		it('resets gameMode state', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Select Easy Mode'));
			await user.click(screen.getByText('End Game'));
			await user.click(screen.getByText('Return to Menu'));

			// Navigate back to game screen to verify gameMode is null
			await user.click(screen.getByText('Select Easy Mode'));
			expect(screen.getByTestId('game-mode')).toHaveTextContent('easy');
		});

		it('resets score state', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Select Easy Mode'));
			await user.click(screen.getByText('End Game'));

			// Verify score exists
			expect(screen.getByTestId('score-data')).toHaveTextContent(
				'points'
			);

			await user.click(screen.getByText('Return to Menu'));
			await user.click(screen.getByText('Select Easy Mode'));
			await user.click(screen.getByText('End Game'));

			// Verify new score is set
			expect(screen.getByTestId('score-data')).toHaveTextContent(
				'points'
			);
		});

		it('switches back to LandingScreen from CatalogueScreen', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Show Catalogue'));
			await waitFor(() => {
				expect(screen.getByTestId('catalogue-screen')).toBeInTheDocument();
			});
			await user.click(screen.getByText('Return to Menu'));

			await waitFor(() => {
				expect(screen.getByTestId('landing-screen')).toBeInTheDocument();
			});
			expect(
				screen.queryByTestId('catalogue-screen')
			).not.toBeInTheDocument();
		});

		it('switches back to LandingScreen from FeedbackScreen', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Show Feedback'));
			await waitFor(() => {
				expect(screen.getByTestId('feedback-screen')).toBeInTheDocument();
			});
			await user.click(screen.getByText('Return to Menu'));

			await waitFor(() => {
				expect(screen.getByTestId('landing-screen')).toBeInTheDocument();
			});
			expect(
				screen.queryByTestId('feedback-screen')
			).not.toBeInTheDocument();
		});
	});

	describe('handleShowCatalogue', () => {
		it('switches to CatalogueScreen', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Show Catalogue'));

			expect(screen.getByTestId('catalogue-screen')).toBeInTheDocument();
			expect(screen.queryByTestId('landing-screen')).not.toBeInTheDocument();
		});
	});

	describe('handleShowFeedback', () => {
		it('switches to FeedbackScreen from LandingScreen', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Show Feedback'));

			expect(screen.getByTestId('feedback-screen')).toBeInTheDocument();
			expect(screen.queryByTestId('landing-screen')).not.toBeInTheDocument();
		});

		it('switches to FeedbackScreen from ScoreScreen', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Select Easy Mode'));
			await user.click(screen.getByText('End Game'));

			const feedbackButtons = screen.getAllByText('Show Feedback');
			await user.click(feedbackButtons[0]);

			expect(screen.getByTestId('feedback-screen')).toBeInTheDocument();
			expect(
				screen.queryByTestId('score-screen')
			).not.toBeInTheDocument();
		});

		it('switches to FeedbackScreen from CatalogueScreen', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Show Catalogue'));

			const feedbackButtons = screen.getAllByText('Show Feedback');
			await user.click(feedbackButtons[0]);

			expect(screen.getByTestId('feedback-screen')).toBeInTheDocument();
			expect(
				screen.queryByTestId('catalogue-screen')
			).not.toBeInTheDocument();
		});
	});

	describe('Stage Rendering', () => {
		it('renders LandingScreen for MENU stage', () => {
			render(<App />);
			expect(screen.getByTestId('landing-screen')).toBeInTheDocument();
		});

		it('renders GameScreen for PLAYING stage', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Select Easy Mode'));

			expect(screen.getByTestId('game-screen')).toBeInTheDocument();
		});

		it('renders ScoreScreen for SCORE stage', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Select Easy Mode'));
			await user.click(screen.getByText('End Game'));

			expect(screen.getByTestId('score-screen')).toBeInTheDocument();
		});

		it('renders CatalogueScreen for CATALOGUE stage', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Show Catalogue'));

			expect(screen.getByTestId('catalogue-screen')).toBeInTheDocument();
		});

		it('renders FeedbackScreen for FEEDBACK stage', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Show Feedback'));

			expect(screen.getByTestId('feedback-screen')).toBeInTheDocument();
		});
	});

	describe('Callback Props', () => {
		it('passes onSelectMode callback to LandingScreen', () => {
			render(<App />);
			expect(screen.getByText('Select Easy Mode')).toBeInTheDocument();
		});

		it('passes onShowCatalogue callback to LandingScreen', () => {
			render(<App />);
			expect(screen.getByText('Show Catalogue')).toBeInTheDocument();
		});

		it('passes onShowFeedback callback to LandingScreen', () => {
			render(<App />);
			expect(screen.getByText('Show Feedback')).toBeInTheDocument();
		});

		it('passes onEndGame and gameMode props to GameScreen', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Select Easy Mode'));

			expect(screen.getByText('End Game')).toBeInTheDocument();
			expect(screen.getByTestId('game-mode')).toBeInTheDocument();
		});

		it('passes score, onReturnToMenu, and onShowFeedback props to ScoreScreen', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Select Easy Mode'));
			await user.click(screen.getByText('End Game'));

			expect(screen.getByTestId('score-data')).toBeInTheDocument();
			expect(screen.getByText('Return to Menu')).toBeInTheDocument();
			expect(screen.getByText('Show Feedback')).toBeInTheDocument();
		});

		it('passes onReturnToMenu and onShowFeedback props to CatalogueScreen', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Show Catalogue'));

			expect(screen.getByText('Return to Menu')).toBeInTheDocument();
			expect(screen.getByText('Show Feedback')).toBeInTheDocument();
		});

		it('passes onReturnToMenu and onShowFeedback props to FeedbackScreen', async () => {
			const user = userEvent.setup();
			render(<App />);

			await user.click(screen.getByText('Show Feedback'));

			expect(screen.getByText('Return to Menu')).toBeInTheDocument();
			expect(screen.getByText('Show Feedback')).toBeInTheDocument();
		});
	});

	describe('Navigation Flows', () => {
		describe('Menu → Game → Score → Menu', () => {
			it('completes the full game flow', async () => {
				const user = userEvent.setup();
				render(<App />);

				// Start at Menu
				expect(screen.getByTestId('landing-screen')).toBeInTheDocument();

				// Navigate to Game
				await user.click(screen.getByText('Select Easy Mode'));
				expect(screen.getByTestId('game-screen')).toBeInTheDocument();
				expect(
					screen.queryByTestId('landing-screen')
				).not.toBeInTheDocument();

				// Navigate to Score
				await user.click(screen.getByText('End Game'));
				expect(screen.getByTestId('score-screen')).toBeInTheDocument();
				expect(
					screen.queryByTestId('game-screen')
				).not.toBeInTheDocument();

				// Return to Menu
				await user.click(screen.getByText('Return to Menu'));
				expect(screen.getByTestId('landing-screen')).toBeInTheDocument();
				expect(
					screen.queryByTestId('score-screen')
				).not.toBeInTheDocument();
			});

			it('maintains correct state through game flow', async () => {
				const user = userEvent.setup();
				render(<App />);

				await user.click(screen.getByText('Select Easy Mode'));
				expect(screen.getByTestId('game-mode')).toHaveTextContent(
					'easy'
				);

				await user.click(screen.getByText('End Game'));
				const scoreData = JSON.parse(
					screen.getByTestId('score-data').textContent
				);
				expect(scoreData).toEqual({ points: 100, correct: 10 });

				await user.click(screen.getByText('Return to Menu'));
				expect(screen.getByTestId('landing-screen')).toBeInTheDocument();
			});
		});

		describe('Menu → Catalogue → Menu', () => {
			it('navigates to Catalogue and back', async () => {
				const user = userEvent.setup();
				render(<App />);

				// Start at Menu
				expect(screen.getByTestId('landing-screen')).toBeInTheDocument();

				// Navigate to Catalogue
				await user.click(screen.getByText('Show Catalogue'));
				expect(
					screen.getByTestId('catalogue-screen')
				).toBeInTheDocument();
				expect(
					screen.queryByTestId('landing-screen')
				).not.toBeInTheDocument();

				// Return to Menu
				await user.click(screen.getByText('Return to Menu'));
				expect(screen.getByTestId('landing-screen')).toBeInTheDocument();
				expect(
					screen.queryByTestId('catalogue-screen')
				).not.toBeInTheDocument();
			});
		});

		describe('Menu → Feedback → Menu', () => {
			it('navigates to Feedback and back', async () => {
				const user = userEvent.setup();
				render(<App />);

				// Start at Menu
				expect(screen.getByTestId('landing-screen')).toBeInTheDocument();

				// Navigate to Feedback
				await user.click(screen.getByText('Show Feedback'));
				expect(
					screen.getByTestId('feedback-screen')
				).toBeInTheDocument();
				expect(
					screen.queryByTestId('landing-screen')
				).not.toBeInTheDocument();

				// Return to Menu
				await user.click(screen.getByText('Return to Menu'));
				expect(screen.getByTestId('landing-screen')).toBeInTheDocument();
				expect(
					screen.queryByTestId('feedback-screen')
				).not.toBeInTheDocument();
			});
		});

		describe('Complex Navigation Flows', () => {
			it('navigates Menu → Catalogue → Feedback → Menu', async () => {
				const user = userEvent.setup();
				render(<App />);

				await user.click(screen.getByText('Show Catalogue'));
				expect(
					screen.getByTestId('catalogue-screen')
				).toBeInTheDocument();

				const feedbackButtons = screen.getAllByText('Show Feedback');
				await user.click(feedbackButtons[0]);
				expect(
					screen.getByTestId('feedback-screen')
				).toBeInTheDocument();

				await user.click(screen.getByText('Return to Menu'));
				expect(screen.getByTestId('landing-screen')).toBeInTheDocument();
			});

			it('navigates Menu → Game → Score → Feedback → Menu', async () => {
				const user = userEvent.setup();
				render(<App />);

				await user.click(screen.getByText('Select Easy Mode'));
				await user.click(screen.getByText('End Game'));
				expect(screen.getByTestId('score-screen')).toBeInTheDocument();

				const feedbackButtons = screen.getAllByText('Show Feedback');
				await user.click(feedbackButtons[0]);
				expect(
					screen.getByTestId('feedback-screen')
				).toBeInTheDocument();

				await user.click(screen.getByText('Return to Menu'));
				expect(screen.getByTestId('landing-screen')).toBeInTheDocument();
			});

			it('allows multiple game sessions', async () => {
				const user = userEvent.setup();
				render(<App />);

				// First game session
				await user.click(screen.getByText('Select Easy Mode'));
				await user.click(screen.getByText('End Game'));
				await user.click(screen.getByText('Return to Menu'));

				// Second game session
				await user.click(screen.getByText('Select Easy Mode'));
				expect(screen.getByTestId('game-screen')).toBeInTheDocument();
				await user.click(screen.getByText('End Game'));
				expect(screen.getByTestId('score-screen')).toBeInTheDocument();
			});
		});
	});
});
