import ReactMarkdown from 'react-markdown';
import { css } from '../../../dist/styled-system/css';
import { Paragraph } from '@components/Layout/Layout.jsx';
import SubSection from '@components/SubSection/SubSection.jsx';
import { useGameOptionsContext } from '@context/GameOptionsContext.jsx';
import resetOptionsContent from '@data/reset-options.md?raw';

const ResetOptionsSection = () => {
	const { resetOptions } = useGameOptionsContext();

	const handleReset = () => {
		if (
			window.confirm(
				'Reset all settings to defaults? This will clear your current configuration.'
			)
		) {
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
					padding: '0.5rem 1rem',
					border: '1px solid {colors.ink}',
					backgroundColor: '{colors.paper}',
					color: '{colors.ink}',
					cursor: 'pointer',
					fontSize: 's',
					fontWeight: 'bold',
					transition: 'all 150ms ease-in-out',
					_hover: {
						transform: 'scale(1.02)',
					},
					_active: {
						transform: 'scale(0.98)',
					},
					_focusVisible: {
						outline: '2px solid {colors.ink}',
						outlineOffset: '2px',
					},
				})}
			>
				Reset to Defaults
			</button>
		</SubSection>
	);
};

export default ResetOptionsSection;
