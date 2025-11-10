import { useState, useEffect, useRef } from 'react';
import { DB } from '../data/DB.js';
import * as gameLogic from '../utilities/gameLogic.js';
import { GamePresentation } from './GamePresentation.jsx';

export const STATUS = gameLogic.STATUS;

const GameScreen = ({ onEndGame, gameMode, doubledLetterMode = false }) => {
	const graphs = gameLogic.getGraphsForGameMode(DB, gameMode);
	const [currentSolution, setCurrentSolution] = useState(
		gameLogic.createRandomSolution(graphs)
	);
	const [attempt, setAttempt] = useState(null);
	const [attemptImagePaths, setAttemptImagePaths] = useState([]);
	const [attemptStatus, setAttemptStatus] = useState(STATUS.NONE);
	const [acceptedAsDoubled, setAcceptedAsDoubled] = useState(false);
	const [correctCount, setCorrectCount] = useState(0);
	const [incorrectCount, setIncorrectCount] = useState(0);
	const startTimeRef = useRef(Date.now());
	const historyRef = useRef([]);

	const handleNextLetter = () => {
		setAttemptStatus(STATUS.NONE);
		setAttempt(null);
		setAttemptImagePaths([]);
		setAcceptedAsDoubled(false);
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
				doubledLetterMode
			);
			setAttemptStatus(result.status);
			setAcceptedAsDoubled(result.acceptedAsDoubled);

			const historyEntry = gameLogic.createHistoryEntry(
				currentSolution,
				attempt,
				result.status === STATUS.CORRECT,
				result.acceptedAsDoubled
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
	}, [attempt, currentSolution, doubledLetterMode]);

	const handleKeyPress = button => {
		setAttempt(button);
		const attemptData = gameLogic.createAttempt(button, graphs);
		setAttemptImagePaths(attemptData.imagePaths);
	};

	const handleEndGame = () => {
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
	};

	return (
		<GamePresentation
			currentSolution={currentSolution}
			attempt={attempt}
			attemptImagePaths={attemptImagePaths}
			attemptStatus={attemptStatus}
			acceptedAsDoubled={acceptedAsDoubled}
			doubledLetterMode={doubledLetterMode}
			initialKeyboardLayout={gameLogic.getInitialKeyboardLayout(gameMode)}
			onKeyPress={handleKeyPress}
			onNextLetter={handleNextLetter}
			onEndGame={handleEndGame}
		/>
	);
};

export default GameScreen;
