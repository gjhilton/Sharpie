import { css } from '../../styled-system/css';
import Button from './Button.jsx';
import Logo, { SIZE } from './Logo.jsx';
import SmallPrint from './SmallPrint.jsx';
import { GAME_MODES } from '../constants/stages.js';

// Shared styles
const textLeft = { textAlign: "left" };
const sectionSpacing = { marginBottom: 12 }; // 3rem
const bodyCopy = { fontSize: "xl" }; // ~1.25rem, closest to 1.3125rem

const Header = () => (
	<header
		className={css({
			py: 8, // 2rem
			mb: 8, // 2rem
		})}
	>
		<Logo size={SIZE.S} />
	</header>
);

const Main = () => <main className={css(sectionSpacing)}>
	<div
		className={css({
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gridTemplateRows: "auto auto",
			gap: 8, // 2rem
			mb: 8, // 2rem
			...bodyCopy
		})}
	>
		<div className={css({
			...textLeft,
			gridColumn: "1",
			gridRow: "1"
		})}>
			<h1 className={css({
				fontSize: "3xl" // 1.875rem, close to 2rem
			})}>Hone your <span className="joscelyn">Secretary</span>.</h1>
		</div>
		<div className={css({
			...textLeft,
			gridColumn: "2",
			gridRow: "2"
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
	<div className={css({
		...textLeft,
		...bodyCopy,
		mb: 4 // 1rem
	})}>
		Or practice just
	</div>
	<div className={css({
		display: "flex",
		gap: 4, // 1rem
		justifyContent: "center",
		mb: 6 // 1.5rem
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
	<div className={css({
		...textLeft,
		fontSize: "sm", // 0.875rem, close to 0.9rem
		fontStyle: "italic"
	})}>
		Tip: 'Majuscule" is the manuscript equivalent of 'uppercase' in print; 'minuscule', 'lowercase'.
	</div>
</aside>

const MenuScreen = ({ onSelectMode }) => (
	<div
		className={css({
			maxWidth: '900px',
			mx: 'auto',
			textAlign: 'center',
			p: 4, // 1rem
		})}
	>
		<Header />
		<Main />
		<Aside />
		<SmallPrint/>
	</div>
);

export default MenuScreen;