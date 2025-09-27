import StageButton from './StageButton.jsx'

const AfterStage = ({ onRestart }) => (
  <div>
    <StageButton onClick={onRestart} label="Play Again" />
  </div>
)

export default AfterStage