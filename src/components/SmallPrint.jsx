import { css } from '../../styled-system/css';

const SmallPrint = ({ children, className }) => (
	<div
		className={
			className ||
			css({
				fontSize: '0.8rem',
				marginTop: '1rem',
			})
		}
	>
		{children}
	</div>
);

export default SmallPrint;
