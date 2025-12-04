import { css } from '../../../dist/styled-system/css';
import { FONT_SIZE_MEDIUM } from '@lib/constants/ui';

const GRID_COLUMNS = '1fr 2fr';
const GAP = '2rem';
const MARGIN_BOTTOM = '1.5rem';
const HEADING_MARGIN = '0';

const SubSection = ({ title, children }) => (
	<div
		className={css({
			display: 'grid',
			gridTemplateColumns: GRID_COLUMNS,
			gap: GAP,
			alignItems: 'baseline',
			marginBottom: MARGIN_BOTTOM,
		})}
	>
		<h3
			className={css({
				margin: HEADING_MARGIN,
				fontWeight: 'bold',
				fontSize: FONT_SIZE_MEDIUM,
			})}
		>
			{title}
		</h3>
		<div>{children}</div>
	</div>
);

export { SubSection };
