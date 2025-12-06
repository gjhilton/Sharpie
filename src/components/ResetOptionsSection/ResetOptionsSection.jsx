import { css } from '../../../dist/styled-system/css';
import { Paragraph } from '@components/Layout/Layout';
import { SubSection } from '@components/SubSection/SubSection';
import { InlineMarkdown } from '@components/InlineMarkdown/InlineMarkdown';
import { useGameOptionsContext } from '@lib/context/GameOptionsContext';
import { commonButtonStyles } from '@lib/constants/ui';
import resetOptionsContent from '@data/reset-options.md?raw';

const RESET_CONFIRM_MESSAGE = 'Reset all settings to defaults? This will clear your current configuration.';

const ResetOptionsSection = () => {
	const { resetOptions } = useGameOptionsContext();

	const handleReset = () => {
		if (window.confirm(RESET_CONFIRM_MESSAGE)) {
			resetOptions();
		}
	};

	return (
		<SubSection title="Reset settings">
			<Paragraph>
				<InlineMarkdown content={resetOptionsContent} />
			</Paragraph>

			<button
				type="button"
				onClick={handleReset}
				className={css(commonButtonStyles)}
			>
				Reset to Defaults
			</button>
		</SubSection>
	);
};

export { ResetOptionsSection };
