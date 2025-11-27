import ReactMarkdown from 'react-markdown';
import { css } from '../../../dist/styled-system/css';
import { Paragraph } from '@components/Layout/Layout.jsx';
import Button from '@components/Button/Button.jsx';
import Toggle from '@components/Toggle/Toggle.jsx';
import SubSection from '@components/SubSection/SubSection.jsx';
import { RadioGroup } from '@components/RadioGroup/RadioGroup.jsx';
import MarkdownWithPlaceholders from '@components/MarkdownWithPlaceholders/MarkdownWithPlaceholders.jsx';
import BaselineExamples from '@components/BaselineExamples/BaselineExamples.jsx';
import { useGameOptionsContext } from '@context/GameOptionsContext.jsx';
import identifyContent from '@data/identify.md?raw';
import alphabetContent from '@data/alphabet.md?raw';
import baselinesContent from '@data/baselines.md?raw';

const OptionsSection = ({
	gameModeOptions,
	selectedMode,
	onModeChange,
	numLetters,
	onNumLettersChange,
	showBaseline,
	onShowBaselineChange,
	characterCount,
	alphabetCount,
	onShowCatalogue,
}) => {
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
		<>
			{/* Reset button at top */}
			<div
				className={css({
					marginBottom: '2rem',
				})}
			>
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
			</div>

			<SubSection title="Identify...">
			<RadioGroup
				legend="Game mode"
				name="gameMode"
				value={selectedMode}
				onChange={onModeChange}
				options={gameModeOptions}
			/>
			<Paragraph>
				<ReactMarkdown
					components={{
						p: ({ children }) => <>{children}</>,
					}}
				>
					{identifyContent}
				</ReactMarkdown>
			</Paragraph>
		</SubSection>

		<SubSection title="Alphabets">
			<Paragraph>
				Question bank: <strong>{characterCount}</strong> characters from{' '}
				<strong>{alphabetCount}</strong> alphabets.
			</Paragraph>
			<Button label="Choose alphabets" onClick={onShowCatalogue} />
		</SubSection>

		<SubSection title="26 letters vs 24">
			<MarkdownWithPlaceholders
				content={alphabetContent}
				placeholders={{
					ALPHABET_TOGGLE: (
						<Toggle
							id="num-letters"
							label="24-letter alphabet"
							checked={numLetters}
							onChange={onNumLettersChange}
						/>
					),
				}}
			/>
		</SubSection>

		<SubSection title="Baselines">
			<MarkdownWithPlaceholders
				content={baselinesContent}
				placeholders={{
					BASELINE_TOGGLE: (
						<Toggle
							id="baseline-toggle"
							label="Show baselines"
							checked={showBaseline}
							onChange={onShowBaselineChange}
						/>
					),
					BASELINE_EXAMPLES: <BaselineExamples />,
				}}
			/>
		</SubSection>
		</>
	);
};

export default OptionsSection;
