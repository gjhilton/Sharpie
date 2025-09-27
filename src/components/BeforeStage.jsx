import StageButton from './StageButton.jsx'

const BeforeStage = ({ onStartGame }) => (
  <div>
    <h1>Before</h1>
    <StageButton onClick={onStartGame} label="Play" />
  </div>
)

export default BeforeStage