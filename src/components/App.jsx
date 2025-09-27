import { useState } from 'react'
import '../style/App.css'
import { css } from "../../styled-system/css"

const STAGES = {
  BEFORE: 'before',
  PLAYING: 'playing',
  AFTER: 'after'
}

const StageButton = ({ onClick, label }) => (
  <button className={css({ border: "1px solid black", fontSize: "xl", padding:"1rem 3rem", margin:"2rem 0"})}
     onClick={onClick}>{label}</button>
)

const BeforeStage = ({ onStartGame }) => (
  <div>
    <h1>Before</h1>
    <StageButton onClick={onStartGame} label="Play" />
  </div>
)

const PlayingStage = ({ onEndGame }) => (
  <div>
    <h1>Playing</h1>
    <StageButton onClick={onEndGame} label="End Game" />
  </div>
)

const AfterStage = ({ onRestart }) => (
  <div>
    <h1>After</h1>
    <StageButton onClick={onRestart} label="Play Again" />
  </div>
)

function App() {
  const [stage, setStage] = useState(STAGES.BEFORE)

  const handleStartGame = () => setStage(STAGES.PLAYING)
  const handleEndGame = () => setStage(STAGES.AFTER)
  const handleRestart = () => setStage(STAGES.BEFORE)

  const renderStage = () => {
    switch (stage) {
      case STAGES.BEFORE:
        return <BeforeStage onStartGame={handleStartGame} />
      case STAGES.PLAYING:
        return <PlayingStage onEndGame={handleEndGame} />
      case STAGES.AFTER:
        return <AfterStage onRestart={handleRestart} />
      default:
        return <BeforeStage onStartGame={handleStartGame} />
    }
  }

  return (
    <div className={css({ margin: "1rem"})}>
      <h1>Secretary Hand</h1>
      {renderStage()}
    </div>
  )
}

export default App
