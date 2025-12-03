import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownWithPlaceholders } from './MarkdownWithPlaceholders';

describe('MarkdownWithPlaceholders', () => {
	describe('Basic Markdown Rendering', () => {
		it('renders plain text paragraph', () => {
			render(
				<MarkdownWithPlaceholders content="Simple paragraph text." />
			);
			expect(
				screen.getByText('Simple paragraph text.')
			).toBeInTheDocument();
		});

		it('renders emphasis correctly', () => {
			render(
				<MarkdownWithPlaceholders content="Text with *emphasis* here." />
			);
			const emphasisElement = screen.getByText('emphasis');
			expect(emphasisElement.tagName).toBe('EM');
		});

		it('renders strong text correctly', () => {
			render(
				<MarkdownWithPlaceholders content="Text with **strong** here." />
			);
			const strongElement = screen.getByText('strong');
			expect(strongElement.tagName).toBe('STRONG');
		});

		it('renders ordered list with lower-roman style', () => {
			const content = `1. First item
2. Second item
3. Third item`;
			const { container } = render(
				<MarkdownWithPlaceholders content={content} />
			);
			const list = container.querySelector('ol');
			expect(list).toBeInTheDocument();
			expect(list).toHaveClass('li-t_lower-roman');
			expect(list.querySelectorAll('li')).toHaveLength(3);
		});

		it('renders unordered list with disc style', () => {
			const content = `- First item
- Second item
- Third item`;
			const { container } = render(
				<MarkdownWithPlaceholders content={content} />
			);
			const list = container.querySelector('ul');
			expect(list).toBeInTheDocument();
			expect(list).toHaveClass('li-t_disc');
			expect(list.querySelectorAll('li')).toHaveLength(3);
		});

		it('renders links with target="_blank" and rel="noopener noreferrer"', () => {
			render(
				<MarkdownWithPlaceholders content="Visit [Example](https://example.com)." />
			);
			const link = screen.getByRole('link', { name: 'Example' });
			expect(link).toHaveAttribute('href', 'https://example.com');
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		});

		it('renders multiple paragraphs', () => {
			const content = `First paragraph.

Second paragraph.`;
			render(<MarkdownWithPlaceholders content={content} />);
			expect(screen.getByText('First paragraph.')).toBeInTheDocument();
			expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
		});
	});

	describe('Placeholder Replacement', () => {
		it('replaces single placeholder with component', () => {
			const placeholders = {
				MY_BUTTON: (
					<button data-testid="custom-button">Click me</button>
				),
			};
			render(
				<MarkdownWithPlaceholders
					content="{{MY_BUTTON}}"
					placeholders={placeholders}
				/>
			);
			expect(screen.getByTestId('custom-button')).toBeInTheDocument();
			expect(screen.getByText('Click me')).toBeInTheDocument();
		});

		it('replaces placeholder in middle of content', () => {
			const placeholders = {
				TOGGLE: <input type="checkbox" data-testid="toggle" />,
			};
			const content = `First paragraph.

{{TOGGLE}}

Last paragraph.`;
			render(
				<MarkdownWithPlaceholders
					content={content}
					placeholders={placeholders}
				/>
			);
			expect(screen.getByText('First paragraph.')).toBeInTheDocument();
			expect(screen.getByTestId('toggle')).toBeInTheDocument();
			expect(screen.getByText('Last paragraph.')).toBeInTheDocument();
		});

		it('replaces multiple different placeholders', () => {
			const placeholders = {
				FIRST: <div data-testid="first">First Component</div>,
				SECOND: <div data-testid="second">Second Component</div>,
			};
			const content = `{{FIRST}}

{{SECOND}}`;
			render(
				<MarkdownWithPlaceholders
					content={content}
					placeholders={placeholders}
				/>
			);
			expect(screen.getByTestId('first')).toBeInTheDocument();
			expect(screen.getByTestId('second')).toBeInTheDocument();
		});

		it('leaves unmatched placeholders as text', () => {
			render(
				<MarkdownWithPlaceholders
					content="{{UNKNOWN_PLACEHOLDER}}"
					placeholders={{}}
				/>
			);
			expect(
				screen.getByText('{{UNKNOWN_PLACEHOLDER}}')
			).toBeInTheDocument();
		});

		it('works with empty placeholders object', () => {
			render(
				<MarkdownWithPlaceholders
					content="Regular content."
					placeholders={{}}
				/>
			);
			expect(screen.getByText('Regular content.')).toBeInTheDocument();
		});

		it('works without placeholders prop', () => {
			render(
				<MarkdownWithPlaceholders content="No placeholders here." />
			);
			expect(
				screen.getByText('No placeholders here.')
			).toBeInTheDocument();
		});
	});

	describe('Mixed Content', () => {
		it('renders markdown with placeholders and lists', () => {
			const placeholders = {
				CUSTOM: <span data-testid="custom">Custom Element</span>,
			};
			const content = `Introduction text.

{{CUSTOM}}

- List item one
- List item two`;
			const { container } = render(
				<MarkdownWithPlaceholders
					content={content}
					placeholders={placeholders}
				/>
			);
			expect(screen.getByText('Introduction text.')).toBeInTheDocument();
			expect(screen.getByTestId('custom')).toBeInTheDocument();
			expect(container.querySelector('ul')).toBeInTheDocument();
		});

		it('renders markdown with links and emphasis', () => {
			const content = `Check out *this* [link](https://example.com).`;
			render(<MarkdownWithPlaceholders content={content} />);
			expect(screen.getByText('this').tagName).toBe('EM');
			expect(screen.getByRole('link', { name: 'link' })).toHaveAttribute(
				'href',
				'https://example.com'
			);
		});
	});
});
