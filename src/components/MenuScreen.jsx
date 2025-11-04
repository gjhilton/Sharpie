import { css } from '../../styled-system/css';
import Button from './Button.jsx';
import Logo, { SIZE } from './Logo.jsx';
import SmallPrint from './SmallPrint.jsx';
import { GAME_MODES } from '../constants/stages.js';

const Intro = () => (
	<div
		className={css({
			fontSize: 'xl',
			marginBottom: '2rem',
		})}
	>
		A beginner-level workout to drill identifying secretary hand letters.
	</div>
);

const Menu = ({ onSelectMode }) => (
	<div
		className={css({
			marginBottom: '2rem',
		})}
	>
		<div
			className={css({
				marginBottom: '2rem',
			})}
		>
			<Button
				hero
				onClick={() => onSelectMode(GAME_MODES.ALL)}
				label="Start"
			/>
		</div>
		<div
			className={css({
				marginBottom: '1rem',
			})}
		>
			<p>Or practice only:</p>
		</div>
		<div
			className={css({
				display: 'grid',
				gridTemplateColumns: '1fr 1fr',
				gap: '1rem',
				rowGap: '0.2rem',
				maxWidth: '600px',
				margin: '0 auto',
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
			<Button label="Numerals" sublabel="(coming soon)" disabled />
			<Button label="Brevigraphs" sublabel="(coming soon)" disabled />
		</div>
	</div>
);

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
		<Logo size="l" />
	</header>
);

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
		
	</div>
);

export default MenuScreen;