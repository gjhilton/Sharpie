import { useState } from 'react';
import { PageWidth } from '@components/Layout/Layout.jsx';
import SmallPrint from '@components/SmallPrint/SmallPrint.jsx';
import LandingSectionHero from '@components/LandingSectionHero/LandingSectionHero.jsx';
import LandingSectionHowToUse from '@components/LandingSectionHowToUse/LandingSectionHowToUse.jsx';
import LandingSectionOptions from '@components/LandingSectionOptions/LandingSectionOptions.jsx';
import LandingSectionAlphabets from '@components/LandingSectionAlphabets/LandingSectionAlphabets.jsx';
import LandingSectionAlphabet from '@components/LandingSectionAlphabet/LandingSectionAlphabet.jsx';
import LandingSectionBaselines from '@components/LandingSectionBaselines/LandingSectionBaselines.jsx';
import LandingSectionNews from '@components/LandingSectionNews/LandingSectionNews.jsx';
import LandingSectionNextSteps from '@components/LandingSectionNextSteps/LandingSectionNextSteps.jsx';
import { GAME_MODES } from '@constants/stages.js';

const LandingScreen = ({
	onSelectMode,
	onShowCatalogue,
	onShowFeedback,
	showBaseline,
	setShowBaseline,
	enabledAlphabets,
}) => {
	const [twentyFourLetterAlphabet, setTwentyFourLetterAlphabet] = useState(false);
	const [selectedMode, setSelectedMode] = useState(GAME_MODES.ALL);

	return (
		<PageWidth>
			<LandingSectionHero
				onSelectMode={onSelectMode}
				twentyFourLetterAlphabet={twentyFourLetterAlphabet}
				selectedMode={selectedMode}
			/>

			<LandingSectionHowToUse />

			<LandingSectionOptions
				selectedMode={selectedMode}
				setSelectedMode={setSelectedMode}
			/>

			<LandingSectionAlphabets
				enabledAlphabets={enabledAlphabets}
				onShowCatalogue={onShowCatalogue}
			/>

			<LandingSectionAlphabet
				twentyFourLetterAlphabet={twentyFourLetterAlphabet}
				setTwentyFourLetterAlphabet={setTwentyFourLetterAlphabet}
			/>

			<LandingSectionBaselines
				showBaseline={showBaseline}
				setShowBaseline={setShowBaseline}
			/>

			<LandingSectionNextSteps />

			<LandingSectionNews />

			<SmallPrint onShowFeedback={onShowFeedback} />
		</PageWidth>
	);
};

export default LandingScreen;
