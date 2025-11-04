import { css } from '../../styled-system/css';

const DEFAULT_TITLE = 'Identify the letterform';
const DEFAULT_CAPTION = '?';

const Character = ({ title, graph, letter, caption, imagePath }) => (
	<div
		className={css({
			maxWidth: '500px',
			margin: '1rem auto 2rem',
			border: '1px solid #ccc',
			padding: '1rem',
		})}
	>
		<div>{title || DEFAULT_TITLE}</div>
		<div>
			{imagePath ? (
				<img
					src={imagePath}
					alt={caption || letter || graph?.character}
					className={css({
						maxWidth: '100%',
						height: 'auto',
						padding: '3rem 1rem',
					})}
				/>
			) : (
				<div
					className={css({
						fontFamily: 'joscelyn',
						fontSize: 'xl',
						padding: '3rem 1rem',
					})}
				>
					{letter}
				</div>
			)}
		</div>
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
