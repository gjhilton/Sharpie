import SubSection from '@components/SubSection/SubSection.jsx';
import MarkdownWithPlaceholders from '@components/MarkdownWithPlaceholders/MarkdownWithPlaceholders.jsx';
import ContextImage from '@components/ContextImage/ContextImage.jsx';
import howToUseContent from '@data/how-to-use.md?raw';
import lettersInContextContent from '@data/letters-in-context.md?raw';
import hintsContent from '@data/hints.md?raw';

const HowToPlaySection = () => (
	<>
		<SubSection title="Gameplay">
			<MarkdownWithPlaceholders content={howToUseContent} />
		</SubSection>
		<SubSection title="Letters in context">
			<MarkdownWithPlaceholders
				content={lettersInContextContent}
				placeholders={{
					CONTEXT_IMAGE: <ContextImage />,
				}}
			/>
		</SubSection>
		<SubSection title="Hints">
			<MarkdownWithPlaceholders content={hintsContent} />
		</SubSection>
	</>
);

export default HowToPlaySection;
