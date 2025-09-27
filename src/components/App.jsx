import { useState } from 'react'
import KB from './KB.jsx'
import '../style/App.css'
import { css } from "../../styled-system/css";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className={css({ maxWidth:"400px", margin: "0 auto", fontWeight: "bold" })}>>
      <KB />
    </div>
  )
}

export default App
