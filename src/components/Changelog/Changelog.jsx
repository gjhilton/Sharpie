import { DL, DT, DD } from '@components/Layout/Layout';
import changelog from '@data/changelog.json';

export const VersionEntry = ({ version, description }) => (
	<>
		<DT>v{version}</DT>
		<DD>{description}</DD>
	</>
);

export const Changelog = () => (
	<DL>
		{changelog.map(entry => (
			<VersionEntry
				key={entry.version}
				version={entry.version}
				description={entry.description}
			/>
		))}
	</DL>
);
