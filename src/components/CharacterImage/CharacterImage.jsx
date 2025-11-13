import { css } from '../../../styled-system/css';

const CharacterImage = ({ imagePath, caption, graph, showBaseline = false, baselineColor = 'lightblue' }) => (
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
		<div
			className={css({
				position: 'relative',
				maxWidth: '100%',
				maxHeight: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			})}
		>
			<img
				src={imagePath}
				alt={caption || 'Character to identify'}
				className={css({
					maxWidth: '100%',
					maxHeight: '100%',
					objectFit: 'contain',
					display: 'block',
				})}
			/>
			{showBaseline && (
				<div
					className={css({
						position: 'absolute',
						top: '56.5%',
						left: '0',
						right: '0',
						borderBottom: `2px solid ${baselineColor}`,
						pointerEvents: 'none',
						mixBlendMode: 'darken',
					})}
					aria-hidden="true"
				/>
			)}
		</div>
	</div>
);

export default CharacterImage;
