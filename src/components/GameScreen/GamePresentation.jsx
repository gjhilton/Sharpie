import { css } from '../../../styled-system/css';
import Button from '../Button.jsx';
import KB from '../KB.jsx';
import Character, { CHARACTER_STATE } from '../Character.jsx';
import { STATUS } from '../../utilities/gameLogic.js';
import { DB } from '../../data/DB.js';

const SPACING = {
	SECTION_GAP: '2rem',
	BUTTON_GAP: '1rem',
	CHARACTER_GAP: '2rem',
};

const KB_DISABLED_OPACITY = 0.01;

export const Unanswered = ({ solution }) => (
	<div className={css({ display: 'flex', justifyContent: 'center' })}>
		<Character
			state={CHARACTER_STATE.AWAIT_ANSWER}
			imagePath={solution.imagePath}
		/>
	</div>
);

export const CorrectAnswer = ({ solution, onNext }) => {
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
	onNext,
}) => {
	switch (status) {
		case STATUS.CORRECT:
			return <CorrectAnswer solution={solution} onNext={onNext} />;
		case STATUS.INCORRECT:
			return (
				<IncorrectAnswer
					attempt={attempt}
					attemptImagePaths={attemptImagePaths}
					solution={solution}
					onNext={onNext}
				/>
			);
		case STATUS.NONE:
		default:
			return <Unanswered solution={solution} />;
	}
};

export const GamePresentation = ({
	currentSolution,
	attempt,
	attemptImagePaths,
	attemptStatus,
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
			padding: SPACING.SECTION_GAP,
		})}
	>
		<StatusDisplay
			status={attemptStatus}
			solution={currentSolution}
			attempt={attempt}
			attemptImagePaths={attemptImagePaths}
			onNext={onNextLetter}
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
