import { css } from '../../styled-system/css';
import { Section, Heading } from './Layout.jsx';

const LandingSectionHowToUse = () => {
	return (
		<Section title={<Heading>How to use</Heading>}>
			<ol
				className={css({
					listStyleType: 'lower-roman',
					marginLeft: '1em',
					lineHeight: '1.6',
				})}
			>
				<li>
					You will be shown a character - a <em>graph</em>, in
					palaeography jargon - written in the secretary hand
				</li>
				<li>
					Use your computer keyboard or the onscreen keyboard to
					enter the graph you see
				</li>
				<li>
					See feedback about your answer: correct or incorrect
				</li>
				<li>Hit 'next' to see another graph</li>
				<li>
					Exit at any time by clicking the 'End game' button to
					view a summary of your score, and recap graphs
					identified wrongly
				</li>
			</ol>
		</Section>
	);
};

export default LandingSectionHowToUse;
