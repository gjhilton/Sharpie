import { useState, useEffect, useRef } from 'react';
import { css } from '../../styled-system/css';
import StageButton from './StageButton.jsx';
import KB from './KB.jsx';
import Card from './Card.jsx';
import { CHARACTER_SETS, GAME_MODES } from '../constants/stages.js';

const STATUS = {
	NONE: 'none',
	CORRECT: 'correct',
	INCORRECT: 'incorrect',
};

const Unanswered = ({ solution, handleKeyPress }) => (
	<div>
		<Card letter={solution} />
	</div>
);

const CorrectAnswer = ({ solution, handleNextLetter }) => (
	<div>
		<Card title={'Correct'} letter={solution} caption={solution} />
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
			<StageButton onClick={handleNextLetter} label="Next" />
		</div>
	</div>
);

const IncorrectAnswer = ({ solution, attempt, handleNextLetter }) => (
	<div>
		<div className={css({ display: 'flex' })}>
			<div className={css({ flex: 1 })}>
				<Card
					title={'Correct answer'}
					letter={solution}
					caption={solution}
				/>
			</div>
			<div className={css({ flex: 1 })}>
				<Card
					title={'Your answer'}
					letter={attempt}
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
			<StageButton onClick={handleNextLetter} label="Next" />
		</div>
	</div>
);

const StatusDisplay = ({
	handleNextLetter,
	handleKeyPress,
	status,
	solution,
	attempt,
}) => {
	const renderStatus = () => {
		switch (status) {
			case STATUS.NONE:
				return (
					<Unanswered
						handleKeyPress={handleKeyPress}
						solution={solution}
					/>
				);
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
						solution={solution}
						handleNextLetter={handleNextLetter}
					/>
				);
			default:
				return (
					<Unanswered
						handleKeyPress={handleKeyPress}
						solution={solution}
					/>
				);
		}
	};

	return <div>{renderStatus()}</div>;
};

const getRandomLetter = (characters) => {
	const randomIndex = Math.floor(Math.random() * characters.length);
	return characters[randomIndex];
};

const PlayingStage = ({ onEndGame, gameMode }) => {
	const characters = CHARACTER_SETS[gameMode];
	const [currentLetter, setCurrentLetter] = useState(getRandomLetter(characters));
	const [attempt, setAttempt] = useState(null);
	const [attemptStatus, setAttemptStatus] = useState(STATUS.NONE);
	const [correctCount, setCorrectCount] = useState(0);
	const [incorrectCount, setIncorrectCount] = useState(0);
	const startTimeRef = useRef(Date.now());

	const getStatus = attemptValue => {
		if (!attemptValue) return STATUS.NONE;
		return attemptValue === currentLetter
			? STATUS.CORRECT
			: STATUS.INCORRECT;
	};

	const handleNextLetter = () => {
		setAttemptStatus(STATUS.NONE);
		setAttempt(null);
	};

	useEffect(() => {
		if (attempt === null && attemptStatus === STATUS.NONE) {
			const newLetter = getRandomLetter(characters);
			setCurrentLetter(newLetter);
		}
	}, [attempt, attemptStatus, characters]);

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
	};

	const disableKeyPress = () => {
		// Disabled state - no action needed
	};

	return (
		<div>
			<StatusDisplay
				handleNextLetter={handleNextLetter}
				handleKeyPress={handleKeyPress}
				status={attemptStatus}
				solution={currentLetter}
				attempt={attempt}
			/>

			<div
				className={css({
					opacity: attempt ? 0.01 : 1,
				})}
			>
				<KB
					keyCallback={attempt ? disableKeyPress : handleKeyPress}
					initialLayout={gameMode === GAME_MODES.MAJUSCULE ? 'shift' : 'default'}
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
				<StageButton
					onClick={() => {
						const endTime = Date.now();
						const timeElapsed = Math.round(
							(endTime - startTimeRef.current) / 1000
						); // in seconds
						const total = correctCount + incorrectCount;
						const percentage =
							total > 0
								? Math.round((correctCount / total) * 100)
								: 0;

						onEndGame({
							correct: correctCount,
							incorrect: incorrectCount,
							percentage,
							timeElapsed,
						});
					}}
					label="End Game"
				/>
			</div>
		</div>
	);
};

export default PlayingStage;
