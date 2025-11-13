import { css } from '../../../styled-system/css';
import Toggle from '@components/Toggle/Toggle.jsx';
import { Section, Heading, Paragraph } from '@components/Layout/Layout.jsx';

const LandingSectionAlphabet = ({
	twentyFourLetterAlphabet,
	setTwentyFourLetterAlphabet,
}) => {
	return (
		<Section title={<Heading>i / j &amp; u / v</Heading>}>
			<Paragraph>
				During this era, the alphabet had 24 letters. <em>I</em> and <em>J</em> were the same letter, as were <em>U</em> and{' '}
				<em>V</em>: In each case, two graphs - two characters -  could be used to write the same letter. 'V' for example was more often used to begin a word, with the 'u' form preferred for the body of the word. By default, Sharpie asks you to identify 'I' and 'J' separately - effectivey a 26-leter alphabet. If this feels anachronistic however, you can also opt into...
			</Paragraph>
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
			<Paragraph>
				When this option is enabled, if you are shown a 'J' and answer 'I', that answer will be accepted.
			</Paragraph>
		</Section>
	);
};

export default LandingSectionAlphabet;
