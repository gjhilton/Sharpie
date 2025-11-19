import { useState } from 'react';
import { PageWidth } from '@components/Layout/Layout.jsx';
import SmallPrint from '@components/SmallPrint/SmallPrint.jsx';
import LandingSectionHero from '@components/LandingSectionHero/LandingSectionHero.jsx';
import { GAME_MODES } from '@constants/stages.js';

const LandingScreen = ({
	onSelectMode,
	onShowCatalogue,
	onShowFeedback,
	showBaseline,
	setShowBaseline,
	enabledAlphabets,
}) => {
	const [twentyFourLetterAlphabet, setTwentyFourLetterAlphabet] = useState(true);
	const [selectedMode, setSelectedMode] = useState(GAME_MODES.ALL);

	return (
		<PageWidth>
			<LandingSectionHero
				onSelectMode={onSelectMode}
				twentyFourLetterAlphabet={twentyFourLetterAlphabet}
				setTwentyFourLetterAlphabet={setTwentyFourLetterAlphabet}
				selectedMode={selectedMode}
				setSelectedMode={setSelectedMode}
				enabledAlphabets={enabledAlphabets}
				onShowCatalogue={onShowCatalogue}
				showBaseline={showBaseline}
				setShowBaseline={setShowBaseline}
			/>

			<SmallPrint onShowFeedback={onShowFeedback} />
		</PageWidth>
	);
};

export default LandingScreen;
