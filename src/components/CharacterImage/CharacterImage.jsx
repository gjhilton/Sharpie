import { css } from '../../../styled-system/css';

const CharacterImage = ({ imagePath, caption, graph, showBaseline = false }) => (
	<div
		className={css({
			background: 'white',
			height: '100%',
			width: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			padding: '3rem 1rem',
			position: 'relative',
		})}
	>
		<img
			src={imagePath}
			alt={caption || 'Character to identify'}
			className={css({
				maxWidth: '100%',
				maxHeight: '100%',
				objectFit: 'contain',
			})}
		/>
		{showBaseline && (
			<div
				className={css({
					position: 'absolute',
					top: '56.5%',
					left: '0',
					right: '0',
					borderBottom: '4px dotted lightblue',
					pointerEvents: 'none',
				})}
				aria-hidden="true"
			/>
		)}
	</div>
);

export default CharacterImage;
