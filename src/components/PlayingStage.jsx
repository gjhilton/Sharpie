import { useState } from 'react'
import { css } from "../../styled-system/css"
import StageButton from './StageButton.jsx'
import KB from './KB.jsx'
import Card from './Card.jsx'

const getRandomLetter = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const randomIndex = Math.floor(Math.random() * characters.length)
  return characters[randomIndex]
}

const PlayingStage = ({ onEndGame }) => {
  const [currentLetter, setCurrentLetter] = useState(getRandomLetter())

  const handleNextLetter = () => {
    const newLetter = getRandomLetter()
    setCurrentLetter(newLetter)
  }

  return (
    <div>
      <Card letter={currentLetter} />
      
      <div className={css({ 
        maxWidth: "500px", 
        margin: "4rem auto", 
        fontWeight: "bold" 
      })}>
        <KB />
      </div>
      
      <div className={css({ 
        display: "flex", 
        gap: "1rem", 
        justifyContent: "center",
        margin: "2rem 0"
      })}>
        <StageButton onClick={handleNextLetter} label="Next" />
        <StageButton onClick={onEndGame} label="End Game" />
      </div>
    </div>
  )
}

export default PlayingStage