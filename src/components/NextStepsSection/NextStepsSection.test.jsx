import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextStepsSection } from './NextStepsSection';

vi.mock('@components/SubSection/SubSection.jsx', () => ({
	SubSection: ({ title, children }) => (
		<section>
			<h3>{title}</h3>
			{children}
		</section>
	),
}));

vi.mock(
	'@components/MarkdownWithPlaceholders/MarkdownWithPlaceholders.jsx',
	() => ({
		MarkdownWithPlaceholders: ({ content }) => (
			<div data-testid="markdown-content">{content}</div>
		),
	})
);

vi.mock('@data/next-steps.md?raw', () => ({
	default: 'Next steps content',
}));

describe('NextStepsSection', () => {
	it('renders Additional resources subsection', () => {
		render(<NextStepsSection />);

		expect(screen.getByText('Additional resources')).toBeInTheDocument();
	});

	it('renders markdown content', () => {
		render(<NextStepsSection />);

		expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
	});
});
