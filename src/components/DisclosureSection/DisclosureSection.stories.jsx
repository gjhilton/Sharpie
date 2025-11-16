import { useState } from 'react';
import DisclosureSection from '@components/DisclosureSection/DisclosureSection.jsx';
import { css } from '../../../styled-system/css';

export default {
	title: 'Components/DisclosureSection',
	component: DisclosureSection,
	tags: ['autodocs'],
};

export const Collapsed = {
	args: {
		title: 'Options',
		defaultExpanded: false,
		children: (
			<p>
				This is the content that will be revealed when the section is expanded. It can contain
				any React components.
			</p>
		),
	},
};

export const Expanded = {
	args: {
		title: 'Options',
		defaultExpanded: true,
		children: (
			<p>
				This is the content that will be revealed when the section is expanded. It can contain
				any React components.
			</p>
		),
	},
};

export const WithRichContent = {
	args: {
		title: 'How to play',
		defaultExpanded: true,
		children: (
			<div>
				<h3>Getting Started</h3>
				<p>Click the play button to begin the game.</p>
				<ul>
					<li>Identify the letter shown</li>
					<li>Click your answer</li>
					<li>Get instant feedback</li>
				</ul>
			</div>
		),
	},
};

export const LongTitle = {
	args: {
		title: 'Next steps for learners',
		defaultExpanded: false,
		children: (
			<p>
				Additional resources and suggestions for continuing your learning journey after mastering
				the basics.
			</p>
		),
	},
};

const StackedDisclosuresDemo = () => {
	return (
		<div>
			<DisclosureSection title="Options" defaultExpanded={false}>
				<p>Game configuration options including mode selection and alphabet choices.</p>
			</DisclosureSection>
			<DisclosureSection title="How to play" defaultExpanded={false}>
				<p>Instructions on gameplay, letter identification, and using hints.</p>
			</DisclosureSection>
			<DisclosureSection title="Next steps for learners" defaultExpanded={false}>
				<p>Additional resources for continued learning.</p>
			</DisclosureSection>
			<DisclosureSection title="What's new?" defaultExpanded={false}>
				<p>Changelog and version history.</p>
			</DisclosureSection>
		</div>
	);
};

export const StackedSections = {
	render: () => <StackedDisclosuresDemo />,
};

const InteractiveDemo = () => {
	const [expandedSection, setExpandedSection] = useState(null);

	return (
		<div>
			<p className={css({ marginBottom: '1rem' })}>
				Click on section headers to expand/collapse them. Currently expanded:{' '}
				<strong>{expandedSection || 'None'}</strong>
			</p>
			<DisclosureSection title="First Section" defaultExpanded={false}>
				<p>Content of the first section.</p>
			</DisclosureSection>
			<DisclosureSection title="Second Section" defaultExpanded={true}>
				<p>Content of the second section (starts expanded).</p>
			</DisclosureSection>
			<DisclosureSection title="Third Section" defaultExpanded={false}>
				<p>Content of the third section.</p>
			</DisclosureSection>
		</div>
	);
};

export const Interactive = {
	render: () => <InteractiveDemo />,
};
