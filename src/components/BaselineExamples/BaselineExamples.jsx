import { css } from '../../../dist/styled-system/css';
import { ExampleCard } from '@components/ExampleCard/ExampleCard';
import { CharacterImage } from '@components/CharacterImage/CharacterImage';
import { getBaseUrl } from '@lib/utilities/url';

const GRID_GAP = '2rem';
const MARGIN_TOP = '2rem';
const MARGIN_BOTTOM = '1rem';

const EXAMPLE_IMAGE = {
	path: 'data/Joscelyn/joscelyn-minuscule-assets/b.png',
	character: 'Joscelyn minuscule b',
};

export const BaselineExamples = () => {
	const exampleImagePath = `${getBaseUrl()}${EXAMPLE_IMAGE.path}`;

	return (
		<div
			className={css({
				display: 'grid',
				gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
				gap: GRID_GAP,
				marginTop: MARGIN_TOP,
				marginBottom: MARGIN_BOTTOM,
			})}
		>
			<ExampleCard title="Without baseline">
				<CharacterImage
					imagePath={exampleImagePath}
					caption={EXAMPLE_IMAGE.character}
					showBaseline={false}
				/>
			</ExampleCard>
			<ExampleCard title="With baseline">
				<CharacterImage
					imagePath={exampleImagePath}
					caption={`${EXAMPLE_IMAGE.character} with baseline`}
					showBaseline
				/>
			</ExampleCard>
		</div>
	);
};
