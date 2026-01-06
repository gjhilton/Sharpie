import { css } from '../../../dist/styled-system/css';
import { LinkAsButton } from '@components/LinkAsButton/LinkAsButton';
import { version } from '@lib/utilities/version';
import { FONT_SIZE_SMALL } from '@lib/constants/ui';

const MARGIN_TOP = '5xl';
const TEXT_MARGIN_TOP = 'lg';
const VERSION_MARGIN_TOP = 'sm';
const GITHUB_URL = 'https://github.com/gjhilton/Sharpie';
const FUNERAL_GAMES_URL = 'http://funeralgames.co.uk';

const SmallPrint = ({ onShowFeedback }) => (
	<footer
		className={css({
			gridColumn: '1 / -1',
			marginTop: MARGIN_TOP,
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
				fontSize: FONT_SIZE_SMALL,
				marginTop: TEXT_MARGIN_TOP,
				fontStyle: 'italic',
			})}
		>
			Concept, design and <a href={GITHUB_URL}>code</a> copyright ©2025
			g.j.hilton / <a href={FUNERAL_GAMES_URL}>funeral games</a>, <br />
			Manuscript context copyright: as shown inline.
		</div>

		<div
			className={css({
				fontSize: FONT_SIZE_SMALL,
				marginTop: VERSION_MARGIN_TOP,
				fontStyle: 'italic',
			})}
		>
			v{version}
		</div>
	</footer>
);

export { SmallPrint };
