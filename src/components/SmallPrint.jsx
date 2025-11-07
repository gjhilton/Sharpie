import { css } from '../../styled-system/css';

const SmallPrint = ({ children, className, onShowFeedback }) => (
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
		{onShowFeedback && (
			<>
				{' / '}
				<a
					href="#"
					onClick={e => {
						e.preventDefault();
						onShowFeedback();
					}}
				>
					send feedback
				</a>
			</>
		)}
	</div>
);

export default SmallPrint;
