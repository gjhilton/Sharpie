import { css } from '../../../dist/styled-system/css';
import hands from '@data/hands.json';

const SourceFigure = () => (
	<figure>
		<img alt="Secretary Hand" src="secretary_hand.gif" />
		<figcaption
			className={css({
				margin: '1rem 0',
				fontStyle: 'italic',
				fontSize: 's',
			})}
		>
			{hands['BeauChesne-Baildon'].title}
			<a
				href={hands['BeauChesne-Baildon'].sourceUri}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="View source for BeauChesne-Baildon hand"
			>
				{' '}
				[source]
			</a>
		</figcaption>
	</figure>
);

export default SourceFigure;
