import StageButton from './StageButton.jsx'

const AfterStage = ({ onRestart }) => (
  <div>
    <h1>After</h1>
    <StageButton onClick={onRestart} label="Play Again" />
  </div>
)

export default AfterStage