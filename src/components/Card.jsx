import { css } from "../../styled-system/css"

const Card = ({ 
  title,
  letter,
  caption
}) => (
  <div className={css({
    maxWidth: "500px",
    margin: "1rem auto 2rem",
    border: "1px solid #ccc",
    padding: "1rem",
  })}>
     <div >
      {title ? title : "Identify the letterform"}
    </div>
    <div className="joscelyn">
      <div className={css({
    fontSize: "10rem",
     padding: "3rem 1rem"
  })}>
      {letter}
      </div>
    </div>
     <div className={css({
    fontSize: "2rem",
     padding: "1rem"
  })}>
      {caption ? caption : "?"}
    </div>
  </div>
)

export default Card