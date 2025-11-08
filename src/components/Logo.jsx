import { css } from '../../styled-system/css';
import logo from '../artwork/Branding/sharpielogo-line.svg';

export const SIZE = {
	S: '150px',
	M: '300px',
	L: '500px',
};

const Logo = ({ size = 'm'
}) => (
	<div
		className={css({
			display: 'inline-block',
		})}
	>
		<img
			src={logo}
			alt="Sharpie Logo"
			className={
			css({
				
			})
			}
			style={{
				maxWidth: SIZE[size] || size,
				width: '100%',
				height: 'auto',
			}}
		/>
	</div>
);

export default Logo;
