import { css } from '../../../styled-system/css';
import CharacterImage from '@components/CharacterImage/CharacterImage.jsx';
import CharacterImageSlideshow from '@components/CharacterImageSlideshow/CharacterImageSlideshow.jsx';
import Icon, { ICON_TYPE } from '@components/Icon/Icon.jsx';

const CHARACTER_SIZE = '300px';
const CHARACTER_LABEL_FONT_SIZE = '24px';
const CHARACTER_LABEL_FONT_WEIGHT = '900';
const CHARACTER_LABEL_PADDING = '1rem';
const CHARACTER_ICON_GAP = '0.25rem';
const HAND_FONT_SIZE = '0.8rem';

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
		})}
		role="img"
		aria-live="polite"
		aria-label="Incorrect answer"
	/>
);

const Hand = ({ handTitle, handLink, handDate }) => (
	<div
		className={css({
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'flex-end',
		})}
	>
		<span className={css({ fontSize: HAND_FONT_SIZE })}>
			 <strong>[{handDate}]</strong> {handTitle} (
			<a href={handLink} target="_blank" rel="noopener noreferrer">
				source
			</a>
			)
		</span>
	</div>
);

const Character = ({
	state,
	imagePath,
	imagePaths,
	character,
	handLink,
	handTitle,
	handDate,
	showBaseline = false,
	note,
}) => {
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
						padding: CHARACTER_LABEL_PADDING,
						fontSize: CHARACTER_LABEL_FONT_SIZE,
						fontWeight: CHARACTER_LABEL_FONT_WEIGHT,
						display: 'flex',
						gap: CHARACTER_ICON_GAP,
						alignItems: 'center',
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
				baselineColor={state === CHARACTER_STATE.INCORRECT_ANSWER ? 'ink' : 'baseline'}
				note={note}
			/>
			) : (
				<CharacterImageSlideshow
					imagePaths={imagePaths}
					showBaseline={showBaseline}
				baselineColor={state === CHARACTER_STATE.INCORRECT_ANSWER ? 'ink' : 'baseline'}
				/>
			)}
			{state === CHARACTER_STATE.INCORRECT_ANSWER && <RedOverlay />}
			{state === CHARACTER_STATE.CORRECT_ANSWER && (
				<Hand handTitle={handTitle} handLink={handLink} handDate={handDate} />
			)}
		</div>
	);
};

export default Character;
