import { css } from '../../styled-system/css';
import Button from './Button.jsx';
import Logo, { SIZE } from './Logo.jsx';
import SmallPrint from './SmallPrint.jsx';
import { GAME_MODES } from '../constants/stages.js';

const Header = () => (
	<header
		className={css({
		margin: '2rem 0',
	  desktop: { 
	  	display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '2rem',
      alignItems: 'start',
	}
      
    })}
	>
	<div></div>
		<Logo size={SIZE.S} />
	</header>
);

const TwoColumn = ({ title, children }) => (
  <section
    className={css({
      marginBottom: '2rem',
	  desktop: { 
	  	display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '2rem',
      alignItems: 'start',
	}
      
    })}
  >
  
      {title}
  
    <div
      className={css({
        fontSize: 'l',
		alignSelf: "start"
      })}
    >
      {children}
    </div>
  </section>
);

const HeroButton = ({ onSelectMode }) => (
	<Button hero onClick={() => onSelectMode(GAME_MODES.ALL)} label="Start" />
);

const ModeButtons = ({ onSelectMode }) => (
	<div
		className={css({
			display: 'flex',
			flexDirection: { base: 'column', sm: 'row' },
			gap: 4, // 1rem

			mb: 6, // 1.5rem
		})}
	>
		<Button
			onClick={() => onSelectMode(GAME_MODES.MINUSCULE)}
			label="minuscules"
		/>
		<Button
			onClick={() => onSelectMode(GAME_MODES.MAJUSCULE)}
			label="MAJUSCULES"
		/>
	</div>
);

const CatalogueLink = ({ onShowCatalogue }) => (
	<p
		className={css({
			marginTop: '1rem',
		})}
	>
		You can also{' '}
		<a
			href="#"
			onClick={e => {
				e.preventDefault();
				onShowCatalogue();
			}}
		>
			view all characters
		</a>
		.
	</p>
);

const Overview = ({ onSelectMode }) => (
	<TwoColumn title={<PageTitle />}>
		<p className={css({
			marginBottom: "1rem"
		})}>
			Sharpie helps sharpen your eye for recognising letters written
			in the <em>secretary hand</em> used in the sixteenth and seventeenth
			centuries.
		</p>
		<HeroButton onSelectMode={onSelectMode} />
	</TwoColumn>
);

const PageTitle = () => (
	<h1
		className={css({
			fontSize: '3rem',
			fontWeight: 'bold',
			marginBottom: "2rem",
			desktop: { lineHeight: '3rem', }
		})}
	>
		Hone your{' '}
		<span className={css({ fontFamily: 'joscelyn' })}>Secretary</span>
	</h1>
);

const H2 = ({ children }) => (
	<h2
		className={css({
			fontSize: 'l',
			fontWeight: 'bold',
		})}
	>
		{children}
	</h2>
);

const Guide = ({ onSelectMode, onShowCatalogue }) => (
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
				Use your computer keyboard or the onscreen keyboard to enter the
				graph you see
			</li>
			<li>See feedback about your answer: correcr or incorrect.</li>
			<li>Hit 'next' to see another graph</li>
			<li>
				Exit at any time by clicking the 'End game' button to view a
				summary of your score, and recap graphs identified
				wrongly
			</li>
		</ol>
	</TwoColumn>
);

const Options = ({ onSelectMode, onShowCatalogue }) => (
	<TwoColumn title={<H2>Options</H2>}>
		<p>
			You can practice just <em>minuscules</em> (the manuscript equivalent
			of print "lowercase") or <em>majuscules</em> (≈"uppercase")
		</p>
		<ModeButtons onSelectMode={onSelectMode} />
		<CatalogueLink onShowCatalogue={onShowCatalogue} />
	</TwoColumn>
);

const NextSteps = () => (
	<TwoColumn title={<H2>Next steps</H2>}>
		<p>
			Many resources are available online to help you read secretary hand:
		</p>
		<ul>
			<li>
				<a href="https://www.english.cam.ac.uk/ceres/ehoc/">
					English Handwriting Online 1500-1700
				</a>
			</li>
			<li>
				<a href="https://beinecke.library.yale.edu/article/quarantine-reading-learn-read-secretary-hand">
					Beinecke Library
				</a>
			</li>
			<li>
				<a href="https://www.scotlandspeople.gov.uk/scottish-handwriting/tutorials">
					Scottish Handwriting
				</a>
			</li>
		</ul>
	</TwoColumn>
);

const MenuScreen = ({ onSelectMode, onShowCatalogue }) => (
	<div
		className={css({
			display: 'flex',
			flexDirection: 'column',
			maxWidth: '90%',
			desktop: {
			maxWidth: '800px',
			},
			margin: '0 auto 2rem',
			textAlign: 'left',
		})}
	>
		<Header />
		<main>
			<Overview onSelectMode={onSelectMode} />
			<Guide />
			<Options
				onShowCatalogue={onShowCatalogue}
				onSelectMode={onSelectMode}
			/>
			<NextSteps />
		</main>
		<SmallPrint />
	</div>
);

export default MenuScreen;
