import { css } from '../../styled-system/css';

const SmallPrint = ({ children, className }) => (
	<div
		className={
			className ||
			css({
				fontSize: 's',
				marginTop: '1rem',
				fontStyle: 'italic',
			})
		}
	>
		Concept, design and code copyright ©2025 g.j.hilton /{' '}
		<a href="http://funeralgames.co.uk">funeral games</a>, <br />
		Manucript context copyright as shown inline.
	</div>
);

export default SmallPrint;
