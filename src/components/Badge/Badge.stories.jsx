import Badge from './Badge';

export default {
	title: 'Components/Badge',
	component: Badge,
	tags: ['autodocs'],
	argTypes: {
		children: {
			control: 'text',
			description: 'The content to display inside the badge',
		},
		testId: {
			control: 'text',
			description: 'Optional test ID for the badge',
		},
	},
};

// Story: Default Badge
export const Default = {
	args: {
		children: 'Default Badge',
	},
};

// Story: Mode Badges
export const ModeBadges = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
			<Badge>ALL</Badge>
			<Badge>minuscules only</Badge>
			<Badge>MAJUSCULES only</Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Different mode badge variations used in OptionsSummary',
			},
		},
	},
};

// Story: Alphabet Count Badges
export const AlphabetCountBadges = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
			<Badge>1 alphabet</Badge>
			<Badge>2 alphabets</Badge>
			<Badge>3 alphabets</Badge>
			<Badge>5 alphabets</Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Badges showing alphabet counts',
			},
		},
	},
};

// Story: Letter Count Badges
export const LetterCountBadges = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
			<Badge>24 letters</Badge>
			<Badge>26 letters</Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Badges showing letter counts (with or without J and V)',
			},
		},
	},
};

// Story: Toggle State Badges
export const ToggleStateBadges = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
			<Badge>Baselines ON</Badge>
			<Badge>Baselines OFF</Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Badges showing toggle states',
			},
		},
	},
};

// Story: Single Badge
export const SingleBadge = {
	args: {
		children: 'Status: Active',
		testId: 'status-badge',
	},
};

// Story: Numeric Badge
export const NumericBadge = {
	args: {
		children: '42',
	},
	parameters: {
		docs: {
			description: {
				story: 'Badge with numeric content',
			},
		},
	},
};

// Story: Long Text Badge
export const LongTextBadge = {
	args: {
		children: 'This is a very long badge text that will not wrap',
	},
	parameters: {
		docs: {
			description: {
				story: 'Badge with long text content. The whiteSpace: nowrap prevents text wrapping.',
			},
		},
	},
};

// Story: Badge Group
export const BadgeGroup = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
			<Badge testId="badge-mode">ALL</Badge>
			<Badge testId="badge-alphabets">3 alphabets</Badge>
			<Badge testId="badge-letters">26 letters</Badge>
			<Badge testId="badge-baseline">Baselines ON</Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Example of multiple badges displayed together, as seen in OptionsSummary',
			},
		},
	},
};

// Story: Badge with Special Characters
export const SpecialCharacters = {
	args: {
		children: 'Option & Value',
	},
	parameters: {
		docs: {
			description: {
				story: 'Badge containing special characters',
			},
		},
	},
};

// Story: Empty Badge
export const EmptyBadge = {
	args: {
		children: '',
	},
	parameters: {
		docs: {
			description: {
				story: 'Badge with no content (edge case)',
			},
		},
	},
};
