import { css } from '../../../dist/styled-system/css';

const LoadingSpinner = () => (
	<div
		className={css({
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: '100vh',
			width: '100vw',
		})}
	>
		<div
			className={css({
				width: '48px',
				height: '48px',
				border: '5px solid {colors.ink}',
				borderBottomColor: 'transparent',
				borderRadius: '50%',
				display: 'inline-block',
				boxSizing: 'border-box',
				animation: 'rotation 1s linear infinite',
			})}
		/>
	</div>
);

export default LoadingSpinner;
