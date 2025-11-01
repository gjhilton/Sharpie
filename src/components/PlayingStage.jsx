import { useState, useEffect, useRef } from 'react';
import { css } from '../../styled-system/css';
import Button from './Button.jsx';
import KB from './KB.jsx';
import Card from './Card.jsx';
import { GAME_MODES } from '../constants/stages.js';
import { DB } from '../data/DB.js';
import * as db from '../utilities/database.js';

const STATUS = {
	NONE: 'none',
	CORRECT: 'correct',
	INCORRECT: 'incorrect',
};

const Unanswered = ({ solution }) => (
	<Card
		graph={solution.graph}
		imagePath={solution.imagePath}
	/>
);

const CorrectAnswer = ({ solution, handleNextLetter }) => (
	<>
		<Card
			title="Correct"
			graph={solution.graph}
			imagePath={solution.imagePath}
			caption={solution.graph.character}
		/>
		<div
			className={css({
				textAlign: 'center',
				color: 'green',
				fontSize: '4rem',
				margin: '1rem',
			})}
		>
			✅
		</div>
		<div
			className={css({
				display: 'flex',
				gap: '1rem',
				justifyContent: 'center',
				margin: '2rem 0',
			})}
		>
			<Button onClick={handleNextLetter} label="Next" />
		</div>
	</>
);

const IncorrectAnswer = ({ solution, attempt, attemptImagePath, handleNextLetter }) => (
	<>
		<div className={css({ display: 'flex' })}>
			<div className={css({ flex: 1 })}>
				<Card
					title="Correct answer"
					graph={solution.graph}
					imagePath={solution.imagePath}
					caption={solution.graph.character}
				/>
			</div>
			<div className={css({ flex: 1 })}>
				<Card
					title="Your answer"
					imagePath={attemptImagePath}
					caption={attempt}
				/>
			</div>
		</div>

		<div
			className={css({
				textAlign: 'center',
				color: 'red',
				fontSize: '4rem',
				margin: '1rem',
			})}
		>
			❌
		</div>
		<div
			className={css({
				display: 'flex',
				gap: '1rem',
				justifyContent: 'center',
				margin: '2rem 0',
			})}
		>
			<Button onClick={handleNextLetter} label="Next" />
		</div>
	</>
);

const StatusDisplay = ({
	handleNextLetter,
	handleKeyPress,
	status,
	solution,
	attempt,
	attemptImagePath,
}) => {
	switch (status) {
		case STATUS.CORRECT:
			return (
				<CorrectAnswer
					solution={solution}
					handleNextLetter={handleNextLetter}
				/>
			);
		case STATUS.INCORRECT:
			return (
				<IncorrectAnswer
					attempt={attempt}
					attemptImagePath={attemptImagePath}
					solution={solution}
					handleNextLetter={handleNextLetter}
				/>
			);
		case STATUS.NONE:
		default:
			return <Unanswered solution={solution} />;
	}
};

const getGraphSetTitle = (gameMode) => {
	if (gameMode === GAME_MODES.ALL) return null;
	return gameMode === GAME_MODES.MINUSCULE ? 'minuscules' : 'MAJUSCULES';
};

const getGraphsForGameMode = (gameMode) => {
	if (gameMode === GAME_MODES.ALL) {
		const enabledGraphSets = db.getEnabledGraphSets(DB);
		return db.flattenGraphs(enabledGraphSets);
	}
	const title = getGraphSetTitle(gameMode);
	const graphSet = db.findGraphSetByTitle(DB, title);
	return db.getGraphs(graphSet);
};

const getRandomSolution = (graphs, graphSetTitle) => {
	const graph = db.getRandomGraph(graphs);
	const imagePath = db.getImagePath(graph, graphSetTitle);
	return { graph, imagePath };
};

const PlayingStage = ({ onEndGame, gameMode }) => {
	const graphs = getGraphsForGameMode(gameMode);
	const graphSetTitle = getGraphSetTitle(gameMode);
	const [currentSolution, setCurrentSolution] = useState(
		getRandomSolution(graphs, graphSetTitle)
	);
	const [attempt, setAttempt] = useState(null);
	const [attemptImagePath, setAttemptImagePath] = useState(null);
	const [attemptStatus, setAttemptStatus] = useState(STATUS.NONE);
	const [correctCount, setCorrectCount] = useState(0);
	const [incorrectCount, setIncorrectCount] = useState(0);
	const startTimeRef = useRef(Date.now());

	const getStatus = attemptValue => {
		if (!attemptValue) return STATUS.NONE;
		return attemptValue === currentSolution.graph.character
			? STATUS.CORRECT
			: STATUS.INCORRECT;
	};

	const handleNextLetter = () => {
		setAttemptStatus(STATUS.NONE);
		setAttempt(null);
		setAttemptImagePath(null);
	};

	useEffect(() => {
		if (attempt === null && attemptStatus === STATUS.NONE) {
			const newSolution = getRandomSolution(graphs, graphSetTitle);
			setCurrentSolution(newSolution);
		}
	}, [attempt, attemptStatus, graphs, graphSetTitle]);

	useEffect(() => {
		if (attempt !== null) {
			const status = getStatus(attempt);
			setAttemptStatus(status);

			// Update score counts
			if (status === STATUS.CORRECT) {
				setCorrectCount(prev => prev + 1);
			} else if (status === STATUS.INCORRECT) {
				setIncorrectCount(prev => prev + 1);
			}
		} else {
			setAttemptStatus(STATUS.NONE);
		}
	}, [attempt]);

	const handleKeyPress = button => {
		setAttempt(button);
		const attemptGraphs = graphs.filter(g => g.character === button);
		if (attemptGraphs.length > 0) {
			const attemptGraph = db.getRandomGraph(attemptGraphs);
			const imagePath = db.getImagePath(attemptGraph, graphSetTitle);
			setAttemptImagePath(imagePath);
		}
	};

	const handleEndGame = () => {
		const endTime = Date.now();
		const timeElapsed = Math.round((endTime - startTimeRef.current) / 1000);
		const total = correctCount + incorrectCount;
		const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

		onEndGame({
			correct: correctCount,
			incorrect: incorrectCount,
			percentage,
			timeElapsed,
		});
	};

	return (
		<div>
			<StatusDisplay
				handleNextLetter={handleNextLetter}
				handleKeyPress={handleKeyPress}
				status={attemptStatus}
				solution={currentSolution}
				attempt={attempt}
				attemptImagePath={attemptImagePath}
			/>

			<div
				className={css({
					opacity: attempt ? 0.01 : 1,
				})}
			>
				<KB
					keyCallback={attempt ? undefined : handleKeyPress}
					initialLayout={
						gameMode === GAME_MODES.MAJUSCULE ? 'shift' : 'default'
					}
				/>
			</div>

			<div
				className={css({
					display: 'flex',
					gap: '1rem',
					justifyContent: 'center',
					margin: '2rem 0',
				})}
			>
				<Button onClick={handleEndGame} label="End Game" />
			</div>
		</div>
	);
};

export default PlayingStage;
