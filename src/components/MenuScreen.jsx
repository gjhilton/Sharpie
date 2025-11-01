import { css } from '../../styled-system/css';
import StageButton from './StageButton.jsx';
import { GAME_MODES } from '../constants/stages.js';

const MenuScreen = ({ onSelectMode }) => {
	return (
		<div>
			<h1
				className={css({
					fontSize: '3rem',
					textAlign: 'center',
					marginBottom: '2rem',
				})}
			>
				Select Game Mode
			</h1>
			<div
				className={css({
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: '1rem',
					maxWidth: '600px',
					margin: '0 auto',
				})}
			>
				<StageButton
					onClick={() => onSelectMode(GAME_MODES.MAJUSCULE)}
					label="Majuscule"
				/>
				<StageButton
					onClick={() => onSelectMode(GAME_MODES.MINUSCULE)}
					label="Minuscule"
				/>
				<StageButton
					onClick={() => onSelectMode(GAME_MODES.EXTRAS)}
					label="Extras"
				/>
				<StageButton
					onClick={() => onSelectMode(GAME_MODES.ALL)}
					label="All"
				/>
			</div>
			<div
				className={css({
					marginTop: '2rem',
					textAlign: 'center',
					color: '#666',
					fontSize: '0.9rem',
				})}
			>
				<p>Majuscule: Uppercase letters (A-Z)</p>
				<p>Minuscule: Lowercase letters (a-z)</p>
				<p>Extras: Numbers and punctuation</p>
				<p>All: Everything combined</p>
			</div>
		</div>
	);
};

export default MenuScreen;
