import { css } from '../../styled-system/css';
import Button from './Button.jsx';
import Logo, { SIZE } from './Logo.jsx';
import SmallPrint from './SmallPrint.jsx';
import { GAME_MODES } from '../constants/stages.js';

// Shared styles
const textLeft = { textAlign: "left" };
const sectionSpacing = { marginBottom: 12 }; // 3rem
const bodyCopy = { fontSize: "xl", lineHeight: "1.6" }; // ~1.25rem with improved readability
const visuallyHidden = {
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: 0,
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	border: 0
};

const Header = () => (
	<header
		className={css({
			py: 8, // 2rem
			mb: 8, // 2rem
			textAlign: "center"
		})}
	>
		<Logo size={SIZE.S} />
	</header>
);

const Main = () => <main className={css(sectionSpacing)}>
	<div
		className={css({
			display: "grid",
			gridTemplateColumns: { base: "1fr", md: "repeat(2, minmax(0, 1fr))" },
			gridTemplateRows: { base: "auto", md: "auto auto" },
			gap: 8, // 2rem
			mb: 8, // 2rem
			...bodyCopy
		})}
	>
		<div className={css({
			...textLeft,
			gridColumn: { base: "1", md: "1" },
			gridRow: { base: "auto", md: "1" }
		})}>
			<h1 className={css({
				fontSize: "2rem" 
			})}>Hone your <span className={css({ fontFamily: "Joscelyn" })}>Secretary</span>.</h1>
		</div>
		<div className={css({
			...textLeft,
			gridColumn: { base: "1", md: "2" },
			gridRow: { base: "auto", md: "2" }
		})}>
			<p>Sharpie helps you drill recognising letters written in the secretary hand used in the sixteenth and seventeenth centuries.</p>
		</div>
	</div>
	<div className={css({ textAlign: "center" })}>
		<Button
			hero
			onClick={() => onSelectMode(GAME_MODES.ALL)}
			label="Start"
		/>
	</div>
</main>

const Aside = () => <aside className={css(sectionSpacing)}>
	<h2 className={css(visuallyHidden)}>Practice Options</h2>
	<div className={css({
		...textLeft,
		...bodyCopy,
		mb: 4 // 1rem
	})}>
		Or practice just
	</div>
	<nav aria-label="Practice mode selection">
		<div className={css({
			display: "flex",
			flexDirection: { base: "column", sm: "row" },
			gap: 4, // 1rem
			justifyContent: "center",
			mb: 6, // 1.5rem
			alignItems: "center"
		})}>
			<Button
				onClick={() => onSelectMode(GAME_MODES.MINUSCULE)}
				label="minuscules"
			/>
			<Button
				onClick={() => onSelectMode(GAME_MODES.MAJUSCULE)}
				label="MAJUSCULES"
			/>
		</div>
	</nav>
	<div
		role="note"
		className={css({
			...textLeft,
			fontSize: "sm", // 0.875rem, close to 0.9rem
			fontStyle: "italic"
		})}
	>
		Tip: 'Majuscule' is the manuscript equivalent of 'uppercase' in print; 'minuscule', 'lowercase'.
	</div>
</aside>

const MenuScreen = ({ onSelectMode }) => (
	<div
		className={css({
			maxWidth: { base: "100%", md: "900px" },
			mx: 'auto',
			textAlign: 'center',
			px: 8, // 2rem horizontal padding
			py: 4, // 1rem vertical padding
		})}
	>
		<Header />
		<Main />
		<Aside />
		<SmallPrint/>
	</div>
);

export default MenuScreen;