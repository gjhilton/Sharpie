import { css } from '../../styled-system/css';
import logo from '../artwork/Branding/sharpielogo.svg';

export const SIZE = {
	S: '100px',
	M: '300px',
	L: '500px',
};

const Logo = ({ size = 'm', className }) => (
	<div
		className={css({
			display: 'inline-block',
		})}
	>
		<img
			src={logo}
			alt="Sharpie Logo"
			className={className}
			style={{
				maxWidth: SIZE[size] || size,
				width: '100%',
				height: 'auto',
			}}
		/>
	</div>
);

export default Logo;
