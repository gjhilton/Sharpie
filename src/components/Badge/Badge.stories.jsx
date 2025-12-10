import { useState } from 'react';
import { Badge } from './Badge';

const Strong = ({ children }) => (
	<span style={{ fontWeight: 'bold' }}>{children}</span>
);

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
		onClick: {
			description: 'Optional click handler - makes the badge interactive',
			action: 'clicked',
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
			<Badge>
				minuscules <Strong>✓</Strong> MAJUSCULES <Strong>✓</Strong>
			</Badge>
			<Badge>
				minuscules <Strong>✓</Strong> MAJUSCULES <Strong>✗</Strong>
			</Badge>
			<Badge>
				minuscules <Strong>✗</Strong> MAJUSCULES <Strong>✓</Strong>
			</Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Different mode badge variations used in OptionsSummary. Shows which letter types are active.',
			},
		},
	},
};

// Story: Alphabet Count Badges
export const AlphabetCountBadges = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
			<Badge>Alphabets <Strong>1</Strong></Badge>
			<Badge>Alphabets <Strong>2</Strong></Badge>
			<Badge>Alphabets <Strong>3</Strong></Badge>
			<Badge>Alphabets <Strong>5</Strong></Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Badges showing alphabet counts with bold numbers',
			},
		},
	},
};

// Story: Letter Count Badges
export const LetterCountBadges = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
			<Badge>Letters <Strong>24</Strong></Badge>
			<Badge>Letters <Strong>26</Strong></Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Badges showing letter counts (24 without J and V, 26 with all letters)',
			},
		},
	},
};

// Story: Toggle State Badges
export const ToggleStateBadges = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
			<Badge>Baseline <Strong>✓</Strong></Badge>
			<Badge>Baseline <Strong>✗</Strong></Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Badges showing toggle states with bold icons',
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
			<Badge testId="badge-mode">minuscules <Strong>✓</Strong> MAJUSCULES <Strong>✓</Strong></Badge>
			<Badge testId="badge-alphabets">Alphabets <Strong>3</Strong></Badge>
			<Badge testId="badge-letters">Letters <Strong>26</Strong></Badge>
			<Badge testId="badge-baseline">Baseline <Strong>✓</Strong></Badge>
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

// Story: Interactive Badge
export const InteractiveBadge = {
	args: {
		children: 'Click me',
		onClick: () => console.log('Badge clicked'),
	},
	parameters: {
		docs: {
			description: {
				story: 'Badge with onClick handler - becomes interactive with hover and active states. Click to see the action logged.',
			},
		},
	},
};

// Story: Clickable vs Non-Clickable
export const ClickableComparison = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
			<Badge>Non-clickable</Badge>
			<Badge onClick={() => console.log('Clicked')}>Clickable</Badge>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Comparison of non-clickable badge (no onClick) and clickable badge (with onClick). Clickable badges show hover effects.',
			},
		},
	},
};

// Story: Interactive Toggle Example
export const InteractiveToggleExample = {
	render: () => {
		const [enabled, setEnabled] = useState(false);
		return (
			<Badge onClick={() => setEnabled(!enabled)}>
				Option <Strong>{enabled ? '✓' : '✗'}</Strong>
			</Badge>
		);
	},
	parameters: {
		docs: {
			description: {
				story: 'Example of a toggle-style interactive badge, like those used for boolean options in OptionsSummary.',
			},
		},
	},
};
