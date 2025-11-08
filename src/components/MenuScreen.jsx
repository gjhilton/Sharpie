import { css } from '../../styled-system/css';
import Button from './Button.jsx';
import Logo, { SIZE } from './Logo.jsx';
import SmallPrint from './SmallPrint.jsx';
import {
	PageWidth,
	PageTitle,
	Heading,
	Paragraph,
	Section,
} from './Layout.jsx';
import { GAME_MODES } from '../constants/stages.js';

const HeroButton = ({ onSelectMode }) => (
	<Button hero onClick={() => onSelectMode(GAME_MODES.ALL)} label="Start" />
);

const ModeButtons = ({ onSelectMode }) => (
	<div
		className={css({
			display: 'flex',
			flexDirection: { base: 'column', sm: 'row' },
			gap: '1rem',
			marginBottom: '1.5rem',
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
	<Paragraph
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
	</Paragraph>
);

const MenuScreen = ({ onSelectMode, onShowCatalogue, onShowFeedback }) => (
	<PageWidth>
		<header
		className={css({
			gridColumn: '1 / -1',
		})}
	>
	<div
	className={css({

			marginBottom: '2rem',
		})}
	>
	<Logo size={SIZE.S} />
	</div>
	<figure>
    <img alt="Secretary Hand" src="secretary_hand.gif"/>
    <figcaption
	className={css({
	margin: '1rem 0',
	fontSttle: 'italic',
			fontSize: 's',
		})}
	>“The secretarie Alphabete” Jehan de Beau-Chesne & John Baildon, A booke containing diuers sortes of hands (London, 1602). First published 1570.</figcaption>
</figure>
		
		
	
	</header>
		<Section
			title={
				<PageTitle>
					Hone your{' '}
					<span className={css({ fontFamily: 'joscelyn' })}>
						Secretary
					</span>
				</PageTitle>
			}
		>
			<Paragraph>
				Sharpie helps sharpen your eye for recognising letters written
				in the <em>secretary hand</em> used in the sixteenth and
				seventeenth centuries.
			</Paragraph>
			<HeroButton onSelectMode={onSelectMode} />
		</Section>

		<Section title={<Heading>How to use</Heading>}>
			<ol
				className={css({
					listStyleType: 'lower-roman',
					marginLeft: '1em',
					lineHeight: '1.6',
				})}
			>
				<li>
					You will be shown a character - a <em>graph</em>, in
					palaeography jargon - written in the secretary hand
				</li>
				<li>
					Use your computer keyboard or the onscreen keyboard to enter
					the graph you see
				</li>
				<li>See feedback about your answer: correct or incorrect</li>
				<li>Hit 'next' to see another graph</li>
				<li>
					Exit at any time by clicking the 'End game' button to view a
					summary of your score, and recap graphs identified wrongly
				</li>
			</ol>
		</Section>

		<Section title={<Heading>Options</Heading>}>
			<Paragraph>
				You can practice just <em>minuscules</em> (the manuscript
				equivalent of print "lowercase") or <em>majuscules</em>{' '}
				(≈"uppercase")
			</Paragraph>
			<ModeButtons onSelectMode={onSelectMode} />
			<CatalogueLink onShowCatalogue={onShowCatalogue} />
		</Section>

		<Section title={<Heading>Next steps</Heading>}>
			<Paragraph>
				Many resources are available online to help you read secretary
				hand:
			</Paragraph>
			<ul
				className={css({
					listStyleType: 'disc',
					marginLeft: '1em',
					lineHeight: '1.6',
				})}
			>
				<li>
					<a
						href="https://www.english.cam.ac.uk/ceres/ehoc/"
						target="_blank"
						rel="noopener noreferrer"
					>
						English Handwriting Online 1500-1700
					</a>
				</li>
				<li>
					<a
						href="https://beinecke.library.yale.edu/article/quarantine-reading-learn-read-secretary-hand"
						target="_blank"
						rel="noopener noreferrer"
					>
						Beinecke Library
					</a>
				</li>
				<li>
					<a
						href="https://www.scotlandspeople.gov.uk/scottish-handwriting/tutorials"
						target="_blank"
						rel="noopener noreferrer"
					>
						Scottish Handwriting
					</a>
				</li>
			</ul>
		</Section>

		<SmallPrint onShowFeedback={onShowFeedback} />
	</PageWidth>
);

export default MenuScreen;
