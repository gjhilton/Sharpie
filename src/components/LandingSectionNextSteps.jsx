import { css } from '../../styled-system/css';
import { Section, Heading, Paragraph } from './Layout.jsx';

const LandingSectionNextSteps = () => {
	return (
		<Section title={<Heading>Next steps for learners</Heading>}>
			<Paragraph>
				Many resources are available online to help you read
				secretary hand:
			</Paragraph>
			<ul
				className={css({
					listStyleType: 'disc',
					marginLeft: '1em',
					lineHeight: '1.6',
				})}
			>
				<li>
					<a
						href="https://www.english.cam.ac.uk/ceres/ehoc/"
						target="_blank"
						rel="noopener noreferrer"
					>
						English Handwriting Online 1500-1700
					</a>
				</li>
				<li>
					<a
						href="https://beinecke.library.yale.edu/article/quarantine-reading-learn-read-secretary-hand"
						target="_blank"
						rel="noopener noreferrer"
					>
						Beinecke Library
					</a>
				</li>
				<li>
					<a
						href="https://www.scotlandspeople.gov.uk/scottish-handwriting/tutorials"
						target="_blank"
						rel="noopener noreferrer"
					>
						Scottish Handwriting
					</a>
				</li>
			</ul>
		</Section>
	);
};

export default LandingSectionNextSteps;
