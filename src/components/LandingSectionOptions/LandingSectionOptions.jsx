import { css } from '../../../styled-system/css';
import ReactMarkdown from 'react-markdown';
import { Section, Heading, Paragraph } from '@components/Layout/Layout.jsx';
import { GAME_MODES } from '@constants/stages.js';
import optionsContent from '@data/options.md?raw';

const LandingSectionOptions = ({ selectedMode, setSelectedMode }) => {
	return (
		<Section title={<Heading>Options</Heading>}>
			<Paragraph>
				<ReactMarkdown
					components={{
						p: ({ children }) => <>{children}</>,
					}}
				>
					{optionsContent}
				</ReactMarkdown>
			</Paragraph>
			<fieldset
				className={css({
					border: 'none',
					padding: '0',
					margin: '0',
					marginBottom: '1.5rem',
				})}
			>
				<legend
					className={css({
						fontSize: 'm',
						fontWeight: 'bold',
						marginBottom: '0.5rem',
					})}
				>
					Game mode
				</legend>
				<div
					className={css({
						display: 'flex',
						flexDirection: { base: 'column', sm: 'row' },
						gap: '1rem',
					})}
				>
					<label
						className={css({
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem',
							cursor: 'pointer',
						})}
					>
						<input
							type="radio"
							name="gameMode"
							value={GAME_MODES.MINUSCULE}
							checked={selectedMode === GAME_MODES.MINUSCULE}
							onChange={e => setSelectedMode(e.target.value)}
						/>
						minuscules
					</label>
					<label
						className={css({
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem',
							cursor: 'pointer',
						})}
					>
						<input
							type="radio"
							name="gameMode"
							value={GAME_MODES.MAJUSCULE}
							checked={selectedMode === GAME_MODES.MAJUSCULE}
							onChange={e => setSelectedMode(e.target.value)}
						/>
						MAJUSCULES
					</label>
					<label
						className={css({
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem',
							cursor: 'pointer',
						})}
					>
						<input
							type="radio"
							name="gameMode"
							value={GAME_MODES.ALL}
							checked={selectedMode === GAME_MODES.ALL}
							onChange={e => setSelectedMode(e.target.value)}
						/>
						both
					</label>
				</div>
			</fieldset>
		</Section>
	);
};

export default LandingSectionOptions;
