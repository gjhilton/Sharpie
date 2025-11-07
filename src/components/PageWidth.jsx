import { css } from '../../styled-system/css';

const PageWidth = ({ children, className }) => (
	<div
		className={
			className ||
			css({
				display: 'flex',
				flexDirection: 'column',
				maxWidth: '90%',
				desktop: {
					maxWidth: '800px',
				},
				margin: '0 auto 2rem',
			})
		}
	>
		{children}
	</div>
);

export default PageWidth;
