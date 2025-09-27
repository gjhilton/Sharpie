import { css } from '../../styled-system/css';

const StageButton = ({ onClick, label }) => (
	<button
		className={css({
			border: '1px solid black',
			fontSize: 'xl',
			padding: '1rem 3rem',
			margin: '2rem 0',
		})}
		onClick={onClick}
	>
		{label}
	</button>
);

export default StageButton;
