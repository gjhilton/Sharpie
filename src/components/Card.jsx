import { css } from "../../styled-system/css"

const Card = ({ letter }) => (
  <div className={css({
    maxWidth: "500px",
    margin: "auto",
    border: "1px solid #ccc",
    padding: "4rem 1rem",
    fontSize: "10rem"
  })}>
    <div className="joscelyn">
      {letter}
    </div>
  </div>
)

export default Card