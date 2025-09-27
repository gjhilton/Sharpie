import { useState } from 'react'
import '../style/App.css'
import { css } from "../../styled-system/css"
import { STAGES } from '../constants/stages.js'
import BeforeStage from './BeforeStage.jsx'
import PlayingStage from './PlayingStage.jsx'
import AfterStage from './AfterStage.jsx'

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
      {renderStage()}
    </div>
  )
}

export default App
