import ReactMarkdown from 'react-markdown';
import { css } from '../../../dist/styled-system/css';
import { Paragraph } from '@components/Layout/Layout';
import SubSection from '@components/SubSection/SubSection';
import { useGameOptionsContext } from '@lib/context/GameOptionsContext';
import resetOptionsContent from '@data/reset-options.md?raw';

const PADDING = '0.5rem 1rem';
const BORDER = '1px solid {colors.ink}';
const BACKGROUND_COLOR = '{colors.paper}';
const COLOR = '{colors.ink}';
const FONT_SIZE = 's';
const TRANSITION = 'all 150ms ease-in-out';
const SCALE_HOVER = 'scale(1.02)';
const SCALE_ACTIVE = 'scale(0.98)';
const OUTLINE = '2px solid {colors.ink}';
const OUTLINE_OFFSET = '2px';
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
				<ReactMarkdown
					components={{
						p: ({ children }) => <>{children}</>,
					}}
				>
					{resetOptionsContent}
				</ReactMarkdown>
			</Paragraph>

			<button
				type="button"
				onClick={handleReset}
				className={css({
					padding: PADDING,
					border: BORDER,
					backgroundColor: BACKGROUND_COLOR,
					color: COLOR,
					cursor: 'pointer',
					fontSize: FONT_SIZE,
					fontWeight: 'bold',
					transition: TRANSITION,
					_hover: {
						transform: SCALE_HOVER,
					},
					_active: {
						transform: SCALE_ACTIVE,
					},
					_focusVisible: {
						outline: OUTLINE,
						outlineOffset: OUTLINE_OFFSET,
					},
				})}
			>
				Reset to Defaults
			</button>
		</SubSection>
	);
};

export { ResetOptionsSection };
export default ResetOptionsSection;
