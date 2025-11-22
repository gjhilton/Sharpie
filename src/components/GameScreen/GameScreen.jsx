import { useState, useEffect, useRef, useCallback } from 'react';
import { DB } from '@data/DB.js';
import * as gameLogic from '@utilities/gameLogic.js';
import { GamePresentation } from '@components/GamePresentation/GamePresentation.jsx';
import { GAME_END_MODE } from '@constants/options.js';

export const STATUS = gameLogic.STATUS;

const GameScreen = ({
	onEndGame,
	gameMode,
	twentyFourLetterAlphabet = false,
	showBaseline = false,
	enabledAlphabets = null,
	gameEndMode = GAME_END_MODE.ON_QUIT,
	questionCount = 25,
}) => {
	const graphs = gameLogic.getGraphsForGameMode(
		DB,
		gameMode,
		enabledAlphabets
	);
	const [currentSolution, setCurrentSolution] = useState(
		gameLogic.createRandomSolution(graphs)
	);
	const [attempt, setAttempt] = useState(null);
	const [attemptImagePaths, setAttemptImagePaths] = useState([]);
	const [attemptStatus, setAttemptStatus] = useState(STATUS.NONE);
	const [acceptedAs24Letter, setAcceptedAs24Letter] = useState(false);
	const [correctCount, setCorrectCount] = useState(0);
	const [incorrectCount, setIncorrectCount] = useState(0);
	const startTimeRef = useRef(Date.now());
	const historyRef = useRef([]);

	const handleNextLetter = () => {
		setAttemptStatus(STATUS.NONE);
		setAttempt(null);
		setAttemptImagePaths([]);
		setAcceptedAs24Letter(false);
	};

	const handleKeyPress = button => {
		setAttempt(button);
		const attemptData = gameLogic.createAttempt(button, graphs);
		setAttemptImagePaths(attemptData.imagePaths);
	};

	const handleEndGame = useCallback(() => {
		const stats = gameLogic.calculateGameStats(
			correctCount,
			incorrectCount,
			startTimeRef.current
		);
		const mistakes = gameLogic.processIncorrectAttempts(historyRef.current);

		onEndGame({
			...stats,
			mistakes,
		});
	}, [correctCount, incorrectCount, onEndGame]);

	useEffect(() => {
		if (gameLogic.shouldCreateNewSolution(attempt, attemptStatus)) {
			const newSolution = gameLogic.createRandomSolution(graphs);
			setCurrentSolution(newSolution);
		}
	}, [attempt, attemptStatus, graphs]);

	useEffect(() => {
		if (attempt !== null) {
			const result = gameLogic.checkAttempt(
				attempt,
				currentSolution.graph.character,
				twentyFourLetterAlphabet
			);
			setAttemptStatus(result.status);
			setAcceptedAs24Letter(result.acceptedAs24Letter);

			const historyEntry = gameLogic.createHistoryEntry(
				currentSolution,
				attempt,
				result.status === STATUS.CORRECT,
				result.acceptedAs24Letter
			);
			historyRef.current.push(historyEntry);

			if (result.status === STATUS.CORRECT) {
				setCorrectCount(prev => prev + 1);
			} else if (result.status === STATUS.INCORRECT) {
				setIncorrectCount(prev => prev + 1);
			}
		} else {
			setAttemptStatus(STATUS.NONE);
		}
	}, [attempt, currentSolution, twentyFourLetterAlphabet]);

	// Check if game should auto-end based on mode
	useEffect(() => {
		if (
			gameLogic.shouldEndGame(
				gameEndMode,
				correctCount,
				incorrectCount,
				questionCount
			)
		) {
			// Use a small delay to allow the final answer feedback to display
			const timer = setTimeout(() => {
				handleEndGame();
			}, 1500);
			return () => clearTimeout(timer);
		}
	}, [
		correctCount,
		incorrectCount,
		gameEndMode,
		questionCount,
		handleEndGame,
	]);

	return (
		<GamePresentation
			currentSolution={currentSolution}
			attempt={attempt}
			attemptImagePaths={attemptImagePaths}
			attemptStatus={attemptStatus}
			acceptedAs24Letter={acceptedAs24Letter}
			twentyFourLetterAlphabet={twentyFourLetterAlphabet}
			showBaseline={showBaseline}
			initialKeyboardLayout={gameLogic.getInitialKeyboardLayout(gameMode)}
			gameMode={gameMode}
			onKeyPress={handleKeyPress}
			onNextLetter={handleNextLetter}
			onEndGame={handleEndGame}
			gameEndMode={gameEndMode}
			questionCount={questionCount}
			correctCount={correctCount}
			incorrectCount={incorrectCount}
		/>
	);
};

export default GameScreen;
