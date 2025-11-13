import { useState } from 'react';
import { PageWidth } from '@components/Layout/Layout.jsx';
import SmallPrint from '@components/SmallPrint/SmallPrint.jsx';
import LandingSectionHero from '@components/LandingSectionHero/LandingSectionHero.jsx';
import LandingSectionHowToUse from '@components/LandingSectionHowToUse/LandingSectionHowToUse.jsx';
import LandingSectionOptions from '@components/LandingSectionOptions/LandingSectionOptions.jsx';
import LandingSectionAlphabet from '@components/LandingSectionAlphabet/LandingSectionAlphabet.jsx';
import LandingSectionBaselines from '@components/LandingSectionBaselines/LandingSectionBaselines.jsx';
import LandingSectionNews from '@components/LandingSectionNews/LandingSectionNews.jsx';
import LandingSectionNextSteps from '@components/LandingSectionNextSteps/LandingSectionNextSteps.jsx';

const LandingScreen = ({
	onSelectMode,
	onShowCatalogue,
	onShowFeedback,
	showBaseline,
	setShowBaseline,
}) => {
	const [twentyFourLetterAlphabet, setTwentyFourLetterAlphabet] = useState(false);

	return (
		<PageWidth>
			<LandingSectionHero
				onSelectMode={onSelectMode}
				twentyFourLetterAlphabet={twentyFourLetterAlphabet}
			/>

			<LandingSectionHowToUse />

			<LandingSectionOptions
				onSelectMode={onSelectMode}
				twentyFourLetterAlphabet={twentyFourLetterAlphabet}
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
