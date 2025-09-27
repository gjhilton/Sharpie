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
  </div>
)

const CorrectAnswer = ({ solution,handleNextLetter }) => (
  <div>
    <Card letter={solution} />
    <div className={css({ 
      textAlign: "center", 
      color: "green", 
      fontSize: "4rem", 
      margin: "1rem" 
    })}>
      ✅
    </div>
      <div className={css({ 
        display: "flex", 
        gap: "1rem", 
        justifyContent: "center",
        margin: "2rem 0"
      })}>
       
          <StageButton onClick={handleNextLetter} label="Next" />
      </div>
  </div>
)

const IncorrectAnswer = ({ solution, attempt, handleNextLetter }) => (
  <div>
    <Card letter={solution} />
    <div className={css({ 
      textAlign: "center", 
      color: "red", 
      fontSize: "4rem", 
      margin: "1rem" 
    })}>
     ❌
    </div>
      <div className={css({ 
        display: "flex", 
        gap: "1rem", 
        justifyContent: "center",
        margin: "2rem 0"
      })}>
       
          <StageButton onClick={handleNextLetter} label="Next" />
        
      </div>
  </div>
)

const StatusDisplay = ({ handleNextLetter, handleKeyPress, status, solution, attempt }) => {

  const renderStatus = () => {
    switch (status) {
      case STATUS.NONE:
        return <Unanswered handleKeyPress={handleKeyPress} solution={solution} />
      case STATUS.CORRECT:
        return <CorrectAnswer solution={solution} handleNextLetter={handleNextLetter}/>
      case STATUS.INCORRECT:
        return <IncorrectAnswer attempt={attempt} solution={solution} handleNextLetter={handleNextLetter}/>
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

    setAttemptStatus(STATUS.NONE)
        setAttempt(null)
  }

  useEffect(() => {
    if (attempt === null && attemptStatus === STATUS.NONE) {
      const newLetter = getRandomLetter()
      setCurrentLetter(newLetter)
    }
  }, [attempt, attemptStatus])

useEffect(() => {
    if (attempt !== null ) {
     setAttemptStatus(getStatus(attempt))
    } else {
setAttemptStatus(STATUS.NONE)
    }
  }, [attempt])

  const handleKeyPress = (button) => {
    console.log("setAttempt: " + button)
    setAttempt(button)
  }

    const disableKeyPress = (button) => {
    console.log("disabled: " + button)
  }

  return (
    <div>
      <StatusDisplay 
      handleNextLetter={handleNextLetter}
        handleKeyPress={handleKeyPress} 
        status={attemptStatus} 
        solution={currentLetter} 
        attempt={attempt}
      />
      
    
<div className={css({ 
        opacity: attempt ?  0.01 : 1
      })}> 
    <KB keyCallback={attempt ?  disableKeyPress : handleKeyPress} />
  </div>

      <div className={css({ 
        display: "flex", 
        gap: "1rem", 
        justifyContent: "center",
        margin: "2rem 0"
      })}>

        
        <StageButton onClick={onEndGame} label="End Game" />
      </div>
    </div>
  )
}

export default PlayingStage