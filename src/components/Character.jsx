import { css } from '../../styled-system/css';
import CharacterImage from './CharacterImage.jsx';

const DEFAULT_TITLE = 'Identify the letterform';
const DEFAULT_CAPTION = '?';

const Character = ({ title, graph, caption, imagePath }) => (
	<div
		className={css({
			maxWidth: '500px',
			margin: '1rem auto 2rem',
			border: '1px solid #ccc',
			padding: '1rem',
		})}
	>
		<div>{title || DEFAULT_TITLE}</div>
		<CharacterImage imagePath={imagePath} caption={caption} graph={graph} />
		<div
			className={css({
				fontSize: 'xl',
				padding: '1rem',
			})}
		>
			{caption || DEFAULT_CAPTION}
		</div>
	</div>
);

export default Character;
