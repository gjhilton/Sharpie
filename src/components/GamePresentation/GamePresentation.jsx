import { css } from '../../../styled-system/css';
import { useEffect } from 'react';
import Button from '@components/Button/Button.jsx';
import KB from '@components/KB/KB.jsx';
import Character, { CHARACTER_STATE } from '@components/Character/Character.jsx';
import { STATUS } from '@utilities/gameLogic.js';
import { DB } from '@data/DB.js';

const SPACING = {
	SECTION_GAP: '2rem',
	BUTTON_GAP: '1rem',
	CHARACTER_GAP: '2rem',
};

const KB_DISABLED_OPACITY = 0.01;

export const Unanswered = ({ solution, showBaseline }) => (
	<div className={css({ display: 'flex', justifyContent: 'center' })}>
		<Character
			state={CHARACTER_STATE.AWAIT_ANSWER}
			imagePath={solution.imagePath}
			showBaseline={showBaseline}
			note={solution.graph.note}
		/>
	</div>
);

export const CorrectAnswer = ({
	solution,
	onNext,
	acceptedAs24Letter,
	showBaseline,
}) => {
	const hand = DB.sources[solution.graph.source];
	const handLink = hand?.sourceUri;
	const handTitle = hand?.title;
	const handDate = hand?.date;

	useEffect(() => {
		const handleKeyDown = e => {
			if (e.key === 'Enter') {
				e.preventDefault();
				onNext();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onNext]);

	return (
		<>
			<div className={css({ display: 'flex', justifyContent: 'center' })}>
				<Character
					state={CHARACTER_STATE.CORRECT_ANSWER}
					imagePath={solution.imagePath}
					character={solution.graph.character}
					handLink={handLink}
					handTitle={handTitle}
					handDate={handDate}
					showBaseline={showBaseline}
					note={solution.graph.note}
				/>
			</div>
			{acceptedAs24Letter && (
				<div
					className={css({
						textAlign: 'center',
						marginTop: '1rem',
						padding: '0.75rem',
						color: "{colors.error}",
						border: "1px solid {colors.error}",
						fontSize: 's',
						fontWeight: '600',
						width: "300px",
						margin: "auto"
					})}
				>
					Accepted: Using 24-letter alphabet, so I and J and U and V are interchangeable
				</div>
			)}
			<div
				className={css({
					display: 'flex',
					gap: SPACING.BUTTON_GAP,
					justifyContent: 'center',
					marginTop: SPACING.SECTION_GAP,
				})}
			>
				<Button onClick={onNext} label="Next" />
			</div>
		</>
	);
};

export const IncorrectAnswer = ({
	solution,
	attempt,
	attemptImagePaths,
	onNext,
	showBaseline,
}) => {
	const hand = DB.sources[solution.graph.source];
	const handLink = hand?.sourceUri;
	const handTitle = hand?.title;
	const handDate = hand?.date;

	useEffect(() => {
		const handleKeyDown = e => {
			if (e.key === 'Enter') {
				e.preventDefault();
				onNext();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onNext]);

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
					showBaseline={showBaseline}
				/>
				<Character
					state={CHARACTER_STATE.CORRECT_ANSWER}
					imagePath={solution.imagePath}
					character={solution.graph.character}
					handLink={handLink}
					handTitle={handTitle}
					handDate={handDate}
					showBaseline={showBaseline}
					note={solution.graph.note}
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
				<Button onClick={onNext} label="Next" />
			</div>
		</>
	);
};

export const StatusDisplay = ({
	status,
	solution,
	attempt,
	attemptImagePaths,
	acceptedAs24Letter,
	onNext,
	showBaseline,
}) => {
	switch (status) {
		case STATUS.CORRECT:
			return (
				<CorrectAnswer
					solution={solution}
					onNext={onNext}
					acceptedAs24Letter={acceptedAs24Letter}
					showBaseline={showBaseline}
				/>
			);
		case STATUS.INCORRECT:
			return (
				<IncorrectAnswer
					attempt={attempt}
					attemptImagePaths={attemptImagePaths}
					solution={solution}
					onNext={onNext}
					showBaseline={showBaseline}
				/>
			);
		case STATUS.NONE:
		default:
			return <Unanswered solution={solution} showBaseline={showBaseline} />;
	}
};

export const GamePresentation = ({
	currentSolution,
	attempt,
	attemptImagePaths,
	attemptStatus,
	acceptedAs24Letter,
	twentyFourLetterAlphabet,
	showBaseline,
	initialKeyboardLayout,
	onKeyPress,
	onNextLetter,
	onEndGame,
}) => (
	<div
		className={css({
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			gap: SPACING.SECTION_GAP,
			padding: { base: '2rem 0', sm: SPACING.SECTION_GAP },
		})}
	>
		<StatusDisplay
			status={attemptStatus}
			solution={currentSolution}
			attempt={attempt}
			attemptImagePaths={attemptImagePaths}
			acceptedAs24Letter={acceptedAs24Letter}
			onNext={onNextLetter}
			showBaseline={showBaseline}
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
				keyCallback={attempt ? undefined : onKeyPress}
				initialLayout={initialKeyboardLayout}
				twentyFourLetterAlphabet={twentyFourLetterAlphabet}
			/>
		</div>

		<div
			className={css({
				display: 'flex',
				gap: SPACING.BUTTON_GAP,
				justifyContent: 'center',
			})}
		>
			<Button onClick={onEndGame} label="End Game" />
		</div>
	</div>
);
