import { Section, Heading } from '@components/Layout/Layout.jsx';
import MarkdownWithPlaceholders from '@components/MarkdownWithPlaceholders/MarkdownWithPlaceholders.jsx';
import nextStepsContent from '@data/next-steps.md?raw';

const LandingSectionNextSteps = () => {
	return (
		<Section title={<Heading>Next steps for learners</Heading>}>
			<MarkdownWithPlaceholders content={nextStepsContent} />
		</Section>
	);
};

export default LandingSectionNextSteps;
