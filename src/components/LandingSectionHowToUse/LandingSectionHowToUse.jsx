import { Section, Heading } from '@components/Layout/Layout.jsx';
import MarkdownWithPlaceholders from '@components/MarkdownWithPlaceholders/MarkdownWithPlaceholders.jsx';
import howToUseContent from '@data/how-to-use.md?raw';

const LandingSectionHowToUse = () => {
	return (
		<Section title={<Heading>How to use</Heading>}>
			<MarkdownWithPlaceholders content={howToUseContent} />
		</Section>
	);
};

export default LandingSectionHowToUse;
