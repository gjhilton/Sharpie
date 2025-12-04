import { css } from '../../../dist/styled-system/css';
import { flexCenter } from '@lib/constants/ui';

const SPINNER_SIZE = '48px';
const SPINNER_BORDER_WIDTH = '5px';
const SPINNER_BORDER_COLOR = '{colors.ink}';
const SPINNER_BORDER_RADIUS = '50%';
const SPINNER_ANIMATION = 'rotation 1s linear infinite';

const LoadingSpinner = () => (
	<div
		className={css({
			...flexCenter,
			height: '100vh',
			width: '100vw',
		})}
	>
		<div
			className={css({
				width: SPINNER_SIZE,
				height: SPINNER_SIZE,
				border: `${SPINNER_BORDER_WIDTH} solid ${SPINNER_BORDER_COLOR}`,
				borderBottomColor: 'transparent',
				borderRadius: SPINNER_BORDER_RADIUS,
				display: 'inline-block',
				boxSizing: 'border-box',
				animation: SPINNER_ANIMATION,
			})}
		/>
	</div>
);

export { LoadingSpinner };
