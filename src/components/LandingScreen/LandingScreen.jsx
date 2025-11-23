import { useState } from 'react';
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
import { GAME_MODES, GAME_MODE_OPTIONS } from '@constants/stages.js';
import { DB } from '@data/DB.js';
import * as db from '@utilities/database.js';

const LandingScreen = ({
	onSelectMode,
	onShowCatalogue,
	onShowFeedback,
	showBaseline,
	setShowBaseline,
	enabledAlphabets,
}) => {
	const [twentyFourLetterAlphabet, setTwentyFourLetterAlphabet] =
		useState(false);
	const [selectedMode, setSelectedMode] = useState(GAME_MODES.ALL);

	const handlePlay = () => onSelectMode(selectedMode, twentyFourLetterAlphabet);
	const handleModeChange = e => setSelectedMode(e.target.value);

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
							selectedMode={selectedMode}
							onModeChange={handleModeChange}
							twentyFourLetterAlphabet={twentyFourLetterAlphabet}
							onTwentyFourLetterChange={setTwentyFourLetterAlphabet}
							showBaseline={showBaseline}
							onShowBaselineChange={setShowBaseline}
							characterCount={db.countEnabledCharacters(DB, enabledAlphabets)}
							alphabetCount={db.countEnabledAlphabets(enabledAlphabets)}
							onShowCatalogue={onShowCatalogue}
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

			<SmallPrint onShowFeedback={onShowFeedback} />
		</PageWidth>
	);
};

export default LandingScreen;
