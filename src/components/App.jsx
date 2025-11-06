import { useState } from 'react';
import '../style/App.css';
import { STAGES } from '../constants/stages.js';
import MenuScreen from './MenuScreen.jsx';
import GameScreen from './GameScreen.jsx';
import ScoreScreen from './ScoreScreen.jsx';
import CatalogueScreen from './CatalogueScreen.jsx';

const App = () => {
	const [stage, setStage] = useState(STAGES.MENU);
	const [gameMode, setGameMode] = useState(null);
	const [score, setScore] = useState(null);

	const handleSelectMode = mode => {
		setGameMode(mode);
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

	const renderScreen = () => {
		switch (stage) {
			case STAGES.PLAYING:
				return (
					<GameScreen onEndGame={handleEndGame} gameMode={gameMode} />
				);
			case STAGES.SCORE:
				return (
					<ScoreScreen
						score={score}
						onReturnToMenu={handleReturnToMenu}
					/>
				);
			case STAGES.CATALOGUE:
				return <CatalogueScreen onReturnToMenu={handleReturnToMenu} />;
			default:
				return (
					<MenuScreen
						onSelectMode={handleSelectMode}
						onShowCatalogue={handleShowCatalogue}
					/>
				);
		}
	};

	return <div>{renderScreen()}</div>;
};

export default App;
