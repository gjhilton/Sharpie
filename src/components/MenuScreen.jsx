import { css } from '../../styled-system/css';
import Button from './Button.jsx';
import Logo, { SIZE } from './Logo.jsx';
import SmallPrint from './SmallPrint.jsx';
import { GAME_MODES } from '../constants/stages.js';

const Credit = () => (
	<SmallPrint>
		Concept, code &amp; design (also all mistakes) copyright g.j.hilton /
		funeral games &copy;2025; MSS images ownership as noted
	</SmallPrint>
);

const Header = () => (
	<header
		className={css({
			padding: '2rem 0',
			marginBottom: '2rem',
		})}
	>
		<Logo size={SIZE.S} />
	</header>
);

const Main = () => <main className={css({
		})}>
	<div
		className={css({
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: "2rem",
			marginBottom: "2rem",
			fontSize: "1.3125rem"
		})}
	>
		<div className={css({
			textAlign: "left"
		})}>
			<h1 className={css({
				fontSize: '2rem'
			})}>Hone your <span className="joscelyn">Secretary</span>.</h1>
		</div>
		<div></div>
	</div>
	<div
		className={css({
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: "2rem",
			marginBottom: "2rem"
		})}
	>
		<div></div>
		<div className={css({
			textAlign: "left"
		})}>
			<p className={css({
				
			})}>Sharpie helps you drill recognising letters written in the secretary hand used in the sixteenth and seventeenth centuries.</p>
		</div>
	</div>
	<div
		className={css({
			textAlign: "center"
		})}
	>
		<Button
			hero
			onClick={() => onSelectMode(GAME_MODES.ALL)}
			label="Start"
		/>
	</div>
</main>

const Aside = () => <aside>
		<div className={css({
			textAlign: "left"
		})}>
			Or practice just
			</div>
			<div>
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
			textAlign: "left"
		})}>
			Tip: 'Majuscule" is the manuscript equivalent of 'uppercase' in print: 'minuscule, lowercase')
			</div>
	</aside>

const MenuScreen = ({ onSelectMode }) => (
	<div
		className={css({
			maxWidth: '900px',
			margin: '0 auto',
			textAlign: 'center',
			padding: '1rem',
		})}
	>
		<Header />
		<Main />
		<Aside />
		<SmallPrint/>
	</div>
);

export default MenuScreen;