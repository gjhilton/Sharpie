import { css } from '../../../styled-system/css';
import ReactMarkdown from 'react-markdown';
import { Section, Heading, Paragraph } from '@components/Layout/Layout.jsx';
import { DB } from '@data/DB.js';
import * as db from '@utilities/database.js';
import handsContent from '@data/hands-section.md?raw';

const LandingSectionAlphabets = ({ enabledAlphabets, onShowCatalogue }) => {
	const totalCharacters = db.countTotalCharacters(DB);
	const enabledCharacters = db.countEnabledCharacters(DB, enabledAlphabets);
	const totalAlphabets = db.getAllAlphabetNames(DB).length;
	const enabledAlphabetsCount = db.countEnabledAlphabets(enabledAlphabets);

	return (
		<Section title={<Heading>Alphabets</Heading>}>
			<Paragraph>
				Database contains {totalCharacters} individual characters total
				from {totalAlphabets} different alphabets.
			</Paragraph>
			<Paragraph>
				Currently the game is using {enabledCharacters} characters from{' '}
				{enabledAlphabetsCount} alphabets (
				<a
					href="#"
					onClick={e => {
						e.preventDefault();
						onShowCatalogue();
					}}
					className={css({
						textDecoration: 'underline',
					})}
				>
					you can configure which alphabets you want to include
				</a>
				).
			</Paragraph>
			<Paragraph>
				<ReactMarkdown
					components={{
						p: ({ children }) => <>{children}</>,
					}}
				>
					{handsContent}
				</ReactMarkdown>
			</Paragraph>
		</Section>
	);
};

export default LandingSectionAlphabets;
