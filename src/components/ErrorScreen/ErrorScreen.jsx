/**
 * ErrorScreen - displayed when an error occurs
 */

import { css } from '../../../dist/styled-system/css';
import { Button } from '@components/Button/Button.jsx';

export const ErrorScreen = ({ error, resetError }) => {
	return (
		<div
			className={css({
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '100vh',
				padding: '2rem',
				textAlign: 'center',
				gap: '1.5rem',
			})}
		>
			<h1
				className={css({
					fontSize: '1.5rem',
					fontWeight: 'bold',
					color: '{colors.ink}',
				})}
			>
				Something went wrong
			</h1>

			<p
				className={css({
					color: '{colors.ink/70}',
					maxWidth: '400px',
				})}
			>
				{error?.message || 'An unexpected error occurred. Please try again.'}
			</p>

			{resetError && <Button onClick={resetError} label="Try again" />}

			<Button onClick={() => window.location.reload()} label="Reload page" />
		</div>
	);
};
