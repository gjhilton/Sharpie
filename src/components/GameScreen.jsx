import { useState, useEffect, useRef } from 'react';
import { DB } from '../data/DB.js';
import * as gameLogic from '../utilities/gameLogic.js';
import { GamePresentation } from './GameScreen/GamePresentation.jsx';

export const STATUS = gameLogic.STATUS;

const GameScreen = ({ onEndGame, gameMode }) => {
	const graphs = gameLogic.getGraphsForGameMode(DB, gameMode);
	const [currentSolution, setCurrentSolution] = useState(
		gameLogic.createRandomSolution(graphs)
	);
	const [attempt, setAttempt] = useState(null);
	const [attemptImagePaths, setAttemptImagePaths] = useState([]);
	const [attemptStatus, setAttemptStatus] = useState(STATUS.NONE);
	const [correctCount, setCorrectCount] = useState(0);
	const [incorrectCount, setIncorrectCount] = useState(0);
	const startTimeRef = useRef(Date.now());
	const historyRef = useRef([]);

	const handleNextLetter = () => {
		setAttemptStatus(STATUS.NONE);
		setAttempt(null);
		setAttemptImagePaths([]);
	};

	useEffect(() => {
		if (gameLogic.shouldCreateNewSolution(attempt, attemptStatus)) {
			const newSolution = gameLogic.createRandomSolution(graphs);
			setCurrentSolution(newSolution);
		}
	}, [attempt, attemptStatus, graphs]);

	useEffect(() => {
		if (attempt !== null) {
			const status = gameLogic.checkAttempt(
				attempt,
				currentSolution.graph.character
			);
			setAttemptStatus(status);

			const historyEntry = gameLogic.createHistoryEntry(
				currentSolution,
				attempt,
				status === STATUS.CORRECT
			);
			historyRef.current.push(historyEntry);

			if (status === STATUS.CORRECT) {
				setCorrectCount(prev => prev + 1);
			} else if (status === STATUS.INCORRECT) {
				setIncorrectCount(prev => prev + 1);
			}
		} else {
			setAttemptStatus(STATUS.NONE);
		}
	}, [attempt, currentSolution]);

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
			initialKeyboardLayout={gameLogic.getInitialKeyboardLayout(gameMode)}
			onKeyPress={handleKeyPress}
			onNextLetter={handleNextLetter}
			onEndGame={handleEndGame}
		/>
	);
};

export default GameScreen;
