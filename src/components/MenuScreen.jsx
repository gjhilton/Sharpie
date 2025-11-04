import { css } from '../../styled-system/css';
import Button from './Button.jsx';
import Logo from './Logo.jsx';
import { GAME_MODES } from '../constants/stages.js';

const Intro = () => (
	<div
		className={css({
			fontSize: 'xl',
		})}
	>
		A beginner-level workout to drill identifying secretary hand letters.
	</div>
);

const Menu = ({ onSelectMode }) => (
	<div>
		<Button
			hero
			onClick={() => onSelectMode(GAME_MODES.ALL)}
			label="Start"
		/>
		<div>
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

const MenuScreen = ({ onSelectMode }) => (
	<div
		className={css({
			textAlign: 'center',
		})}
	>
		<div
			className={css({
				marginBottom: '2rem',
			})}
		>
			<Logo />
		</div>
		<Intro />
		<Menu onSelectMode={onSelectMode} />
		<Credit />
	</div>
);

export default MenuScreen;
