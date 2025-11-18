import { useState, lazy, Suspense } from 'react';
import { STAGES } from '@constants/stages.js';
import LandingScreen from '@components/LandingScreen/LandingScreen.jsx';
import LoadingSpinner from '@components/LoadingSpinner/LoadingSpinner.jsx';
import alphabetsData from '@data/alphabets.json';

// Lazy load screens that aren't immediately needed
const GameScreen = lazy(() => import('@components/GameScreen/GameScreen.jsx'));
const ScoreScreen = lazy(
	() => import('@components/ScoreScreen/ScoreScreen.jsx')
);
const CatalogueScreen = lazy(
	() => import('@components/CatalogueScreen/CatalogueScreen.jsx')
);
const FeedbackScreen = lazy(
	() => import('@components/FeedbackScreen/FeedbackScreen.jsx')
);

// Initialize enabled alphabets from isDefaultEnabled in alphabets.json
const initializeEnabledAlphabets = () => {
	const enabled = {};
	Object.entries(alphabetsData).forEach(([alphabetName, alphabetInfo]) => {
		enabled[alphabetName] = alphabetInfo.isDefaultEnabled;
	});
	return enabled;
};

const App = () => {
	const [stage, setStage] = useState(STAGES.MENU);
	const [gameMode, setGameMode] = useState(null);
	const [twentyFourLetterAlphabet, setTwentyFourLetterAlphabet] =
		useState(null);
	const [showBaseline, setShowBaseline] = useState(true);
	const [score, setScore] = useState(null);
	const [enabledAlphabets, setEnabledAlphabets] = useState(initializeEnabledAlphabets);

	const handleSelectMode = (mode, twentyFourLetterAlphabetValue) => {
		setGameMode(mode);
		setTwentyFourLetterAlphabet(twentyFourLetterAlphabetValue);
		setStage(STAGES.PLAYING);
	};

	const handleEndGame = scoreData => {
		setScore(scoreData);
		setStage(STAGES.SCORE);
	};

	const handleReturnToMenu = () => {
		setGameMode(null);
		setScore(null);
		setStage(STAGES.MENU);
	};

	const handleShowCatalogue = () => {
		setStage(STAGES.CATALOGUE);
	};

	const handleShowFeedback = () => {
		setStage(STAGES.FEEDBACK);
	};

	const renderScreen = () => {
		switch (stage) {
			case STAGES.PLAYING:
				return (
					<GameScreen
						onEndGame={handleEndGame}
						gameMode={gameMode}
						twentyFourLetterAlphabet={twentyFourLetterAlphabet}
						showBaseline={showBaseline}
						enabledAlphabets={enabledAlphabets}
					/>
				);
			case STAGES.SCORE:
				return (
					<ScoreScreen
						score={score}
						onReturnToMenu={handleReturnToMenu}
						onShowFeedback={handleShowFeedback}
						showBaseline={showBaseline}
					/>
				);
			case STAGES.CATALOGUE:
				return (
					<CatalogueScreen
						onReturnToMenu={handleReturnToMenu}
						onShowFeedback={handleShowFeedback}
						showBaseline={showBaseline}
						enabledAlphabets={enabledAlphabets}
						setEnabledAlphabets={setEnabledAlphabets}
					/>
				);
			case STAGES.FEEDBACK:
				return (
					<FeedbackScreen
						onReturnToMenu={handleReturnToMenu}
						onShowFeedback={handleShowFeedback}
					/>
				);
			default:
				return (
					<LandingScreen
						onSelectMode={handleSelectMode}
						onShowCatalogue={handleShowCatalogue}
						onShowFeedback={handleShowFeedback}
						showBaseline={showBaseline}
						setShowBaseline={setShowBaseline}
						enabledAlphabets={enabledAlphabets}
					/>
				);
		}
	};

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<div>{renderScreen()}</div>
		</Suspense>
	);
};

export default App;
