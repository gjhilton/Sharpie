/**
 * LoadingScreen - displayed while app is loading
 */

import { css } from '../../../dist/styled-system/css';

export const LoadingScreen = () => {
	return (
		<div
			className={css({
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '100vh',
				gap: '1rem',
			})}
		>
			<div
				className={css({
					width: '40px',
					height: '40px',
					border: '3px solid {colors.ink/20}',
					borderTopColor: '{colors.ink}',
					borderRadius: '50%',
					animation: 'spin 1s linear infinite',
				})}
				aria-hidden="true"
			/>
			<p
				className={css({
					color: '{colors.ink/60}',
					fontSize: '0.875rem',
				})}
			>
				Loading...
			</p>
		</div>
	);
};
