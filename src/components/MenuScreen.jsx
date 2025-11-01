import { css } from '../../styled-system/css';
import Button from './Button.jsx';
import { GAME_MODES } from '../constants/stages.js';
import logo from '../../artwork/sharpielogo.svg';

const Logo = () => (
	<div
		className={css({
			marginBottom: '2rem',
		})}
	>
		<img
			src={logo}
			alt="Sharpie Logo"
			className={css({
				maxWidth: '400px',
				width: '100%',
				height: 'auto',
			})}
		/>
	</div>
);

const Intro = () => (
	<div
		className={css({
			display: 'none',
		})}
	>
		A beginner-level workout in identifying secretary hand letterforms.
	</div>
);

const Menu = ({ onSelectMode }) => (
	<div
		className={css({
			display: 'grid',
			gridTemplateColumns: '1fr 1fr',
			gap: '1rem',
			maxWidth: '600px',
			margin: '0 auto',
		})}
	>
		<Button
			onClick={() => onSelectMode(GAME_MODES.MAJUSCULE)}
			label="Majuscule"
		/>
		<Button
			onClick={() => onSelectMode(GAME_MODES.MINUSCULE)}
			label="Minuscule"
		/>
		<Button
			onClick={() => onSelectMode(GAME_MODES.EXTRAS)}
			label="Extras"
		/>
		<Button onClick={() => onSelectMode(GAME_MODES.ALL)} label="All" />
	</div>
);

const Credit = () => (
	<div
		className={css({
			fontSize: '0.8rem',
			marginTop: '1rem',
		})}
	>
		Concept, code &amp; design (also all mistakes) copyright g.j.hilton /
		funeral games &copy;2025; MSS images ownership as noted
	</div>
);

const MenuScreen = ({ onSelectMode }) => {
	return (
		<div
			className={css({
				textAlign: 'center',
			})}
		>
			<Logo />
			<Intro />
			<Menu onSelectMode={onSelectMode} />
			<Credit />
		</div>
	);
};

export default MenuScreen;
