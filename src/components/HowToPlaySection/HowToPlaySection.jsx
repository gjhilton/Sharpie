import { SubSection } from '@components/SubSection/SubSection';
import { MarkdownWithPlaceholders } from '@components/MarkdownWithPlaceholders/MarkdownWithPlaceholders';
import { ContextImage } from '@components/ContextImage/ContextImage';
import howToUseContent from '@data/how-to-use.md?raw';
import lettersInContextContent from '@data/letters-in-context.md?raw';
import hintsContent from '@data/hints.md?raw';

export const HowToPlaySection = () => (
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
