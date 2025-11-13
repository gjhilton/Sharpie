import { Section, Heading } from './Layout.jsx';
import { css } from '../../styled-system/css';
import changelog from '../data/changelog.json';

const VersionEntry = ({ version, description }) => {
	return (
		<dl
			className={css({
				marginBottom: '1rem',
			})}
		>
			<dt
				className={css({
					fontWeight: 'bold',
					marginBottom: '0.25rem',
				})}
			>
				v{version}
			</dt>
			<dd
				className={css({
					marginLeft: 0,
					fontSize: 'm',
					lineHeight: '1.6',
				})}
			>
				{description}
			</dd>
		</dl>
	);
};

const LandingSectionNews = () => {
	const [mostRecent, ...olderVersions] = changelog;
	const reversedOlderVersions = [...olderVersions].reverse();

	return (
		<Section title={<Heading>What's new</Heading>}>
			{mostRecent && (
				<VersionEntry
					version={mostRecent.version}
					description={mostRecent.description}
				/>
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
							marginBottom: '0.5rem',
						})}
					>
						Show more
					</summary>
					{reversedOlderVersions.map(entry => (
						<VersionEntry
							key={entry.version}
							version={entry.version}
							description={entry.description}
						/>
					))}
				</details>
			)}
		</Section>
	);
};

export default LandingSectionNews;
