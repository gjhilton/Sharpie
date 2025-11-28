import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import * as gameLogic from '@utilities/gameLogic.js';
import { GamePresentation } from '@components/GamePresentation/GamePresentation.jsx';
import { useGameOptions } from '@lib/hooks/useGameOptions.js';
import { useDatabase } from '@context/DatabaseContext.jsx';

export const STATUS = gameLogic.STATUS;

const GameScreen = () => {
	const navigate = useNavigate();
	const { options } = useGameOptions();
	const { DB } = useDatabase();

	const {
		mode: gameMode,
		numLetters: twentyFourLetterAlphabet = false,
		showBaseline = false,
		enabledHands = null,
	} = options;

	const graphs = gameLogic.getGraphsForGameMode(
		DB,
		gameMode,
		enabledHands
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

	const handleKeyPress = button => {
		setAttempt(button);
		const attemptData = gameLogic.createAttempt(
			button,
			graphs,
			twentyFourLetterAlphabet
		);
		setAttemptImagePaths(attemptData.imagePaths);
	};

	const handleEndGame = () => {
		const stats = gameLogic.calculateGameStats(
			correctCount,
			incorrectCount,
			startTimeRef.current
		);
		const mistakes = gameLogic.processIncorrectAttempts(historyRef.current);

		// Navigate to score screen with score data in router state
		navigate({
			to: '/score',
			search: prev => prev,
			state: {
				score: {
					...stats,
					mistakes,
				},
			},
		});
	};

	// Get alphabet metadata for the current solution
	const alphabetMetadata = DB.sources[currentSolution.graph.source] || {};

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
			alphabetMetadata={alphabetMetadata}
			onKeyPress={handleKeyPress}
			onNextLetter={handleNextLetter}
			onEndGame={handleEndGame}
		/>
	);
};

export { GameScreen };
export default GameScreen;
