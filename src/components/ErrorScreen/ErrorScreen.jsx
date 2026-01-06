import { css } from '../../../dist/styled-system/css';
import { Button } from '@components/Button/Button';
import { flexCenterColumn } from '@lib/constants/ui';

const PADDING = '3xl';
const GAP = '2xl';
const HEADING_FONT_SIZE = '2xl';
const MAX_WIDTH = '400px';

export const ErrorScreen = ({ error, resetError }) => {
	return (
		<div
			className={css({
				...flexCenterColumn,
				minHeight: '100vh',
				padding: PADDING,
				textAlign: 'center',
				gap: GAP,
			})}
		>
			<h1
				className={css({
					fontSize: HEADING_FONT_SIZE,
					fontWeight: 'bold',
					color: '{colors.ink}',
				})}
			>
				Something went wrong
			</h1>

			<p
				className={css({
					color: '{colors.ink/70}',
					maxWidth: MAX_WIDTH,
				})}
			>
				{error?.message ||
					'An unexpected error occurred. Please try again.'}
			</p>

			{resetError && <Button onClick={resetError} label="Try again" />}

			<Button
				onClick={() => window.location.reload()}
				label="Reload page"
			/>
		</div>
	);
};
