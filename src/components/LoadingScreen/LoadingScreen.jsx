import { css } from '../../../dist/styled-system/css';
import { flexCenterColumn } from '@lib/constants/ui';

const SPINNER_SIZE = '40px';
const SPINNER_BORDER_WIDTH = 'thick';
const SPINNER_BORDER_COLOR = '{colors.ink/20}';
const SPINNER_BORDER_TOP_COLOR = '{colors.ink}';
const SPINNER_BORDER_RADIUS = '50%';
const SPINNER_ANIMATION = 'spin 1s linear infinite';
const TEXT_COLOR = '{colors.ink/60}';

export const LoadingScreen = () => {
	return (
		<div
			className={css({
				...flexCenterColumn,
				minHeight: '100vh',
				gap: 'lg',
			})}
		>
			<div
				className={css({
					width: SPINNER_SIZE,
					height: SPINNER_SIZE,
					border: `${SPINNER_BORDER_WIDTH} solid ${SPINNER_BORDER_COLOR}`,
					borderTopColor: SPINNER_BORDER_TOP_COLOR,
					borderRadius: SPINNER_BORDER_RADIUS,
					animation: SPINNER_ANIMATION,
				})}
				aria-hidden="true"
			/>
			<p
				className={css({
					color: TEXT_COLOR,
					fontSize: 's',
				})}
			>
				Loading...
			</p>
		</div>
	);
};
