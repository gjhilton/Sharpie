import { useState, useEffect, useRef } from 'react'
import { css } from "../../styled-system/css"
import StageButton from './StageButton.jsx'
import KB from './KB.jsx'
import Card from './Card.jsx'

const STATUS = {
  NONE: 'none',
  CORRECT: 'correct',
  INCORRECT: 'incorrect'
}

const Unanswered = ({ solution, handleKeyPress }) => (
  <div>
    <Card letter={solution} />
    <div className={css({ 
      maxWidth: "500px", 
      margin: "4rem auto", 
      fontWeight: "bold" 
    })}>
      <KB keyCallback={handleKeyPress} />
    </div>
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

const StatusDisplay = ({ handleKeyPress, status, solution, attempt }) => {

  const renderStatus = () => {
    switch (status) {
      case STATUS.NONE:
        return <Unanswered handleKeyPress={handleKeyPress} solution={solution} />
      case STATUS.CORRECT:
        return <CorrectAnswer solution={solution} />
      case STATUS.INCORRECT:
        return <IncorrectAnswer attempt={attempt} solution={solution} />
      default:
        return <Unanswered handleKeyPress={handleKeyPress} solution={solution} />
    }
  }

  return <div>{renderStatus()}</div>
}


const getRandomLetter = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const randomIndex = Math.floor(Math.random() * characters.length)
  return characters[randomIndex]
}

const PlayingStage = ({ onEndGame }) => {
  const [currentLetter, setCurrentLetter] = useState(getRandomLetter())
  const [attempt, setAttempt] = useState(null)
  const [attemptStatus, setAttemptStatus] = useState(STATUS.NONE)
  const isResetting = useRef(false)


  const getStatus = (attemptValue) => {
    if (!attemptValue) return STATUS.NONE
    return attemptValue === currentLetter ? STATUS.CORRECT : STATUS.INCORRECT
  }

  const handleNextLetter = () => {
    isResetting.current = true
    setAttempt(null)
    setAttemptStatus(STATUS.NONE)
    setTimeout(() => {
      isResetting.current = false
    }, 50)
  }

  useEffect(() => {
    if (attempt === null && attemptStatus === STATUS.NONE) {
      const newLetter = getRandomLetter()
      setCurrentLetter(newLetter)
    }
  }, [attempt, attemptStatus])

  const handleKeyPress = (button) => {
    console.log("++++")
    console.log(button)
      console.log("++++")
  }

  return (
    <div>
      <StatusDisplay handleKeyPress={handleKeyPress} status={attemptStatus} solution={currentLetter} attempt={attempt} />
      
    
      
    
      
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