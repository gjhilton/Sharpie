import SubSection from '@components/SubSection/SubSection.jsx';
import MarkdownWithPlaceholders from '@components/MarkdownWithPlaceholders/MarkdownWithPlaceholders.jsx';
import nextStepsContent from '@data/next-steps.md?raw';

const NextStepsSection = () => (
	<SubSection title="Additional resources">
		<MarkdownWithPlaceholders content={nextStepsContent} />
	</SubSection>
);

export default NextStepsSection;
