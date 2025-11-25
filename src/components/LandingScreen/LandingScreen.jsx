import { useNavigate } from '@tanstack/react-router';
import { css } from '../../../dist/styled-system/css';
import { PageWidth, Article } from '@components/Layout/Layout.jsx';
import Logo, { SIZE } from '@components/Logo/Logo.jsx';
import SmallPrint from '@components/SmallPrint/SmallPrint.jsx';
import DisclosureSection from '@components/DisclosureSection/DisclosureSection.jsx';
import SourceFigure from '@components/SourceFigure/SourceFigure.jsx';
import HeroSection from '@components/HeroSection/HeroSection.jsx';
import OptionsSection from '@components/OptionsSection/OptionsSection.jsx';
import HowToPlaySection from '@components/HowToPlaySection/HowToPlaySection.jsx';
import NextStepsSection from '@components/NextStepsSection/NextStepsSection.jsx';
import WhatsNewSection from '@components/WhatsNewSection/WhatsNewSection.jsx';
import { useGameOptions } from '@lib/hooks/useGameOptions.js';
import { OPTIONS } from '@lib/options/schema.js';
import { useDatabase } from '@context/DatabaseContext.jsx';

// Build mode options from schema
const GAME_MODE_OPTIONS = Object.entries(OPTIONS.mode.values).map(
	([value, { label }]) => ({ value, label })
);

const LandingScreen = () => {
	const navigate = useNavigate();
	const { options, updateOption } = useGameOptions();
	const { DB, countEnabledCharacters, countEnabledAlphabets } = useDatabase();

	const handlePlay = () => navigate({ to: '/play', search: prev => prev });
	const handleShowCatalogue = () => navigate({ to: '/catalogue', search: prev => prev });
	const handleShowFeedback = () => navigate({ to: '/feedback', search: prev => prev });

	const handleModeChange = e => updateOption('mode', e.target.value);
	const handleTwentyFourLetterChange = checked =>
		updateOption('twentyFourLetter', checked);
	const handleShowBaselineChange = checked =>
		updateOption('showBaseline', checked);

	return (
		<PageWidth>
			<Article>
				<header>
					<div className={css({ marginBottom: '2rem' })}>
						<Logo size={SIZE.S} />
					</div>
					<SourceFigure />
				</header>

				<HeroSection onPlay={handlePlay} />

				<main>
					<DisclosureSection title="Options">
						<OptionsSection
							gameModeOptions={GAME_MODE_OPTIONS}
							selectedMode={options.mode}
							onModeChange={handleModeChange}
							twentyFourLetterAlphabet={options.twentyFourLetterAlphabet}
							onTwentyFourLetterChange={handleTwentyFourLetterChange}
							showBaseline={options.showBaseline}
							onShowBaselineChange={handleShowBaselineChange}
							characterCount={countEnabledCharacters(
								DB,
								options.enabledAlphabets
							)}
							alphabetCount={countEnabledAlphabets(options.enabledAlphabets)}
							onShowCatalogue={handleShowCatalogue}
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
export default LandingScreen;
