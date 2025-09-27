import StageButton from './StageButton.jsx';

const BeforeStage = ({ onStartGame }) => (
	<div>
		<StageButton onClick={onStartGame} label="Play" />
	</div>
);

export default BeforeStage;
