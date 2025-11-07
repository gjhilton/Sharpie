import { css } from '../../styled-system/css';
import Button from './Button.jsx';
import Logo, { SIZE } from './Logo.jsx';
import SmallPrint from './SmallPrint.jsx';
import { GAME_MODES } from '../constants/stages.js';

const SPACING = {
	SECTION_GAP: '2rem',
};

const MenuScreen = ({ onSelectMode, onShowCatalogue }) => (
	<div
		className={css({
			display: 'flex',
			flexDirection: 'column',
			gap: SPACING.SECTION_GAP,
			padding: SPACING.SECTION_GAP,
			maxWidth: '1200px',
			margin: '0 auto',
		})}
	>
		<Header />
		<main>
			<Overview onSelectMode={onSelectMode} />
			<Guide
				onShowCatalogue={onShowCatalogue}
				onSelectMode={onSelectMode}
			/>
			<NextSteps />
		</main>
		<SmallPrint />
	</div>
);

const Header = () => (
	<header
		className={css({
			textAlign: 'center',
			marginBottom: '1rem'
		})}
	>
		<Logo size={SIZE.M} />
	</header>
);

const Overview = ({ onSelectMode }) => (
	<section
		className={css({
			display: 'flex',
			flexDirection: 'column',
			gap: '1rem',
			marginBottom: '1rem',
		})}
	>
		<h2
			className={css({
				fontSize: 'l',
				fontWeight: 'bold',
				margin: 0,
				textAlign: 'left',
				borderBottom: '2px solid black',
				paddingBottom: '0.5rem',
			})}
		>
			Hone your{' '}
			<span className={css({ fontFamily: 'joscelyn' })}>Secretary</span>{' '}
			skills
		</h2>
		<div
			className={css({
				maxWidth: '600px',
				fontSize: 'l',
			})}
		>
			<p>
				Sharpie helps you sharpen your eye for recognising letters written in the <em>secretary hand</em> used in the sixteenth and seventeenth centuries.
			</p>
		</div>
		<div className={css({ textAlign: 'center' })}>
			<Button
				hero
				onClick={() => onSelectMode(GAME_MODES.ALL)}
				label="Start"
			/>
		</div>
	</section>
);

const Guide = ({ onSelectMode, onShowCatalogue }) => (
	<section
		className={css({
			display: 'flex',
			flexDirection: 'column',
			gap: '1rem',
		})}
	>
		<h2
			className={css({
				fontSize: 'l',
				fontWeight: 'bold',
				margin: 0,
				textAlign: 'left',
				borderBottom: '2px solid black',
				paddingBottom: '0.5rem',
			})}
		>
			How to use
		</h2>
		<div
			className={css({
				maxWidth: '600px',
				fontSize: 'l',
			})}
		>
			<ol
				className={css({
					listStyleType: 'lower-roman',
					marginLeft: '2rem',
				})}
			>
				<li>
					You will be shown a character - a <em>graph</em>, as
					palaeographers call it - written in the secretary hand
				</li>
				<li>
					Use your computer keyboard or the onscreen keyboard to enter
					the graph you see
				</li>
				<li>See feedback about your answer: correcr or incorrect.</li>
				<li>Hit 'next' to see another graph</li>
				<li>
					Exit at any time by clicking the 'End game' button to view a
					summary of your score, and recap of any graphs identified
					wrongly
				</li>
			</ol>
			<p
				className={css({
					marginTop: '1rem',
				})}
			>
				You can practice just <em>majuscules</em> (the manuscript
				equivalent of print "uppercase") or <em>minuscules</em>{' '}
				(≈"lowercase")
			</p>
		</div>
		<div
			className={css({
				display: 'flex',
				flexDirection: { base: 'column', sm: 'row' },
				gap: 4, // 1rem
				justifyContent: 'center',
				mb: 6, // 1.5rem
				alignItems: 'center',
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
		<div
			className={css({
				maxWidth: '600px',
				fontSize: 'l',
			})}
		>
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
					className={css({
						color: 'inherit',
						textDecoration: 'underline',
						cursor: 'pointer',
						'&:hover': {
							textDecoration: 'none',
						},
					})}
				>
					view all specimen characters
				</a>
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
		<h2
			className={css({
				fontSize: 'l',
				fontWeight: 'bold',
				margin: 0,
				textAlign: 'left',
				borderBottom: '2px solid black',
				paddingBottom: '0.5rem',
			})}
		>
			Next steps
		</h2>
		<div
			className={css({
				maxWidth: '600px',
				fontSize: 'l',
			})}
		>
			<p>
				Many resources are available online to help you read secretary
				hand:
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
		</div>
	</section>
);

export default MenuScreen;
