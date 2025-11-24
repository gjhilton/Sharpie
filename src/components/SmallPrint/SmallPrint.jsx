import { css } from '../../../dist/styled-system/css';
import { LinkAsButton } from '@components/LinkAsButton/LinkAsButton.jsx';
import { version } from '@utilities/version.js';

const SmallPrint = ({ onShowFeedback }) => (
	<footer
		className={css({
			gridColumn: '1 / -1',
			marginTop: '4rem',
		})}
	>
		{onShowFeedback && (
			<div>
				<LinkAsButton onClick={onShowFeedback}>
					Report a problem / send feedback
				</LinkAsButton>
			</div>
		)}

		<div
			className={css({
				fontSize: 's',
				marginTop: '1rem',
				fontStyle: 'italic',
			})}
		>
			Concept, design and{' '}
			<a href="https://github.com/gjhilton/Sharpie">code</a> copyright
			©2025 g.j.hilton /{' '}
			<a href="http://funeralgames.co.uk">funeral games</a>, <br />
			Manuscript context copyright: as shown inline.
		</div>

		<div
			className={css({
				fontSize: 's',
				marginTop: '0.5rem',
				fontStyle: 'italic',
			})}
		>
			v{version}
		</div>
	</footer>
);

export { SmallPrint };
export default SmallPrint;
