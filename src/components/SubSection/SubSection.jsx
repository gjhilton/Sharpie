import { css } from '../../../dist/styled-system/css';

const SubSection = ({ title, children }) => (
	<div
		className={css({
			display: 'grid',
			gridTemplateColumns: '1fr 2fr',
			gap: '2rem',
			alignItems: 'baseline',
			marginBottom: '1.5rem',
		})}
	>
		<h3
			className={css({
				margin: '0',
				fontWeight: 'bold',
				fontSize: 'm',
			})}
		>
			{title}
		</h3>
		<div>{children}</div>
	</div>
);

export default SubSection;
