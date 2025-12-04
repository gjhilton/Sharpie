import { SubSection } from '@components/SubSection/SubSection';
import { Changelog } from '@components/Changelog/Changelog';

const TITLE = 'Changelog';

const WhatsNewSection = () => (
	<SubSection title={TITLE}>
		<Changelog />
	</SubSection>
);

export { WhatsNewSection };
