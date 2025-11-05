import { css } from '../../styled-system/css';
import CharacterImage from './CharacterImage.jsx';
import CharacterImageSlideshow from './CharacterImageSlideshow.jsx';
import Icon, { ICON_TYPE } from './Icon.jsx';

const RedOverlay = () =>  <div className={css({
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
		  mixBlendMode: "lighten",
          height: "100%",
          backgroundColor: "red"
        })}></div>

const Source = ({sourceTitle, sourceLink}) =>  <div className={css({
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
		    display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-end"
        })}>

			  <span className={css({
								fontSize:"0.8rem"
							})}><a
							href={sourceLink}
							target="_blank"
							rel="noopener noreferrer"
							className={css({
								color: 'blue',
								textDecoration: 'underline',
							})}
						>
							{sourceTitle || 'Source'}
						</a></span>
		</div>

const Character = ({
	state,
	imagePath,
	imagePaths,
	character,
	sourceLink,
	sourceTitle,
}) => {
	return(

		
	 <div className={css({ height: "300px", width: "300px", position: "relative" })}>
      <div className={css({ position: "relative" })}>
		{state !== 'awaitAnswer' && <div  className={css({ position: "absolute", padding:"1rem", fontSize: "24px", fontWeight: "900" })}>{character}
			<Icon icon={state === "correctAnswer" ? ICON_TYPE.TICK : ICON_TYPE.CROSS} />
		</div>}
       { imagePath ? <CharacterImage imagePath={imagePath} />  :
	   <CharacterImageSlideshow imagePaths={imagePaths} />}
       { state==='incorrectAnswer' && <RedOverlay />}
{ state==='correctAnswer' && <Source sourceTitle={sourceTitle} sourceLink={sourceLink}/>}
	  
      </div>
    </div>

	)
};

export default Character;