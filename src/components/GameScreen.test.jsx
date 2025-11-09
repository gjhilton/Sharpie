import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GameScreen from './GameScreen.jsx';

// Mock GamePresentation component
vi.mock('./GamePresentation.jsx', () => ({
	GamePresentation: ({
		currentSolution,
		attempt,
		attemptImagePaths,
		attemptStatus,
		initialKeyboardLayout,
		onKeyPress,
		onNextLetter,
		onEndGame,
	}) => (
		<div data-testid="game-presentation">
			<div data-testid="current-solution">
				{currentSolution?.graph?.character}
			</div>
			<div data-testid="attempt">{attempt}</div>
			<div data-testid="attempt-status">{attemptStatus}</div>
			<div data-testid="attempt-image-paths">
				{attemptImagePaths.join(',')}
			</div>
			<div data-testid="keyboard-layout">
				{JSON.stringify(initialKeyboardLayout)}
			</div>
			<button onClick={() => onKeyPress('a')} data-testid="key-press-btn">
				Press Key
			</button>
			<button onClick={onNextLetter} data-testid="next-letter-btn">
				Next Letter
			</button>
			<button onClick={onEndGame} data-testid="end-game-btn">
				End Game
			</button>
		</div>
	),
}));

// Mock DB
vi.mock('../data/DB.js', () => ({
	DB: {
		graphs: [
			{
				character: 'a',
				shorthand: ['img1.png', 'img2.png'],
			},
			{
				character: 'b',
				shorthand: ['img3.png', 'img4.png'],
			},
			{
				character: 'c',
				shorthand: ['img5.png', 'img6.png'],
			},
		],
	},
}));

// Mock gameLogic
const mockGetGraphsForGameMode = vi.fn();
const mockCreateRandomSolution = vi.fn();
const mockShouldCreateNewSolution = vi.fn();
const mockCheckAttempt = vi.fn();
const mockCreateHistoryEntry = vi.fn();
const mockCalculateGameStats = vi.fn();
const mockProcessIncorrectAttempts = vi.fn();
const mockCreateAttempt = vi.fn();
const mockGetInitialKeyboardLayout = vi.fn();

vi.mock('../utilities/gameLogic.js', () => ({
	STATUS: {
		NONE: 'none',
		CORRECT: 'correct',
		INCORRECT: 'incorrect',
	},
	getGraphsForGameMode: (...args) => mockGetGraphsForGameMode(...args),
	createRandomSolution: (...args) => mockCreateRandomSolution(...args),
	shouldCreateNewSolution: (...args) => mockShouldCreateNewSolution(...args),
	checkAttempt: (...args) => mockCheckAttempt(...args),
	createHistoryEntry: (...args) => mockCreateHistoryEntry(...args),
	calculateGameStats: (...args) => mockCalculateGameStats(...args),
	processIncorrectAttempts: (...args) =>
		mockProcessIncorrectAttempts(...args),
	createAttempt: (...args) => mockCreateAttempt(...args),
	getInitialKeyboardLayout: (...args) =>
		mockGetInitialKeyboardLayout(...args),
}));

describe('GameScreen', () => {
	const mockOnEndGame = vi.fn();
	const mockGraphs = [
		{ character: 'a', shorthand: ['img1.png', 'img2.png'] },
		{ character: 'b', shorthand: ['img3.png', 'img4.png'] },
	];
	const mockSolution = {
		graph: { character: 'a', shorthand: ['img1.png', 'img2.png'] },
		imagePath: 'img1.png',
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Setup default mock implementations
		mockGetGraphsForGameMode.mockReturnValue(mockGraphs);
		mockCreateRandomSolution.mockReturnValue(mockSolution);
		mockShouldCreateNewSolution.mockReturnValue(false);
		mockCheckAttempt.mockReturnValue('correct');
		mockCreateHistoryEntry.mockReturnValue({
			solution: mockSolution,
			attempt: 'a',
			correct: true,
		});
		mockCalculateGameStats.mockReturnValue({
			correctCount: 5,
			incorrectCount: 2,
			duration: 60000,
		});
		mockProcessIncorrectAttempts.mockReturnValue([]);
		mockCreateAttempt.mockReturnValue({
			character: 'a',
			imagePaths: ['img1.png', 'img2.png'],
		});
		mockGetInitialKeyboardLayout.mockReturnValue([
			['a', 'b', 'c'],
			['d', 'e', 'f'],
		]);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Initial Rendering', () => {
		it('should render GamePresentation component', () => {
			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			expect(screen.getByTestId('game-presentation')).toBeInTheDocument();
		});

		it('should initialize with correct solution', () => {
			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			expect(screen.getByTestId('current-solution')).toHaveTextContent(
				'a'
			);
		});

		it('should initialize with null attempt', () => {
			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			expect(screen.getByTestId('attempt')).toHaveTextContent('');
		});

		it('should initialize with NONE status', () => {
			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			expect(screen.getByTestId('attempt-status')).toHaveTextContent(
				'none'
			);
		});

		it('should pass gameMode to getGraphsForGameMode', () => {
			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="advanced" />
			);

			expect(mockGetGraphsForGameMode).toHaveBeenCalledWith(
				expect.anything(),
				'advanced'
			);
		});

		it('should pass gameMode to getInitialKeyboardLayout', () => {
			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="advanced" />
			);

			expect(mockGetInitialKeyboardLayout).toHaveBeenCalledWith(
				'advanced'
			);
		});
	});

	describe('handleKeyPress', () => {
		it('should update attempt state when key is pressed', async () => {
			const user = userEvent.setup();
			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			const keyPressBtn = screen.getByTestId('key-press-btn');
			await user.click(keyPressBtn);

			expect(screen.getByTestId('attempt')).toHaveTextContent('a');
		});

		it('should call createAttempt with correct parameters', async () => {
			const user = userEvent.setup();
			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			const keyPressBtn = screen.getByTestId('key-press-btn');
			await user.click(keyPressBtn);

			expect(mockCreateAttempt).toHaveBeenCalledWith('a', mockGraphs);
		});

		it('should update attemptImagePaths from createAttempt result', async () => {
			const user = userEvent.setup();
			mockCreateAttempt.mockReturnValue({
				character: 'a',
				imagePaths: ['path1.png', 'path2.png'],
			});

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			const keyPressBtn = screen.getByTestId('key-press-btn');
			await user.click(keyPressBtn);

			expect(screen.getByTestId('attempt-image-paths')).toHaveTextContent(
				'path1.png,path2.png'
			);
		});
	});

	describe('handleNextLetter', () => {
		it('should reset attempt to null', async () => {
			const user = userEvent.setup();
			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			// First press a key
			await user.click(screen.getByTestId('key-press-btn'));
			expect(screen.getByTestId('attempt')).toHaveTextContent('a');

			// Then click next letter
			await user.click(screen.getByTestId('next-letter-btn'));
			expect(screen.getByTestId('attempt')).toHaveTextContent('');
		});

		it('should reset attemptStatus to NONE', async () => {
			const user = userEvent.setup();
			mockCheckAttempt.mockReturnValue('correct');

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			// Press a key to trigger status change
			await user.click(screen.getByTestId('key-press-btn'));

			// Wait for status to update
			await waitFor(() => {
				expect(screen.getByTestId('attempt-status')).toHaveTextContent(
					'correct'
				);
			});

			// Click next letter
			await user.click(screen.getByTestId('next-letter-btn'));

			expect(screen.getByTestId('attempt-status')).toHaveTextContent(
				'none'
			);
		});

		it('should reset attemptImagePaths to empty array', async () => {
			const user = userEvent.setup();
			mockCreateAttempt.mockReturnValue({
				character: 'a',
				imagePaths: ['img1.png', 'img2.png'],
			});

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			// Press a key
			await user.click(screen.getByTestId('key-press-btn'));
			expect(screen.getByTestId('attempt-image-paths')).toHaveTextContent(
				'img1.png,img2.png'
			);

			// Click next letter
			await user.click(screen.getByTestId('next-letter-btn'));
			expect(screen.getByTestId('attempt-image-paths')).toHaveTextContent(
				''
			);
		});
	});

	describe('handleEndGame', () => {
		it('should call onEndGame with stats and mistakes', async () => {
			const user = userEvent.setup();
			const mockStats = {
				correctCount: 10,
				incorrectCount: 3,
				duration: 120000,
			};
			const mockMistakes = [{ character: 'a', incorrectAttempts: ['b'] }];

			mockCalculateGameStats.mockReturnValue(mockStats);
			mockProcessIncorrectAttempts.mockReturnValue(mockMistakes);

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			await user.click(screen.getByTestId('end-game-btn'));

			expect(mockOnEndGame).toHaveBeenCalledWith({
				...mockStats,
				mistakes: mockMistakes,
			});
		});

		it('should call calculateGameStats with correct parameters', async () => {
			const user = userEvent.setup();
			mockCheckAttempt.mockReturnValue('correct');

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			// Simulate some correct answers
			await user.click(screen.getByTestId('key-press-btn'));
			await waitFor(() => {
				expect(mockCheckAttempt).toHaveBeenCalled();
			});

			await user.click(screen.getByTestId('end-game-btn'));

			expect(mockCalculateGameStats).toHaveBeenCalledWith(
				1, // correctCount
				0, // incorrectCount
				expect.any(Number) // startTime
			);
		});

		it('should call processIncorrectAttempts with history', async () => {
			const user = userEvent.setup();

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			await user.click(screen.getByTestId('key-press-btn'));
			await waitFor(() => {
				expect(mockCreateHistoryEntry).toHaveBeenCalled();
			});

			await user.click(screen.getByTestId('end-game-btn'));

			expect(mockProcessIncorrectAttempts).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({
						solution: mockSolution,
						attempt: 'a',
						correct: true,
					}),
				])
			);
		});
	});

	describe('Correct Answers', () => {
		it('should increment correctCount when answer is correct', async () => {
			const user = userEvent.setup();
			mockCheckAttempt.mockReturnValue('correct');

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			// Press a key
			await user.click(screen.getByTestId('key-press-btn'));

			// Wait for check to happen
			await waitFor(() => {
				expect(mockCheckAttempt).toHaveBeenCalled();
			});

			// End game to verify count
			await user.click(screen.getByTestId('end-game-btn'));

			expect(mockCalculateGameStats).toHaveBeenCalledWith(
				1,
				0,
				expect.any(Number)
			);
		});

		it('should call checkAttempt with correct parameters', async () => {
			const user = userEvent.setup();
			mockCheckAttempt.mockReturnValue('correct');

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			await user.click(screen.getByTestId('key-press-btn'));

			await waitFor(() => {
				expect(mockCheckAttempt).toHaveBeenCalledWith('a', 'a');
			});
		});

		it('should create history entry for correct answer', async () => {
			const user = userEvent.setup();
			mockCheckAttempt.mockReturnValue('correct');

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			await user.click(screen.getByTestId('key-press-btn'));

			await waitFor(() => {
				expect(mockCreateHistoryEntry).toHaveBeenCalledWith(
					mockSolution,
					'a',
					true
				);
			});
		});
	});

	describe('Incorrect Answers', () => {
		it('should increment incorrectCount when answer is incorrect', async () => {
			const user = userEvent.setup();
			mockCheckAttempt.mockReturnValue('incorrect');

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			await user.click(screen.getByTestId('key-press-btn'));

			await waitFor(() => {
				expect(mockCheckAttempt).toHaveBeenCalled();
			});

			await user.click(screen.getByTestId('end-game-btn'));

			expect(mockCalculateGameStats).toHaveBeenCalledWith(
				0,
				1,
				expect.any(Number)
			);
		});

		it('should create history entry for incorrect answer', async () => {
			const user = userEvent.setup();
			mockCheckAttempt.mockReturnValue('incorrect');
			mockCreateHistoryEntry.mockReturnValue({
				solution: mockSolution,
				attempt: 'b',
				correct: false,
			});

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			await user.click(screen.getByTestId('key-press-btn'));

			await waitFor(() => {
				expect(mockCreateHistoryEntry).toHaveBeenCalledWith(
					mockSolution,
					'a',
					false
				);
			});
		});

		it('should update attemptStatus to INCORRECT', async () => {
			const user = userEvent.setup();
			mockCheckAttempt.mockReturnValue('incorrect');

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			await user.click(screen.getByTestId('key-press-btn'));

			await waitFor(() => {
				expect(screen.getByTestId('attempt-status')).toHaveTextContent(
					'incorrect'
				);
			});
		});
	});

	describe('New Solution Creation', () => {
		it('should create new solution when shouldCreateNewSolution returns true', async () => {
			const user = userEvent.setup();
			const newSolution = {
				graph: { character: 'b', shorthand: ['img3.png', 'img4.png'] },
				imagePath: 'img3.png',
			};

			mockShouldCreateNewSolution.mockReturnValue(false);
			mockCheckAttempt.mockReturnValue('correct');

			const { rerender } = render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			// Clear the initial call
			mockCreateRandomSolution.mockClear();

			// Now return true for new solution
			mockShouldCreateNewSolution.mockReturnValue(true);
			mockCreateRandomSolution.mockReturnValue(newSolution);

			// Press a key to trigger attempt
			await user.click(screen.getByTestId('key-press-btn'));

			// Wait for the effect to trigger
			await waitFor(() => {
				expect(mockShouldCreateNewSolution).toHaveBeenCalled();
			});

			// Should have created a new solution
			await waitFor(() => {
				expect(mockCreateRandomSolution).toHaveBeenCalledWith(
					mockGraphs
				);
			});
		});

		it('should call shouldCreateNewSolution with attempt and status', async () => {
			const user = userEvent.setup();
			mockCheckAttempt.mockReturnValue('correct');

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			await user.click(screen.getByTestId('key-press-btn'));

			await waitFor(() => {
				expect(mockShouldCreateNewSolution).toHaveBeenCalledWith(
					'a',
					'correct'
				);
			});
		});

		it('should call shouldCreateNewSolution to determine if new solution is needed', async () => {
			const user = userEvent.setup();
			// Make shouldCreateNewSolution return false after the first answer
			mockShouldCreateNewSolution.mockReturnValue(false);

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			// Press a key to set an attempt
			await user.click(screen.getByTestId('key-press-btn'));

			// Wait for state updates
			await waitFor(() => {
				expect(screen.getByTestId('attempt')).toHaveTextContent('a');
			});

			// Verify shouldCreateNewSolution was called to check if new solution is needed
			expect(mockShouldCreateNewSolution).toHaveBeenCalled();
		});
	});

	describe('Game Mode Integration', () => {
		it('should pass gameMode to getGraphsForGameMode', () => {
			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="beginner" />
			);

			expect(mockGetGraphsForGameMode).toHaveBeenCalledWith(
				expect.anything(),
				'beginner'
			);
		});

		it('should use graphs from getGraphsForGameMode for createAttempt', async () => {
			const user = userEvent.setup();
			const customGraphs = [
				{ character: 'x', shorthand: ['imgX.png'] },
				{ character: 'y', shorthand: ['imgY.png'] },
			];
			mockGetGraphsForGameMode.mockReturnValue(customGraphs);

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="advanced" />
			);

			await user.click(screen.getByTestId('key-press-btn'));

			expect(mockCreateAttempt).toHaveBeenCalledWith('a', customGraphs);
		});

		it('should use graphs from getGraphsForGameMode for createRandomSolution', () => {
			const customGraphs = [
				{ character: 'x', shorthand: ['imgX.png'] },
				{ character: 'y', shorthand: ['imgY.png'] },
			];
			mockGetGraphsForGameMode.mockReturnValue(customGraphs);

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="advanced" />
			);

			expect(mockCreateRandomSolution).toHaveBeenCalledWith(customGraphs);
		});
	});

	describe('Multiple Attempts', () => {
		it('should track multiple correct answers', async () => {
			const user = userEvent.setup();
			mockCheckAttempt.mockReturnValue('correct');

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			// First attempt
			await user.click(screen.getByTestId('key-press-btn'));
			await waitFor(() => expect(mockCheckAttempt).toHaveBeenCalled());

			// Reset for next attempt
			await user.click(screen.getByTestId('next-letter-btn'));

			// Second attempt
			mockCheckAttempt.mockClear();
			await user.click(screen.getByTestId('key-press-btn'));
			await waitFor(() => expect(mockCheckAttempt).toHaveBeenCalled());

			// End game
			await user.click(screen.getByTestId('end-game-btn'));

			expect(mockCalculateGameStats).toHaveBeenCalledWith(
				2,
				0,
				expect.any(Number)
			);
		});

		it('should track mixed correct and incorrect answers', async () => {
			const user = userEvent.setup();

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			// Correct attempt
			mockCheckAttempt.mockReturnValue('correct');
			await user.click(screen.getByTestId('key-press-btn'));
			await waitFor(() => expect(mockCheckAttempt).toHaveBeenCalled());
			await user.click(screen.getByTestId('next-letter-btn'));

			// Incorrect attempt
			mockCheckAttempt.mockReturnValue('incorrect');
			mockCheckAttempt.mockClear();
			await user.click(screen.getByTestId('key-press-btn'));
			await waitFor(() => expect(mockCheckAttempt).toHaveBeenCalled());

			// End game
			await user.click(screen.getByTestId('end-game-btn'));

			expect(mockCalculateGameStats).toHaveBeenCalledWith(
				1,
				1,
				expect.any(Number)
			);
		});

		it('should accumulate history entries for all attempts', async () => {
			const user = userEvent.setup();
			mockCheckAttempt.mockReturnValue('correct');

			render(
				<GameScreen onEndGame={mockOnEndGame} gameMode="standard" />
			);

			// First attempt
			await user.click(screen.getByTestId('key-press-btn'));
			await waitFor(() =>
				expect(mockCreateHistoryEntry).toHaveBeenCalled()
			);

			await user.click(screen.getByTestId('next-letter-btn'));

			// Second attempt
			mockCreateHistoryEntry.mockClear();
			await user.click(screen.getByTestId('key-press-btn'));
			await waitFor(() =>
				expect(mockCreateHistoryEntry).toHaveBeenCalled()
			);

			// End game
			await user.click(screen.getByTestId('end-game-btn'));

			expect(mockProcessIncorrectAttempts).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({
						solution: mockSolution,
						attempt: 'a',
						correct: true,
					}),
					expect.objectContaining({
						solution: mockSolution,
						attempt: 'a',
						correct: true,
					}),
				])
			);
		});
	});
});
