import { css } from '../../styled-system/css';
import logo from '../artwork/Branding/sharpielogo.svg';

const Logo = ({ size = '300px', className }) => (
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
				maxWidth: size,
				width: '100%',
				height: 'auto',
			}}
		/>
	</div>
);

export default Logo;
