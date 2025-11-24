import { DL, DT, DD } from '@components/Layout/Layout.jsx';
import changelog from '@data/changelog.json';

const VersionEntry = ({ version, description }) => (
	<>
		<DT>v{version}</DT>
		<DD>{description}</DD>
	</>
);

const Changelog = () => (
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

export { VersionEntry };
export default Changelog;
