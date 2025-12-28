import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HowToPlaySection } from '@components/HowToPlaySection/HowToPlaySection';

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
		MarkdownWithPlaceholders: ({ content, placeholders }) => (
			<div data-testid="markdown-content">
				{content}
				{placeholders &&
					Object.entries(placeholders).map(([key, value]) => (
						<div key={key} data-testid={`placeholder-${key}`}>
							{value}
						</div>
					))}
			</div>
		),
	})
);

vi.mock('@components/ContextImage/ContextImage.jsx', () => ({
	ContextImage: () => <img data-testid="context-image" alt="Context" />,
}));

vi.mock('@data/how-to-use.md?raw', () => ({
	default: 'How to use content',
}));

vi.mock('@data/letters-in-context.md?raw', () => ({
	default: 'Letters in context content',
}));

vi.mock('@data/hints.md?raw', () => ({
	default: 'Hints content',
}));

describe('HowToPlaySection', () => {
	it('renders Gameplay subsection', () => {
		render(<HowToPlaySection />);

		expect(screen.getByText('Gameplay')).toBeInTheDocument();
	});

	it('renders Letters in context subsection', () => {
		render(<HowToPlaySection />);

		expect(screen.getByText('Letters in context')).toBeInTheDocument();
	});

	it('renders Hints subsection', () => {
		render(<HowToPlaySection />);

		expect(screen.getByText('Hints')).toBeInTheDocument();
	});

	it('renders ContextImage component', () => {
		render(<HowToPlaySection />);

		expect(screen.getByTestId('context-image')).toBeInTheDocument();
	});

	it('renders markdown content', () => {
		render(<HowToPlaySection />);

		const markdownElements = screen.getAllByTestId('markdown-content');
		expect(markdownElements.length).toBe(3);
	});
});
