import { css } from '../../../dist/styled-system/css';
import hands from '@data/hands.json';

const MARGIN = '1rem 0';
const FONT_SIZE = 's';
const IMAGE_ALT = 'Secretary Hand';
const IMAGE_SRC = 'secretary_hand.gif';
const HAND_KEY = 'BeauChesne-Baildon';
const LINK_TARGET = '_blank';
const LINK_REL = 'noopener noreferrer';
const ARIA_LABEL = 'View source for BeauChesne-Baildon hand';

const SourceFigure = () => (
	<figure>
		<img alt={IMAGE_ALT} src={IMAGE_SRC} />
		<figcaption
			className={css({
				margin: MARGIN,
				fontStyle: 'italic',
				fontSize: FONT_SIZE,
			})}
		>
			{hands[HAND_KEY].title}
			<a
				href={hands[HAND_KEY].sourceUri}
				target={LINK_TARGET}
				rel={LINK_REL}
				aria-label={ARIA_LABEL}
			>
				{' '}
				[source]
			</a>
		</figcaption>
	</figure>
);

export { SourceFigure };
export default SourceFigure;
