import StageButton from './StageButton.jsx'

const PlayingStage = ({ onEndGame }) => (
  <div>
    <h1>Playing</h1>
    <StageButton onClick={onEndGame} label="End Game" />
  </div>
)

export default PlayingStage