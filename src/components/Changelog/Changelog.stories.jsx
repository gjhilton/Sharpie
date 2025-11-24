import Changelog, { VersionEntry } from './Changelog';

export default {
	title: 'Components/Changelog',
	component: Changelog,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
};

export const Default = {};

export const SingleEntry = {
	render: () => (
		<dl>
			<VersionEntry version="1.0.0" description="Initial release" />
		</dl>
	),
};
