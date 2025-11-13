import { css } from '../../../styled-system/css';
import Button from '@components/Button/Button.jsx';
import { Section, Heading, Paragraph } from '@components/Layout/Layout.jsx';
import { GAME_MODES } from '@constants/stages.js';

const LandingSectionOptions = ({
	onSelectMode,
	twentyFourLetterAlphabet,
	onShowCatalogue,
}) => {
	return (
		<Section title={<Heading>Options</Heading>}>
			<Paragraph>
				You can practice just <em>minuscules</em> (the manuscript
				equivalent of print "lowercase") or <em>majuscules</em>{' '}
				(≈"uppercase")
			</Paragraph>
			<div
				className={css({
					display: 'flex',
					flexDirection: { base: 'column', sm: 'row' },
					gap: '1rem',
					marginBottom: '1.5rem',
				})}
			>
				<Button
					onClick={() =>
						onSelectMode(GAME_MODES.MINUSCULE, twentyFourLetterAlphabet)
					}
					label="minuscules"
				/>
				<Button
					onClick={() =>
						onSelectMode(GAME_MODES.MAJUSCULE, twentyFourLetterAlphabet)
					}
					label="MAJUSCULES"
				/>
			</div>
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
		</Section>
	);
};

export default LandingSectionOptions;
