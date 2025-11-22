import { useState, useEffect, lazy, Suspense } from 'react';
import { STAGES } from '@constants/stages.js';
import { DEFAULT_OPTIONS } from '@constants/options.js';
import {
	loadOptions,
	saveOptionsToLocalStorage,
	idsToEnabledAlphabets,
	enabledAlphabetsToIds,
} from '@utilities/optionsStorage.js';
import LandingScreen from '@components/LandingScreen/LandingScreen.jsx';
import LoadingSpinner from '@components/LoadingSpinner/LoadingSpinner.jsx';

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

const App = () => {
	// Load options from URL/localStorage/defaults on mount
	const [{ options, source }, setOptionsState] = useState(() =>
		loadOptions()
	);
	const [stage, setStage] = useState(STAGES.MENU);
	const [score, setScore] = useState(null);

	// Convert enabledAlphabetIds to enabledAlphabets object for components
	const enabledAlphabets = idsToEnabledAlphabets(options.enabledAlphabetIds);

	// Update a single option and persist to localStorage
	const setOption = (key, value) => {
		setOptionsState(prev => {
			const newOptions = { ...prev.options, [key]: value };
			saveOptionsToLocalStorage(newOptions);
			return { ...prev, options: newOptions };
		});
	};

	// Reset all options to defaults
	const resetOptions = () => {
		setOptionsState({
			options: { ...DEFAULT_OPTIONS },
			source: 'defaults',
		});
		saveOptionsToLocalStorage({ ...DEFAULT_OPTIONS });
	};

	// Handler for toggling individual alphabets (used by CatalogueScreen)
	const setEnabledAlphabets = updater => {
		setOptionsState(prev => {
			const currentEnabledAlphabets = idsToEnabledAlphabets(
				prev.options.enabledAlphabetIds
			);
			const newEnabledAlphabets =
				typeof updater === 'function'
					? updater(currentEnabledAlphabets)
					: updater;
			const newIds = enabledAlphabetsToIds(newEnabledAlphabets);
			const newOptions = { ...prev.options, enabledAlphabetIds: newIds };
			saveOptionsToLocalStorage(newOptions);
			return { ...prev, options: newOptions };
		});
	};

	const handleSelectMode = () => {
		setStage(STAGES.PLAYING);
	};

	const handleEndGame = scoreData => {
		setScore(scoreData);
		setStage(STAGES.SCORE);
	};

	const handleReturnToMenu = () => {
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
						gameMode={options.gameMode}
						twentyFourLetterAlphabet={
							options.twentyFourLetterAlphabet
						}
						showBaseline={options.showBaseline}
						enabledAlphabets={enabledAlphabets}
					/>
				);
			case STAGES.SCORE:
				return (
					<ScoreScreen
						score={score}
						onReturnToMenu={handleReturnToMenu}
						onShowFeedback={handleShowFeedback}
						showBaseline={options.showBaseline}
					/>
				);
			case STAGES.CATALOGUE:
				return (
					<CatalogueScreen
						onReturnToMenu={handleReturnToMenu}
						onShowFeedback={handleShowFeedback}
						showBaseline={options.showBaseline}
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
						options={options}
						optionsSource={source}
						setOption={setOption}
						resetOptions={resetOptions}
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
