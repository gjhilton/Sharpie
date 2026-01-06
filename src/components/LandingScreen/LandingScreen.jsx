import { useNavigate } from '@tanstack/react-router';
import { css } from '../../../dist/styled-system/css';
import { PageWidth, Article } from '@components/Layout/Layout';
import { Logo, SIZE } from '@components/Logo/Logo';
import { SmallPrint } from '@components/SmallPrint/SmallPrint';
import { DisclosureSection } from '@components/DisclosureSection/DisclosureSection';
import { SourceFigure } from '@components/SourceFigure/SourceFigure';
import { HeroSection } from '@components/HeroSection/HeroSection';
import { OptionsSection } from '@components/OptionsSection/OptionsSection';
import { OptionsSummary } from '@components/OptionsSummary/OptionsSummary';
import { HowToPlaySection } from '@components/HowToPlaySection/HowToPlaySection';
import { NextStepsSection } from '@components/NextStepsSection/NextStepsSection';
import { WhatsNewSection } from '@components/WhatsNewSection/WhatsNewSection';
import { useGameOptions } from '@lib/hooks/useGameOptions';
import { useDatabase } from '@lib/context/DatabaseContext';
import { GAME_MODE_OPTIONS } from '@lib/constants/stages';

const LandingScreen = () => {
	const navigate = useNavigate();
	const { options, updateOption } = useGameOptions();
	const { DB, countEnabledCharacters, countEnabledHands } = useDatabase();

	const handlePlay = () => navigate({ to: '/play', search: prev => prev });
	const handleShowCatalogue = () => navigate({ to: '/catalogue', search: prev => prev });
	const handleShowFeedback = () => navigate({ to: '/feedback', search: prev => prev });

	const handleModeChange = e => updateOption('mode', e.target.value);
	const handleNumLettersChange = checked =>
		updateOption('numLetters', checked);
	const handleShowBaselineChange = checked =>
		updateOption('showBaseline', checked);

	return (
		<PageWidth>
			<Article>
				<header>
					<div className={css({ marginBottom: '3xl' })}>
						<Logo size={SIZE.S} />
					</div>
					<SourceFigure />
				</header>
				<HeroSection onPlay={handlePlay} />

				<main>
					<DisclosureSection
						title="Options"
						additionalComponent={
							<OptionsSummary
								options={options}
								handCount={countEnabledHands(options.enabledHands)}
							/>
						}
					>
						<OptionsSection
							gameModeOptions={GAME_MODE_OPTIONS}
							selectedMode={options.mode}
							onModeChange={handleModeChange}
							numLetters={options.numLetters}
							onNumLettersChange={handleNumLettersChange}
							showBaseline={options.showBaseline}
							onShowBaselineChange={handleShowBaselineChange}
							characterCount={countEnabledCharacters(
								DB,
								options.enabledHands
							)}
							handCount={countEnabledHands(options.enabledHands)}
							onShowCatalogue={handleShowCatalogue}
							options={options}
						/>
					</DisclosureSection>

					<DisclosureSection title="How to play">
						<HowToPlaySection />
					</DisclosureSection>

					<DisclosureSection title="Next steps for learners">
						<NextStepsSection />
					</DisclosureSection>

					<DisclosureSection title="What's new?">
						<WhatsNewSection />
					</DisclosureSection>
				</main>
			</Article>

			<SmallPrint onShowFeedback={handleShowFeedback} />
		</PageWidth>
	);
};

export { LandingScreen };
