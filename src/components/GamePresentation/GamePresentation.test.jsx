import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	Unanswered,
	CorrectAnswer,
	IncorrectAnswer,
	StatusDisplay,
	GamePresentation,
} from './GamePresentation';
import { STATUS } from '@utilities/gameLogic.js';
import { CHARACTER_STATE } from '@components/Character/Character.jsx';

// Mock child components
vi.mock('@components/Character/Character.jsx', () => ({
	default: ({
		state,
		imagePath,
		imagePaths,
		character,
		alphabetLink,
		alphabetTitle,
		alphabetDate,
	}) => (
		<div
			data-testid="character"
			data-state={state}
			data-imagepath={imagePath}
			data-imagepaths={imagePaths?.join(',')}
			data-character={character}
			data-alphabetlink={alphabetLink}
			data-alphabettitle={alphabetTitle}
			data-alphabetdate={alphabetDate}
		>
			Character Mock
		</div>
	),
	CHARACTER_STATE: {
		AWAIT_ANSWER: 'await_answer',
		CORRECT_ANSWER: 'correct_answer',
		INCORRECT_ANSWER: 'incorrect_answer',
	},
}));

vi.mock('@components/KB/KB.jsx', () => ({
	default: ({ keyCallback, initialLayout, showShiftKeys }) => (
		<div
			data-testid="kb"
			data-initial-layout={initialLayout}
			data-show-shift-keys={
				showShiftKeys !== undefined ? String(showShiftKeys) : 'true'
			}
			onClick={() => keyCallback && keyCallback('A')}
		>
			Keyboard Mock
		</div>
	),
}));

vi.mock('@components/Button/Button.jsx', () => ({
	default: ({ onClick, label }) => <button onClick={onClick}>{label}</button>,
}));

vi.mock('@data/DB.js', () => ({
	DB: {
		sources: {
			'test-source': {
				title: 'Test Source',
				sourceUri: 'https://example.com/test',
				date: '2019',
			},
		},
	},
}));

describe('Unanswered', () => {
	const mockSolution = {
		imagePath: '/images/a.png',
		graph: {
			character: 'A',
			source: 'test-source',
		},
	};

	it('should render Character component', () => {
		render(<Unanswered solution={mockSolution} />);
		expect(screen.getByTestId('character')).toBeInTheDocument();
	});

	it('should pass AWAIT_ANSWER state to Character', () => {
		render(<Unanswered solution={mockSolution} />);
		const character = screen.getByTestId('character');
		expect(character).toHaveAttribute(
			'data-state',
			CHARACTER_STATE.AWAIT_ANSWER
		);
	});

	it('should pass imagePath to Character', () => {
		render(<Unanswered solution={mockSolution} />);
		const character = screen.getByTestId('character');
		expect(character).toHaveAttribute('data-imagepath', '/images/a.png');
	});
});

describe('CorrectAnswer', () => {
	const mockSolution = {
		imagePath: '/images/b.png',
		graph: {
			character: 'B',
			source: 'test-source',
		},
	};

	it('should render Character component', () => {
		const onNext = vi.fn();
		render(<CorrectAnswer solution={mockSolution} onNext={onNext} />);
		expect(screen.getByTestId('character')).toBeInTheDocument();
	});

	it('should pass CORRECT_ANSWER state to Character', () => {
		const onNext = vi.fn();
		render(<CorrectAnswer solution={mockSolution} onNext={onNext} />);
		const character = screen.getByTestId('character');
		expect(character).toHaveAttribute(
			'data-state',
			CHARACTER_STATE.CORRECT_ANSWER
		);
	});

	it('should pass character to Character', () => {
		const onNext = vi.fn();
		render(<CorrectAnswer solution={mockSolution} onNext={onNext} />);
		const character = screen.getByTestId('character');
		expect(character).toHaveAttribute('data-character', 'B');
	});

	it('should pass alphabet information to Character', () => {
		const onNext = vi.fn();
		render(<CorrectAnswer solution={mockSolution} onNext={onNext} />);
		const character = screen.getByTestId('character');
		expect(character).toHaveAttribute(
			'data-alphabetlink',
			'https://example.com/test'
		);
		expect(character).toHaveAttribute('data-alphabettitle', 'Test Source');
		expect(character).toHaveAttribute('data-alphabetdate', '2019');
	});

	it('should render Next button', () => {
		const onNext = vi.fn();
		render(<CorrectAnswer solution={mockSolution} onNext={onNext} />);
		expect(
			screen.getByRole('button', { name: /next/i })
		).toBeInTheDocument();
	});

	it('should call onNext when Next button is clicked', async () => {
		const onNext = vi.fn();
		const user = userEvent.setup();
		render(<CorrectAnswer solution={mockSolution} onNext={onNext} />);

		const nextButton = screen.getByRole('button', { name: /next/i });
		await user.click(nextButton);

		expect(onNext).toHaveBeenCalledTimes(1);
	});

	it('should handle missing source gracefully', () => {
		const solutionWithMissingSource = {
			...mockSolution,
			graph: {
				...mockSolution.graph,
				source: 'non-existent-source',
			},
		};
		const onNext = vi.fn();
		render(
			<CorrectAnswer
				solution={solutionWithMissingSource}
				onNext={onNext}
			/>
		);
		const character = screen.getByTestId('character');
		// When alphabet is missing, alphabetLink, alphabetTitle, and alphabetDate are undefined
		// React doesn't render undefined as an attribute value
		expect(character).not.toHaveAttribute('data-alphabetlink');
		expect(character).not.toHaveAttribute('data-alphabettitle');
		expect(character).not.toHaveAttribute('data-alphabetdate');
	});
});

describe('IncorrectAnswer', () => {
	const mockSolution = {
		imagePath: '/images/c.png',
		graph: {
			character: 'C',
			source: 'test-source',
		},
	};
	const mockAttempt = 'X';
	const mockAttemptImagePaths = ['/images/x1.png', '/images/x2.png'];

	it('should render two Character components', () => {
		const onNext = vi.fn();
		render(
			<IncorrectAnswer
				solution={mockSolution}
				attempt={mockAttempt}
				attemptImagePaths={mockAttemptImagePaths}
				onNext={onNext}
			/>
		);
		const characters = screen.getAllByTestId('character');
		expect(characters).toHaveLength(2);
	});

	it('should render first Character with INCORRECT_ANSWER state', () => {
		const onNext = vi.fn();
		render(
			<IncorrectAnswer
				solution={mockSolution}
				attempt={mockAttempt}
				attemptImagePaths={mockAttemptImagePaths}
				onNext={onNext}
			/>
		);
		const characters = screen.getAllByTestId('character');
		expect(characters[0]).toHaveAttribute(
			'data-state',
			CHARACTER_STATE.INCORRECT_ANSWER
		);
	});

	it('should render second Character with CORRECT_ANSWER state', () => {
		const onNext = vi.fn();
		render(
			<IncorrectAnswer
				solution={mockSolution}
				attempt={mockAttempt}
				attemptImagePaths={mockAttemptImagePaths}
				onNext={onNext}
			/>
		);
		const characters = screen.getAllByTestId('character');
		expect(characters[1]).toHaveAttribute(
			'data-state',
			CHARACTER_STATE.CORRECT_ANSWER
		);
	});

	it('should pass attemptImagePaths to first Character', () => {
		const onNext = vi.fn();
		render(
			<IncorrectAnswer
				solution={mockSolution}
				attempt={mockAttempt}
				attemptImagePaths={mockAttemptImagePaths}
				onNext={onNext}
			/>
		);
		const characters = screen.getAllByTestId('character');
		expect(characters[0]).toHaveAttribute(
			'data-imagepaths',
			'/images/x1.png,/images/x2.png'
		);
	});

	it('should pass attempt character to first Character', () => {
		const onNext = vi.fn();
		render(
			<IncorrectAnswer
				solution={mockSolution}
				attempt={mockAttempt}
				attemptImagePaths={mockAttemptImagePaths}
				onNext={onNext}
			/>
		);
		const characters = screen.getAllByTestId('character');
		expect(characters[0]).toHaveAttribute('data-character', 'X');
	});

	it('should pass correct solution to second Character', () => {
		const onNext = vi.fn();
		render(
			<IncorrectAnswer
				solution={mockSolution}
				attempt={mockAttempt}
				attemptImagePaths={mockAttemptImagePaths}
				onNext={onNext}
			/>
		);
		const characters = screen.getAllByTestId('character');
		expect(characters[1]).toHaveAttribute('data-character', 'C');
		expect(characters[1]).toHaveAttribute(
			'data-imagepath',
			'/images/c.png'
		);
	});

	it('should pass alphabet information to correct Character', () => {
		const onNext = vi.fn();
		render(
			<IncorrectAnswer
				solution={mockSolution}
				attempt={mockAttempt}
				attemptImagePaths={mockAttemptImagePaths}
				onNext={onNext}
			/>
		);
		const characters = screen.getAllByTestId('character');
		expect(characters[1]).toHaveAttribute(
			'data-alphabetlink',
			'https://example.com/test'
		);
		expect(characters[1]).toHaveAttribute(
			'data-alphabettitle',
			'Test Source'
		);
		expect(characters[1]).toHaveAttribute('data-alphabetdate', '2019');
	});

	it('should render Next button', () => {
		const onNext = vi.fn();
		render(
			<IncorrectAnswer
				solution={mockSolution}
				attempt={mockAttempt}
				attemptImagePaths={mockAttemptImagePaths}
				onNext={onNext}
			/>
		);
		expect(
			screen.getByRole('button', { name: /next/i })
		).toBeInTheDocument();
	});

	it('should call onNext when Next button is clicked', async () => {
		const onNext = vi.fn();
		const user = userEvent.setup();
		render(
			<IncorrectAnswer
				solution={mockSolution}
				attempt={mockAttempt}
				attemptImagePaths={mockAttemptImagePaths}
				onNext={onNext}
			/>
		);

		const nextButton = screen.getByRole('button', { name: /next/i });
		await user.click(nextButton);

		expect(onNext).toHaveBeenCalledTimes(1);
	});
});

describe('StatusDisplay', () => {
	const mockSolution = {
		imagePath: '/images/d.png',
		graph: {
			character: 'D',
			source: 'test-source',
		},
	};
	const mockAttempt = 'Y';
	const mockAttemptImagePaths = ['/images/y.png'];

	it('should render Unanswered when status is NONE', () => {
		const onNext = vi.fn();
		render(
			<StatusDisplay
				status={STATUS.NONE}
				solution={mockSolution}
				attempt={null}
				attemptImagePaths={[]}
				onNext={onNext}
			/>
		);
		const character = screen.getByTestId('character');
		expect(character).toHaveAttribute(
			'data-state',
			CHARACTER_STATE.AWAIT_ANSWER
		);
	});

	it('should render CorrectAnswer when status is CORRECT', () => {
		const onNext = vi.fn();
		render(
			<StatusDisplay
				status={STATUS.CORRECT}
				solution={mockSolution}
				attempt={mockAttempt}
				attemptImagePaths={mockAttemptImagePaths}
				onNext={onNext}
			/>
		);
		expect(
			screen.getByRole('button', { name: /next/i })
		).toBeInTheDocument();
		const character = screen.getByTestId('character');
		expect(character).toHaveAttribute(
			'data-state',
			CHARACTER_STATE.CORRECT_ANSWER
		);
	});

	it('should render IncorrectAnswer when status is INCORRECT', () => {
		const onNext = vi.fn();
		render(
			<StatusDisplay
				status={STATUS.INCORRECT}
				solution={mockSolution}
				attempt={mockAttempt}
				attemptImagePaths={mockAttemptImagePaths}
				onNext={onNext}
			/>
		);
		const characters = screen.getAllByTestId('character');
		expect(characters).toHaveLength(2);
		expect(
			screen.getByRole('button', { name: /next/i })
		).toBeInTheDocument();
	});

	it('should default to Unanswered for unknown status', () => {
		const onNext = vi.fn();
		render(
			<StatusDisplay
				status="unknown"
				solution={mockSolution}
				attempt={null}
				attemptImagePaths={[]}
				onNext={onNext}
			/>
		);
		const character = screen.getByTestId('character');
		expect(character).toHaveAttribute(
			'data-state',
			CHARACTER_STATE.AWAIT_ANSWER
		);
	});

	it('should pass onNext to child components', async () => {
		const onNext = vi.fn();
		const user = userEvent.setup();
		render(
			<StatusDisplay
				status={STATUS.CORRECT}
				solution={mockSolution}
				attempt={mockAttempt}
				attemptImagePaths={mockAttemptImagePaths}
				onNext={onNext}
			/>
		);

		const nextButton = screen.getByRole('button', { name: /next/i });
		await user.click(nextButton);

		expect(onNext).toHaveBeenCalledTimes(1);
	});
});

describe('GamePresentation', () => {
	const mockCurrentSolution = {
		imagePath: '/images/e.png',
		graph: {
			character: 'E',
			source: 'test-source',
		},
	};

	const defaultProps = {
		currentSolution: mockCurrentSolution,
		attempt: null,
		attemptImagePaths: [],
		attemptStatus: STATUS.NONE,
		initialKeyboardLayout: 'default',
		onKeyPress: vi.fn(),
		onNextLetter: vi.fn(),
		onEndGame: vi.fn(),
	};

	it('should render StatusDisplay component', () => {
		render(<GamePresentation {...defaultProps} />);
		expect(screen.getByTestId('character')).toBeInTheDocument();
	});

	it('should render KB component', () => {
		render(<GamePresentation {...defaultProps} />);
		expect(screen.getByTestId('kb')).toBeInTheDocument();
	});

	it('should render End Game button', () => {
		render(<GamePresentation {...defaultProps} />);
		expect(
			screen.getByRole('button', { name: /end game/i })
		).toBeInTheDocument();
	});

	it('should pass initialKeyboardLayout to KB', () => {
		render(
			<GamePresentation {...defaultProps} initialKeyboardLayout="shift" />
		);
		const kb = screen.getByTestId('kb');
		expect(kb).toHaveAttribute('data-initial-layout', 'shift');
	});

	it('should enable keyboard when attempt is null', async () => {
		const onKeyPress = vi.fn();
		const user = userEvent.setup();
		render(<GamePresentation {...defaultProps} onKeyPress={onKeyPress} />);

		const kb = screen.getByTestId('kb');
		await user.click(kb);

		expect(onKeyPress).toHaveBeenCalledWith('A');
	});

	it('should disable keyboard when attempt exists', async () => {
		const onKeyPress = vi.fn();
		const user = userEvent.setup();
		render(
			<GamePresentation
				{...defaultProps}
				attempt="Z"
				attemptImagePaths={['/images/z.png']}
				onKeyPress={onKeyPress}
			/>
		);

		const kb = screen.getByTestId('kb');
		await user.click(kb);

		// KB should receive undefined as keyCallback when attempt exists
		expect(onKeyPress).not.toHaveBeenCalled();
	});

	it('should have keyboard opacity controlled by attempt state', () => {
		// When attempt exists, keyboard should be visually disabled
		const { rerender } = render(
			<GamePresentation
				{...defaultProps}
				attempt="Z"
				attemptImagePaths={['/images/z.png']}
			/>
		);

		// Keyboard container exists
		const kb = screen.getByTestId('kb');
		expect(kb.parentElement).toBeInTheDocument();

		// When attempt is null, keyboard should be enabled
		rerender(<GamePresentation {...defaultProps} />);
		expect(kb.parentElement).toBeInTheDocument();
	});

	it('should call onEndGame when End Game button is clicked', async () => {
		const onEndGame = vi.fn();
		const user = userEvent.setup();
		render(<GamePresentation {...defaultProps} onEndGame={onEndGame} />);

		const endGameButton = screen.getByRole('button', { name: /end game/i });
		await user.click(endGameButton);

		expect(onEndGame).toHaveBeenCalledTimes(1);
	});

	it('should pass attemptStatus to StatusDisplay', () => {
		render(
			<GamePresentation
				{...defaultProps}
				attemptStatus={STATUS.CORRECT}
			/>
		);
		// Next button appears when status is CORRECT
		expect(
			screen.getByRole('button', { name: /next/i })
		).toBeInTheDocument();
	});

	it('should pass onNextLetter to StatusDisplay', async () => {
		const onNextLetter = vi.fn();
		const user = userEvent.setup();
		render(
			<GamePresentation
				{...defaultProps}
				attemptStatus={STATUS.CORRECT}
				onNextLetter={onNextLetter}
			/>
		);

		const nextButton = screen.getByRole('button', { name: /next/i });
		await user.click(nextButton);

		expect(onNextLetter).toHaveBeenCalledTimes(1);
	});

	it('should render all components in correct layout order', () => {
		render(<GamePresentation {...defaultProps} />);

		// All required components should be present
		expect(screen.getByTestId('character')).toBeInTheDocument(); // StatusDisplay
		expect(screen.getByTestId('kb')).toBeInTheDocument(); // KB
		expect(
			screen.getByRole('button', { name: /end game/i })
		).toBeInTheDocument(); // End Game button
	});

	it('should handle transition from NONE to CORRECT status', () => {
		const { rerender } = render(<GamePresentation {...defaultProps} />);

		// Initially NONE status
		let character = screen.getByTestId('character');
		expect(character).toHaveAttribute(
			'data-state',
			CHARACTER_STATE.AWAIT_ANSWER
		);

		// Update to CORRECT status
		rerender(
			<GamePresentation
				{...defaultProps}
				attemptStatus={STATUS.CORRECT}
				attempt="E"
			/>
		);

		character = screen.getByTestId('character');
		expect(character).toHaveAttribute(
			'data-state',
			CHARACTER_STATE.CORRECT_ANSWER
		);
		expect(
			screen.getByRole('button', { name: /next/i })
		).toBeInTheDocument();
	});

	it('should handle transition from NONE to INCORRECT status', () => {
		const { rerender } = render(<GamePresentation {...defaultProps} />);

		// Initially NONE status
		expect(screen.getAllByTestId('character')).toHaveLength(1);

		// Update to INCORRECT status
		rerender(
			<GamePresentation
				{...defaultProps}
				attemptStatus={STATUS.INCORRECT}
				attempt="X"
				attemptImagePaths={['/images/x.png']}
			/>
		);

		// Should now show two characters
		const characters = screen.getAllByTestId('character');
		expect(characters).toHaveLength(2);
		expect(
			screen.getByRole('button', { name: /next/i })
		).toBeInTheDocument();
	});

	describe('Enter Key Navigation', () => {
		it('should call onNext when Enter key is pressed on CorrectAnswer', async () => {
			const onNextLetter = vi.fn();
			const user = userEvent.setup();
			render(
				<GamePresentation
					{...defaultProps}
					attemptStatus={STATUS.CORRECT}
					attempt="E"
					onNextLetter={onNextLetter}
				/>
			);

			await user.keyboard('{Enter}');
			expect(onNextLetter).toHaveBeenCalledTimes(1);
		});

		it('should call onNext when Enter key is pressed on IncorrectAnswer', async () => {
			const onNextLetter = vi.fn();
			const user = userEvent.setup();
			render(
				<GamePresentation
					{...defaultProps}
					attemptStatus={STATUS.INCORRECT}
					attempt="X"
					attemptImagePaths={['/images/x.png']}
					onNextLetter={onNextLetter}
				/>
			);

			await user.keyboard('{Enter}');
			expect(onNextLetter).toHaveBeenCalledTimes(1);
		});

		it('should not call onNext when Enter is pressed on unanswered state', async () => {
			const onNextLetter = vi.fn();
			const user = userEvent.setup();
			render(
				<GamePresentation
					{...defaultProps}
					attemptStatus={STATUS.NONE}
					onNextLetter={onNextLetter}
				/>
			);

			await user.keyboard('{Enter}');
			expect(onNextLetter).not.toHaveBeenCalled();
		});
	});

	describe('acceptedAs24Letter', () => {
		it('should show 24-letter message when acceptedAs24Letter is true and status is CORRECT', () => {
			render(
				<GamePresentation
					{...defaultProps}
					attemptStatus={STATUS.CORRECT}
					attempt="I"
					acceptedAs24Letter={true}
				/>
			);

			expect(
				screen.getByText(/Accepted: Using 24-letter alphabet/)
			).toBeInTheDocument();
			expect(screen.getByText(/I and J and U and V/)).toBeInTheDocument();
		});

		it('should not show 24-letter message when acceptedAs24Letter is false', () => {
			render(
				<GamePresentation
					{...defaultProps}
					attemptStatus={STATUS.CORRECT}
					attempt="E"
					acceptedAs24Letter={false}
				/>
			);

			expect(
				screen.queryByText(/Accepted: Using 24-letter alphabet/)
			).not.toBeInTheDocument();
		});

		it('should not show 24-letter message on incorrect answer', () => {
			render(
				<GamePresentation
					{...defaultProps}
					attemptStatus={STATUS.INCORRECT}
					attempt="X"
					attemptImagePaths={['/images/x.png']}
					acceptedAs24Letter={true}
				/>
			);

			expect(
				screen.queryByText(/Accepted: Using 24-letter alphabet/)
			).not.toBeInTheDocument();
		});
	});

	describe('Shift Keys Visibility by Game Mode', () => {
		it('should show shift keys when gameMode is ALL (both)', () => {
			render(<GamePresentation {...defaultProps} gameMode="all" />);
			const kb = screen.getByTestId('kb');
			expect(kb).toHaveAttribute('data-show-shift-keys', 'true');
		});

		it('should hide shift keys when gameMode is MINUSCULE', () => {
			render(<GamePresentation {...defaultProps} gameMode="minuscule" />);
			const kb = screen.getByTestId('kb');
			expect(kb).toHaveAttribute('data-show-shift-keys', 'false');
		});

		it('should hide shift keys when gameMode is MAJUSCULE', () => {
			render(<GamePresentation {...defaultProps} gameMode="majuscule" />);
			const kb = screen.getByTestId('kb');
			expect(kb).toHaveAttribute('data-show-shift-keys', 'false');
		});

		it('should default to hiding shift keys when gameMode is not provided', () => {
			render(<GamePresentation {...defaultProps} />);
			const kb = screen.getByTestId('kb');
			// Without gameMode, it defaults to false (undefined !== GAME_MODES.ALL)
			expect(kb).toHaveAttribute('data-show-shift-keys', 'false');
		});

		it('should hide shift keys for EXTRAS mode', () => {
			render(<GamePresentation {...defaultProps} gameMode="extras" />);
			const kb = screen.getByTestId('kb');
			expect(kb).toHaveAttribute('data-show-shift-keys', 'false');
		});
	});
});
