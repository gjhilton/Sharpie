import { css } from '../../styled-system/css';
import CharacterImage from './CharacterImage.jsx';
import CharacterImageSlideshow from './CharacterImageSlideshow.jsx';
import Icon, { ICON_TYPE } from './Icon.jsx';

const CHARACTER_SIZE = '300px';

const OVERLAY_POSITION_STYLE = {
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
};

export const CHARACTER_STATE = {
	AWAIT_ANSWER: 'awaitAnswer',
	CORRECT_ANSWER: 'correctAnswer',
	INCORRECT_ANSWER: 'incorrectAnswer',
};

const RedOverlay = () => (
	<div
		className={css({
			...OVERLAY_POSITION_STYLE,
			mixBlendMode: 'lighten',
			backgroundColor: 'red',
		})}
	/>
);

const Source = ({ sourceTitle, sourceLink }) => (
	<div
		className={css({
			...OVERLAY_POSITION_STYLE,
			display: 'flex',
			justifyContent: 'flex-start',
			alignItems: 'flex-end',
		})}
	>
		<span className={css({ fontSize: '0.8rem' })}>
			{sourceTitle} (
			<a href={sourceLink} target="_blank" rel="noopener noreferrer">
				source
			</a>
			)
		</span>
	</div>
);

const Character = ({ state, imagePath, imagePaths, character, sourceLink, sourceTitle }) => {
	return (
		<div
			className={css({
				minHeight: CHARACTER_SIZE,
				height: CHARACTER_SIZE,
				width: CHARACTER_SIZE,
				position: 'relative',
			})}
		>
			{state !== CHARACTER_STATE.AWAIT_ANSWER && (
				<div
					className={css({
						position: 'absolute',
						padding: '1rem',
						fontSize: '24px',
						fontWeight: '900',
						display: 'flex',
						gap: '0.25rem',
						alignItems: 'center',
					})}
				>
					{character}
					<Icon icon={state === CHARACTER_STATE.CORRECT_ANSWER ? ICON_TYPE.TICK : ICON_TYPE.CROSS} />
				</div>
			)}
			{imagePath ? <CharacterImage imagePath={imagePath} /> : <CharacterImageSlideshow imagePaths={imagePaths} />}
			{state === CHARACTER_STATE.INCORRECT_ANSWER && <RedOverlay />}
			{state === CHARACTER_STATE.CORRECT_ANSWER && <Source sourceTitle={sourceTitle} sourceLink={sourceLink} />}
		</div>
	);
};

export default Character;
