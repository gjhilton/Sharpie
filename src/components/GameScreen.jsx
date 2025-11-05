import { useState, useEffect, useRef } from 'react';
import { css } from '../../styled-system/css';
import Button from './Button.jsx';
import KB from './KB.jsx';
import Character, { CHARACTER_STATE } from './Character.jsx';
import { GAME_MODES } from '../constants/stages.js';
import { DB } from '../data/DB.js';
import * as db from '../utilities/database.js';

export const STATUS = {
	NONE: 'none',
	CORRECT: 'correct',
	INCORRECT: 'incorrect',
};

const SPACING = {
	SECTION_GAP: '2rem',
	BUTTON_GAP: '1rem',
	CHARACTER_GAP: '2rem',
};

const KB_DISABLED_OPACITY = 0.01;

const Unanswered = ({ solution }) => (
	<div className={css({ display: 'flex', justifyContent: 'center' })}>
		<Character
			state={CHARACTER_STATE.AWAIT_ANSWER}
			imagePath={solution.imagePath}
		/>
	</div>
);

const CorrectAnswer = ({ solution, handleNextLetter }) => {
	const source = DB.sources[solution.graph.source];
	const sourceLink = source?.sourceUri;
	const sourceTitle = source?.title;

	return (
		<>
			<div className={css({ display: 'flex', justifyContent: 'center' })}>
				<Character
					state={CHARACTER_STATE.CORRECT_ANSWER}
					imagePath={solution.imagePath}
					character={solution.graph.character}
					sourceLink={sourceLink}
					sourceTitle={sourceTitle}
				/>
			</div>
			<div
				className={css({
					display: 'flex',
					gap: SPACING.BUTTON_GAP,
					justifyContent: 'center',
					marginTop: SPACING.SECTION_GAP,
				})}
			>
				<Button onClick={handleNextLetter} label="Next" />
			</div>
		</>
	);
};

const IncorrectAnswer = ({
	solution,
	attempt,
	attemptImagePaths,
	handleNextLetter,
}) => {
	const source = DB.sources[solution.graph.source];
	const sourceLink = source?.sourceUri;
	const sourceTitle = source?.title;

	return (
		<>
			<div
				className={css({
					display: 'flex',
					gap: SPACING.CHARACTER_GAP,
					justifyContent: 'center',
					alignItems: 'flex-start',
				})}
			>
				<Character
					state={CHARACTER_STATE.INCORRECT_ANSWER}
					imagePaths={attemptImagePaths}
					character={attempt}
				/>
				<Character
					state={CHARACTER_STATE.CORRECT_ANSWER}
					imagePath={solution.imagePath}
					character={solution.graph.character}
					sourceLink={sourceLink}
					sourceTitle={sourceTitle}
				/>
			</div>

			<div
				className={css({
					display: 'flex',
					gap: SPACING.BUTTON_GAP,
					justifyContent: 'center',
					marginTop: SPACING.SECTION_GAP,
				})}
			>
				<Button onClick={handleNextLetter} label="Next" />
			</div>
		</>
	);
};

const StatusDisplay = ({
	handleNextLetter,
	handleKeyPress,
	status,
	solution,
	attempt,
	attemptImagePaths,
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
					attemptImagePaths={attemptImagePaths}
					solution={solution}
					handleNextLetter={handleNextLetter}
				/>
			);
		case STATUS.NONE:
		default:
			return <Unanswered solution={solution} />;
	}
};

const getGraphSetTitle = gameMode => {
	if (gameMode === GAME_MODES.ALL) return null;
	return gameMode === GAME_MODES.MINUSCULE ? 'minuscules' : 'MAJUSCULES';
};

const getGraphsForGameMode = gameMode => {
	if (gameMode === GAME_MODES.ALL) {
		const enabledGraphSets = db.getEnabledGraphSets(DB);
		return db.flattenGraphs(enabledGraphSets);
	}
	const title = getGraphSetTitle(gameMode);
	const graphSet = db.findGraphSetByTitle(DB, title);
	return db.getGraphs(graphSet);
};

const getRandomSolution = graphs => {
	const graph = db.getRandomGraph(graphs);
	const imagePath = db.getImagePath(graph);
	return { graph, imagePath };
};

const GameScreen = ({ onEndGame, gameMode }) => {
	const graphs = getGraphsForGameMode(gameMode);
	const graphSetTitle = getGraphSetTitle(gameMode);
	const [currentSolution, setCurrentSolution] = useState(
		getRandomSolution(graphs)
	);
	const [attempt, setAttempt] = useState(null);
	const [attemptImagePaths, setAttemptImagePaths] = useState([]);
	const [attemptStatus, setAttemptStatus] = useState(STATUS.NONE);
	const [correctCount, setCorrectCount] = useState(0);
	const [incorrectCount, setIncorrectCount] = useState(0);
	const startTimeRef = useRef(Date.now());
	const historyRef = useRef([]);

	const getStatus = attemptValue => {
		if (!attemptValue) return STATUS.NONE;
		return attemptValue === currentSolution.graph.character
			? STATUS.CORRECT
			: STATUS.INCORRECT;
	};

	const handleNextLetter = () => {
		setAttemptStatus(STATUS.NONE);
		setAttempt(null);
		setAttemptImagePaths([]);
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

			// Record to history
			historyRef.current.push({
				graph: currentSolution.graph,
				imagePath: currentSolution.imagePath,
				userAnswer: attempt,
				correctAnswer: currentSolution.graph.character,
				isCorrect: status === STATUS.CORRECT,
			});

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
			const imagePaths = attemptGraphs.map(g => db.getImagePath(g));
			setAttemptImagePaths(imagePaths);
		}
	};

	const handleEndGame = () => {
		const endTime = Date.now();
		const timeElapsed = Math.round((endTime - startTimeRef.current) / 1000);
		const total = correctCount + incorrectCount;
		const percentage =
			total > 0 ? Math.round((correctCount / total) * 100) : 0;

		// Process mistakes: filter incorrect, deduplicate, sort
		const incorrectAttempts = historyRef.current.filter(h => !h.isCorrect);
		const uniqueMistakes = [];
		const seen = new Set();

		incorrectAttempts.forEach(attempt => {
			const key = `${attempt.graph.character}-${attempt.graph.img}`;
			if (!seen.has(key)) {
				seen.add(key);
				uniqueMistakes.push({
					graph: attempt.graph,
					imagePath: attempt.imagePath,
				});
			}
		});

		// Sort alphabetically by character
		uniqueMistakes.sort((a, b) =>
			a.graph.character.localeCompare(b.graph.character)
		);

		onEndGame({
			correct: correctCount,
			incorrect: incorrectCount,
			percentage,
			timeElapsed,
			mistakes: uniqueMistakes,
		});
	};

	return (
		<div
			className={css({
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: SPACING.SECTION_GAP,
				padding: SPACING.SECTION_GAP,
			})}
		>
			<StatusDisplay
				handleNextLetter={handleNextLetter}
				handleKeyPress={handleKeyPress}
				status={attemptStatus}
				solution={currentSolution}
				attempt={attempt}
				attemptImagePaths={attemptImagePaths}
			/>

			<div
				className={css({
					opacity: attempt ? KB_DISABLED_OPACITY : 1,
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
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
					gap: SPACING.BUTTON_GAP,
					justifyContent: 'center',
				})}
			>
				<Button onClick={handleEndGame} label="End Game" />
			</div>
		</div>
	);
};

export default GameScreen;
