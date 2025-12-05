import { css } from '../../../dist/styled-system/css';

const DEFAULT_HEIGHT = '300px';
const TITLE_MARGIN_BOTTOM = 'sm';

export const ExampleCard = ({ title, children, height = DEFAULT_HEIGHT }) => (
	<div>
		<div
			className={css({
				fontWeight: 'bold',
				textAlign: 'center',
				marginBottom: TITLE_MARGIN_BOTTOM,
			})}
		>
			{title}
		</div>
		<div
			className={css({
				height,
				border: '1px solid {colors.border}',
			})}
		>
			{children}
		</div>
	</div>
);
