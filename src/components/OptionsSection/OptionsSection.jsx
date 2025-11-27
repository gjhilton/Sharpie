import ReactMarkdown from 'react-markdown';
import { Paragraph } from '@components/Layout/Layout.jsx';
import Button from '@components/Button/Button.jsx';
import Toggle from '@components/Toggle/Toggle.jsx';
import SubSection from '@components/SubSection/SubSection.jsx';
import { RadioGroup } from '@components/RadioGroup/RadioGroup.jsx';
import MarkdownWithPlaceholders from '@components/MarkdownWithPlaceholders/MarkdownWithPlaceholders.jsx';
import BaselineExamples from '@components/BaselineExamples/BaselineExamples.jsx';
import ShareURLSection from '@components/ShareURLSection/ShareURLSection.jsx';
import ResetOptionsSection from '@components/ResetOptionsSection/ResetOptionsSection.jsx';
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
	options,
}) => {
	return (
		<>
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

		<ShareURLSection options={options} />

		<ResetOptionsSection />
		</>
	);
};

export default OptionsSection;
