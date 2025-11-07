import { css } from '../../styled-system/css';
import Button from './Button.jsx';
import Logo, { SIZE } from './Logo.jsx';
import SmallPrint from './SmallPrint.jsx';
import { GAME_MODES } from '../constants/stages.js';

const Header = () => (
  <header
    className={css({
      textAlign: 'center',
      margin: '1rem 0'
    })}
  >
    <Logo size={SIZE.M} />
  </header>
);

const TwoColumn = ({title,children}) =>
  <section className={css({
  display: "grid",
  gridTemplateColumns: "1fr 2fr",
  alignItems: 'start'
    })}> 
	{title}
	<div className={
	css({
	fontSize:"l"
    })
	}>{children}</div>
</section>




	  
	
const Overview = ({ onSelectMode }) => (
		<TwoColumn title = {<PageTitle/>}>
      <p>
        Sharpie helps you sharpen your eye for recognising letters written in the <em>secretary hand</em> used in the sixteenth and seventeenth centuries.
      </p>
	  <HeroButton onSelectMode={onSelectMode} />
		</TwoColumn>
)

const PageTitle =  () => <h1 className = {css({
  fontSize: 'xl',
  fontWeight: 'bold',
  lineHeight: '2rem'
})}>
      Hone your{' '}
      <span className={css({ fontFamily: 'joscelyn' })}>Secretary</span>{' '}
      skills
    </h1>
	
const H2 =  ({children}) => <h2 className = {css({
  fontSize: 'xl',
  fontWeight: 'bold',
  lineHeight: '2rem'
})}>
{children}
    </h2>


const Guide = () => (
  	<TwoColumn title={<H2>How to use</H2>}>
	     <ol
        className={css({
          listStyleType: 'lower-roman',
          marginLeft: '1em',
        })}
      >
        <li>
          You will be shown a character - a <em>graph</em>, in
          palaeography jargon - written in the secretary hand
        </li>
        <li>
          Use your computer keyboard or the onscreen keyboard to enter the graph you see
        </li>
        <li>See feedback about your answer: correcr or incorrect.</li>
        <li>Hit 'next' to see another graph</li>
        <li>
          Exit at any time by clicking the 'End game' button to view a summary of your score, and recap of any graphs identified wrongly
        </li>
      </ol>
	</TwoColumn>
)
	
const Options = ({ onSelectMode, onShowCatalogue }) => (
<TwoColumn title={<H2>Options</H2>}>
<p
      >
        You can practice just <em>majuscules</em> (the manuscript equivalent of print "uppercase") or <em>minuscules</em>{' '}(≈"lowercase")
      </p>
	  <ModeButtons onSelectMode={onSelectMode} /> 
	  <CatalogueLink onShowCatalogue={onShowCatalogue} />
</TwoColumn>)



const MenuScreen = ({ onSelectMode, onShowCatalogue }) => (
 <div
    className={css({
      display: 'flex',
      flexDirection: 'column',
      gap: "2rem",
      padding: "2rem",
      maxWidth: '900px',
      margin: '0 auto',
	  textAlign: 'left'
    })}
  >
  	<Header />
	<main>
		 <Overview onSelectMode={onSelectMode} />
		  <Guide/>
	   <Options
        onShowCatalogue={onShowCatalogue}
        onSelectMode={onSelectMode}
      />
	  <NextSteps />
	</main>
	<SmallPrint />
  </div>
)

export default MenuScreen;







/*








const MenuScreen = ({ onSelectMode, onShowCatalogue }) => (
 
    <Header />
    <main>
	
	
	
	
      <Overview onSelectMode={onSelectMode} />
     
      
    </main>
    <SmallPrint />
  </div>
);






const Guide = ({ onSelectMode, onShowCatalogue }) => (
  <section
    className={css({
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    })}
  >
    <h2 className={headingStyles}>
      How to use
    </h2>
    <div
      className={css({
        maxWidth: '600px',
        fontSize: 'l',
      })}
    >
 
      
    </div>
   
    <div
      className={css({
        maxWidth: '600px',
        fontSize: 'l',
      })}
    >
     
        .
      </p>
    </div>
  </section>
);

const NextSteps = () => (
  <section
    className={css({
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      marginBottom: '1rem',
    })}
  >
    <h2 className={headingStyles}>
      Next steps
    </h2>
    <div
      className={css({
        maxWidth: '600px',
        fontSize: 'l',
      })}
    >
    
    </div>
  </section>
);

*/

