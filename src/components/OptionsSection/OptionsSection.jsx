import { Paragraph } from '@components/Layout/Layout';
import { Button } from '@components/Button/Button';
import { Toggle } from '@components/Toggle/Toggle';
import { SubSection } from '@components/SubSection/SubSection';
import { RadioGroup } from '@components/RadioGroup/RadioGroup';
import { InlineMarkdown } from '@components/InlineMarkdown/InlineMarkdown';
import { MarkdownWithPlaceholders } from '@components/MarkdownWithPlaceholders/MarkdownWithPlaceholders';
import { BaselineExamples } from '@components/BaselineExamples/BaselineExamples';
import { ShareURLSection } from '@components/ShareURLSection/ShareURLSection';
import { ResetOptionsSection } from '@components/ResetOptionsSection/ResetOptionsSection';
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
	handCount,
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
				<InlineMarkdown content={identifyContent} />
			</Paragraph>
		</SubSection>

		<SubSection title="Hands">
			<Paragraph>
				Question bank: <strong>{characterCount}</strong> characters from{' '}
				<strong>{handCount}</strong> hands.
			</Paragraph>
			<Button label="Choose hands" onClick={onShowCatalogue} />
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

export { OptionsSection };
