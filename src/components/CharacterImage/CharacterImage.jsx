import { css } from '../../../dist/styled-system/css';

const CharacterImage = ({
	imagePath,
	caption,
	showBaseline = false,
	baselineColor = 'baseline',
	note,
}) => (
	<div
		className={css({
			background: '{colors.paper}',
			height: '100%',
			width: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			padding: '2.5rem 0m 3rem',
			position: 'relative',
		})}
	>
		{note && (
			<div
				className={css({
					position: 'absolute',
					top: '0.5rem',
					left: '50%',
					transform: 'translateX(-50%)',
					padding: '0.25rem 0.5rem',
					background: 'transparent',
					color: '{colors.ink}',
					fontSize: 's',
					whiteSpace: 'nowrap',
					zIndex: 1,
				})}
			>
				{note}
			</div>
		)}
		<div
			className={css({
				position: 'relative',
				display: 'inline-flex',
				maxWidth: '100%',
				maxHeight: '100%',
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
					className={`character-image-baseline ${css({
						position: 'absolute',
						top: '56.5%',
						left: '0',
						right: '0',
						borderBottom: `2px solid {colors.${baselineColor}}`,
						pointerEvents: 'none',
						mixBlendMode: 'darken',
					})}`}
					aria-hidden="true"
				/>
			)}
		</div>
	</div>
);

export default CharacterImage;
