import { useState, useEffect } from 'react'
import { css } from "../../styled-system/css"
import StageButton from './StageButton.jsx'
import KB from './KB.jsx'
import Card from './Card.jsx'

const STATUS = {
  NONE: 'none',
  CORRECT: 'correct',
  INCORRECT: 'incorrect'
}

const Unanswered = ({ solution }) => (
  <div>
    <Card letter={solution} />
  </div>
)

const CorrectAnswer = ({ solution }) => (
  <div>
    <Card letter={solution} />
    <div className={css({ 
      textAlign: "center", 
      color: "green", 
      fontSize: "xl", 
      margin: "1rem" 
    })}>
      Correct!
    </div>
  </div>
)

const IncorrectAnswer = ({ solution, attempt }) => (
  <div>
    <Card letter={solution} />
    <div className={css({ 
      textAlign: "center", 
      color: "red", 
      fontSize: "xl", 
      margin: "1rem" 
    })}>
      "{attempt}" is wrong. Should be "{solution}"
    </div>
  </div>
)

const StatusDisplay = ({ solution, attempt }) => {
  const getStatus = () => {
    if (!attempt) return STATUS.NONE
    return attempt === solution ? STATUS.CORRECT : STATUS.INCORRECT
  }

  const [answerStatus, setAnswerStatus] = useState(getStatus())

  useEffect(() => {
    setAnswerStatus(getStatus())
  }, [attempt, solution])

  const renderStatus = () => {
    switch (answerStatus) {
      case STATUS.NONE:
        return <Unanswered solution={solution} />
      case STATUS.CORRECT:
        return <CorrectAnswer solution={solution} />
      case STATUS.INCORRECT:
        return <IncorrectAnswer attempt={attempt} solution={solution} />
      default:
        return <Unanswered solution={solution} />
    }
  }

  return <div>{renderStatus()}</div>
}


const getRandomLetter = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const randomIndex = Math.floor(Math.random() * characters.length)
  return characters[randomIndex]
}

const PlayingStage = ({ onEndGame }) => {
  const [currentLetter, setCurrentLetter] = useState(getRandomLetter())
  const [attempt, setAttempt] = useState(null)

  const handleNextLetter = () => {
    const newLetter = getRandomLetter()
    setCurrentLetter(newLetter)
    setAttempt(null) // Reset attempt for new letter
  }

  const handleKeyboardInput = (input) => {
    // Get the last character typed
    const lastChar = input.slice(-1)
    if (lastChar && lastChar !== attempt) {
      setAttempt(lastChar)
    }
  }

  return (
    <div>
      <StatusDisplay solution={currentLetter} attempt={attempt} />
      
      <div className={css({ 
        maxWidth: "500px", 
        margin: "4rem auto", 
        fontWeight: "bold" 
      })}>
        <KB onInputChange={handleKeyboardInput} />
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