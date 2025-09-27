import { useState } from 'react'
import KB from './KB.jsx'
import '../style/App.css'
import { css } from "../../styled-system/css";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="joscelyn">
      a b c d e f g
    </div>
    <div className={css({ maxWidth:"500px", margin: "4rem auto", fontWeight: "bold" })}>>
      <KB />
    </div>
    </>
  )
}

export default App
