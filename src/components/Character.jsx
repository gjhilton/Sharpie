import { css } from '../../styled-system/css';
import CharacterImage from './CharacterImage.jsx';
import CharacterImageSlideshow from './CharacterImageSlideshow.jsx';

const RedOverlay = () =>  <div className={css({
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
		  mixBlendMode: "lighten",
          height: "100%",
          backgroundColor: "red"
        })}></div>

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
        <img src="http://192.168.1.198:6006/data/joscelyn-min/a.png" />
       { state==='incorrectAnswer' && <RedOverlay />}
      </div>
    </div>

	)
};

export default Character;


/*

if (state === 'awaitAnswer') {
		return <CharacterImage imagePath={imagePath} />;
	}

	if (state === 'correctAnswer') {
		return (
			<div
				className={css({
					maxWidth: '500px',
					margin: '1rem auto 2rem',
					border: '2px solid green',
					padding: '1rem',
				})}
			>
				<div
					className={css({
						fontSize: 'xl',
						padding: '1rem',
						textAlign: 'center',
					})}
				>
					{character}
				</div>
				<CharacterImage imagePath={imagePath} />
				<div
					className={css({
						textAlign: 'center',
						color: 'green',
						fontSize: 'xl',
						margin: '1rem',
					})}
				>
					✅
				</div>
				{sourceLink && (
					<div
						className={css({
							textAlign: 'center',
							fontSize: 's',
							padding: '0.5rem',
						})}
					>
						<a
							href={sourceLink}
							target="_blank"
							rel="noopener noreferrer"
							className={css({
								color: 'blue',
								textDecoration: 'underline',
							})}
						>
							{sourceTitle || 'Source'}
						</a>
					</div>
				)}
			</div>
		);
	}

	if (state === 'incorrectAnswer') {
		return (
			<div
				className={css({
					maxWidth: '500px',
					margin: '1rem auto 2rem',
					border: '2px solid red',
					padding: '1rem',
				})}
			>
				<div
					className={css({
						fontSize: 'xl',
						padding: '1rem',
						textAlign: 'center',
					})}
				>
					{character}
				</div>
				<CharacterImageSlideshow imagePaths={imagePaths} />
				<div
					className={css({
						textAlign: 'center',
						color: 'red',
						fontSize: 'xl',
						margin: '1rem',
					})}
				>
					❌
				</div>
			</div>
		);
	}

	return null;


	*/