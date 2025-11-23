import { css } from '../../../dist/styled-system/css';

const ExampleCard = ({ title, children, height = '300px' }) => (
	<div>
		<div
			className={css({
				fontWeight: 'bold',
				textAlign: 'center',
				marginBottom: '0.5rem',
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

export default ExampleCard;
