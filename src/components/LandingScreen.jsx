import { useState } from 'react';
import { PageWidth } from './Layout.jsx';
import SmallPrint from './SmallPrint.jsx';
import LandingSectionHero from './LandingSectionHero.jsx';
import LandingSectionHowToUse from './LandingSectionHowToUse.jsx';
import LandingSectionOptions from './LandingSectionOptions.jsx';
import LandingSectionAlphabet from './LandingSectionAlphabet.jsx';
import LandingSectionNews from './LandingSectionNews.jsx';
import LandingSectionNextSteps from './LandingSectionNextSteps.jsx';

const LandingScreen = ({ onSelectMode, onShowCatalogue, onShowFeedback }) => {
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

			<LandingSectionNextSteps />

			<LandingSectionNews />

			<SmallPrint onShowFeedback={onShowFeedback} />
		</PageWidth>
	);
};

export default LandingScreen;
