import { css } from '../../styled-system/css';

const CharacterImage = ({ imagePath, caption, graph }) => (
	<div>
		<img
			src={imagePath}
			alt={caption || graph?.character}
			className={css({
				maxWidth: '100%',
				height: 'auto',
				padding: '3rem 1rem',
			})}
		/>
	</div>
);

export default CharacterImage;
