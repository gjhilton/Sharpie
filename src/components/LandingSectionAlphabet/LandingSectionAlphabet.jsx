import { css } from '../../../styled-system/css';
import Toggle from '@components/Toggle/Toggle.jsx';
import { Section, Heading } from '@components/Layout/Layout.jsx';
import MarkdownWithPlaceholders from '@components/MarkdownWithPlaceholders/MarkdownWithPlaceholders.jsx';
import alphabetContent from '@data/alphabet.md?raw';

const LandingSectionAlphabet = ({
	twentyFourLetterAlphabet,
	setTwentyFourLetterAlphabet,
}) => {
	const placeholders = {
		ALPHABET_TOGGLE: (
			<div
				className={css({
					marginTop: '1rem',
				})}
			>
				<Toggle
					id="twenty-four-letter-alphabet"
					label="24-letter alphabet"
					checked={twentyFourLetterAlphabet}
					onChange={setTwentyFourLetterAlphabet}
				/>
			</div>
		),
	};

	return (
		<Section title={<Heading>i / j &amp; u / v</Heading>}>
			<MarkdownWithPlaceholders
				content={alphabetContent}
				placeholders={placeholders}
			/>
		</Section>
	);
};

export default LandingSectionAlphabet;
