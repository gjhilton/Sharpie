import SubSection from '@components/SubSection/SubSection';
import { MarkdownWithPlaceholders } from '@components/MarkdownWithPlaceholders/MarkdownWithPlaceholders';
import nextStepsContent from '@data/next-steps.md?raw';

const TITLE = 'Additional resources';

const NextStepsSection = () => (
	<SubSection title={TITLE}>
		<MarkdownWithPlaceholders content={nextStepsContent} />
	</SubSection>
);

export { NextStepsSection };
