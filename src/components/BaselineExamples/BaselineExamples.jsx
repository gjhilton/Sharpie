import { css } from '../../../dist/styled-system/css';
import ExampleCard from '@components/ExampleCard/ExampleCard.jsx';
import CharacterImage from '@components/CharacterImage/CharacterImage.jsx';
import { getBaseUrl } from '@lib/utilities/url.js';

const BaselineExamples = () => {
	const exampleImagePath = `${getBaseUrl()}data/Joscelyn/joscelyn-minuscule-assets/b.png`;

	return (
		<div
			className={css({
				display: 'grid',
				gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
				gap: '2rem',
				marginTop: '2rem',
				marginBottom: '1rem',
			})}
		>
			<ExampleCard title="Without baseline">
				<CharacterImage
					imagePath={exampleImagePath}
					caption="Joscelyn minuscule b"
					showBaseline={false}
				/>
			</ExampleCard>
			<ExampleCard title="With baseline">
				<CharacterImage
					imagePath={exampleImagePath}
					caption="Joscelyn minuscule b with baseline"
					showBaseline={true}
				/>
			</ExampleCard>
		</div>
	);
};

export default BaselineExamples;
