import { css } from '../../../dist/styled-system/css';
import { CharacterImage } from '@components/CharacterImage/CharacterImage';
import { CharacterImageSlideshow } from '@components/CharacterImageSlideshow/CharacterImageSlideshow';
import { Icon, ICON_TYPE } from '@components/Icon/Icon';

const CHARACTER_SIZE = '300px';
const CHARACTER_LABEL_FONT_SIZE = '24px';
const CHARACTER_LABEL_FONT_WEIGHT = '900';
const ALPHABET_FONT_SIZE = '0.8rem';

export const CHARACTER_STATE = {
	AWAIT_ANSWER: 'awaitAnswer',
	CORRECT_ANSWER: 'correctAnswer',
	INCORRECT_ANSWER: 'incorrectAnswer',
};

const RedOverlay = () => (
	<div
		className={css({
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			mixBlendMode: 'lighten',
			backgroundColor: '{colors.error}',
			zIndex: 20,
		})}
		role="img"
		aria-live="polite"
		aria-label="Incorrect answer"
	/>
);

const Alphabet = ({ alphabetTitle, alphabetLink, alphabetDate }) => (
	<span className={css({ fontSize: ALPHABET_FONT_SIZE })}>
		<strong>[{alphabetDate}]</strong> {alphabetTitle} (
		<a href={alphabetLink} target="_blank" rel="noopener noreferrer">
			source
		</a>
		)
	</span>
);

export const Character = ({
	state,
	imagePath,
	imagePaths,
	character,
	alphabetLink,
	alphabetTitle,
	alphabetDate,
	showBaseline = false,
	note,
}) => {
	const baselineColor =
		state === CHARACTER_STATE.INCORRECT_ANSWER ? 'ink' : 'baseline';

	return (
		<div
			className={css({
				minHeight: CHARACTER_SIZE,
				height: CHARACTER_SIZE,
				width: { base: '200px', sm: CHARACTER_SIZE },
				position: 'relative',
			})}
		>
			{state !== CHARACTER_STATE.AWAIT_ANSWER && (
				<div
					className={css({
						position: 'absolute',
						padding: 'lg',
						fontSize: CHARACTER_LABEL_FONT_SIZE,
						fontWeight: CHARACTER_LABEL_FONT_WEIGHT,
						display: 'flex',
						gap: 'xs',
						alignItems: 'center',
						zIndex: 10,
					})}
					aria-label={`Character ${character}: ${state === CHARACTER_STATE.CORRECT_ANSWER ? 'correct' : 'incorrect'} answer`}
				>
					{character}
					<Icon
						icon={
							state === CHARACTER_STATE.CORRECT_ANSWER
								? ICON_TYPE.TICK
								: ICON_TYPE.CROSS
						}
					/>
				</div>
			)}
			{imagePath ? (
				<CharacterImage
					imagePath={imagePath}
					showBaseline={showBaseline}
					baselineColor={baselineColor}
				/>
			) : (
				<CharacterImageSlideshow
					imagePaths={imagePaths}
					showBaseline={showBaseline}
					baselineColor={baselineColor}
				/>
			)}
			{state === CHARACTER_STATE.INCORRECT_ANSWER && <RedOverlay />}
			{(note || state === CHARACTER_STATE.CORRECT_ANSWER) && (
				<div
					className={css({
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-end',
						fontSize: ALPHABET_FONT_SIZE,
					})}
				>
					{note && (
						<span
							className={css({
								backgroundColor: '{colors.paper}',
								padding: 'xs sm',
							})}
						>
							{note}
						</span>
					)}
					{state === CHARACTER_STATE.CORRECT_ANSWER && (
						<span
							className={css({
								backgroundColor: '{colors.paper}',
								padding: 'xs sm',
							})}
						>
							<Alphabet
								alphabetTitle={alphabetTitle}
								alphabetLink={alphabetLink}
								alphabetDate={alphabetDate}
							/>
						</span>
					)}
				</div>
			)}
		</div>
	);
};
