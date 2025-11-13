import { Section, Heading, Paragraph } from './Layout.jsx';
import { css } from '../../styled-system/css';
import changelog from '../data/changelog.json';

const LandingSectionNews = () => {
	const [mostRecent, ...olderVersions] = changelog;
	const reversedOlderVersions = [...olderVersions].reverse();

	return (
		<Section title={<Heading>What's new</Heading>}>
			{mostRecent && (
				<div
					className={css({
						marginBottom: '1rem',
					})}
				>
					<Paragraph>
						<strong>v{mostRecent.version}</strong>
					</Paragraph>
					<Paragraph>{mostRecent.description}</Paragraph>
				</div>
			)}

			{olderVersions.length > 0 && (
				<details
					className={css({
						marginTop: '1rem',
					})}
				>
					<summary
						className={css({
							cursor: 'pointer',
							fontWeight: 'bold',
							marginBottom: '0.5rem',
						})}
					>
						Show more
					</summary>
					{reversedOlderVersions.map(entry => (
						<div
							key={entry.version}
							className={css({
								marginBottom: '1rem',
							})}
						>
							<Paragraph>
								<strong>v{entry.version}</strong>
							</Paragraph>
							<Paragraph>{entry.description}</Paragraph>
						</div>
					))}
				</details>
			)}
		</Section>
	);
};

export default LandingSectionNews;
