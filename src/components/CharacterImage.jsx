import { css } from '../../styled-system/css';

const CharacterImage = ({ imagePath, caption, graph }) => (
	<div
		className={css({
			background: 'white',
			height: '100%',
			width: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			padding: '3rem 1rem',
		})}
	>
		<img
			src={imagePath}
			alt={caption || graph?.character}
			className={css({
				maxWidth: '100%',
				maxHeight: '100%',
				objectFit: 'contain',
			})}
		/>
	</div>
);

export default CharacterImage;
