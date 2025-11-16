import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
	PageWidth,
	PageTitle,
	Heading,
	Paragraph,
	Section,
	VisuallyHidden,
} from './Layout';

describe('PageWidth', () => {
	it('should render with children', () => {
		render(<PageWidth>Test content</PageWidth>);
		expect(screen.getByText('Test content')).toBeInTheDocument();
	});

	it('should render as a div element', () => {
		render(<PageWidth>Test</PageWidth>);
		const element = screen.getByText('Test').closest('div');
		expect(element.tagName).toBe('DIV');
	});
});

describe('PageTitle', () => {
	it('should render with children', () => {
		render(<PageTitle>Test Title</PageTitle>);
		expect(screen.getByText('Test Title')).toBeInTheDocument();
	});

	it('should render as an h1 element', () => {
		render(<PageTitle>Test Title</PageTitle>);
		const heading = screen.getByRole('heading', { level: 1 });
		expect(heading.tagName).toBe('H1');
		expect(heading).toHaveTextContent('Test Title');
	});

	it('should apply custom inline styles when provided', () => {
		render(<PageTitle style={{ color: 'red' }}>Title</PageTitle>);
		const heading = screen.getByRole('heading', { level: 1 });
		expect(heading.style.color).toBe('red');
	});

	it('should merge custom inline styles with default CSS', () => {
		render(<PageTitle style={{ lineHeight: '2rem' }}>Title</PageTitle>);
		const heading = screen.getByRole('heading', { level: 1 });
		// Should have both default CSS classes and custom inline styles
		expect(heading.className).toBeTruthy();
		expect(heading.style.lineHeight).toBe('2rem');
	});
});

describe('Heading', () => {
	it('should render with children', () => {
		render(<Heading>Test Heading</Heading>);
		expect(screen.getByText('Test Heading')).toBeInTheDocument();
	});

	it('should render as an h2 element', () => {
		render(<Heading>Test Heading</Heading>);
		const heading = screen.getByRole('heading', { level: 2 });
		expect(heading.tagName).toBe('H2');
		expect(heading).toHaveTextContent('Test Heading');
	});

	it('should apply custom className when provided', () => {
		render(<Heading className="custom-class">Heading</Heading>);
		const heading = screen.getByRole('heading', { level: 2 });
		expect(heading).toHaveClass('custom-class');
	});

	it('should not apply default styles when custom className is provided', () => {
		render(<Heading className="custom-class">Heading</Heading>);
		const heading = screen.getByRole('heading', { level: 2 });
		// When custom className is provided, it should only have that class
		expect(heading.className).toBe('custom-class');
	});
});

describe('Paragraph', () => {
	it('should render with children', () => {
		render(<Paragraph>Test paragraph text</Paragraph>);
		expect(screen.getByText('Test paragraph text')).toBeInTheDocument();
	});

	it('should render as a p element', () => {
		render(<Paragraph>Test paragraph</Paragraph>);
		const paragraph = screen.getByText('Test paragraph');
		expect(paragraph.tagName).toBe('P');
	});

	it('should apply custom className when provided', () => {
		render(<Paragraph className="custom-class">Paragraph</Paragraph>);
		const paragraph = screen.getByText('Paragraph');
		expect(paragraph).toHaveClass('custom-class');
	});

	it('should not apply default styles when custom className is provided', () => {
		render(<Paragraph className="custom-class">Paragraph</Paragraph>);
		const paragraph = screen.getByText('Paragraph');
		// When custom className is provided, it should only have that class
		expect(paragraph.className).toBe('custom-class');
	});
});

describe('Section', () => {
	it('should render with children', () => {
		render(<Section title={<h2>Title</h2>}>Section content</Section>);
		expect(screen.getByText('Section content')).toBeInTheDocument();
	});

	it('should render the title', () => {
		render(<Section title={<h2>Section Title</h2>}>Content here</Section>);
		expect(screen.getByText('Section Title')).toBeInTheDocument();
	});

	it('should render both title and children', () => {
		render(
			<Section title={<h2>My Title</h2>}>
				<p>My content</p>
			</Section>
		);
		expect(screen.getByText('My Title')).toBeInTheDocument();
		expect(screen.getByText('My content')).toBeInTheDocument();
	});

	it('should render children in a div element', () => {
		render(
			<Section title={<h2>Title</h2>}>
				<span>Child content</span>
			</Section>
		);
		const childContent = screen.getByText('Child content');
		const parentDiv = childContent.parentElement;
		expect(parentDiv.tagName).toBe('DIV');
	});
});

describe('VisuallyHidden', () => {
	it('should render with children', () => {
		render(<VisuallyHidden>Hidden text</VisuallyHidden>);
		expect(screen.getByText('Hidden text')).toBeInTheDocument();
	});

	it('should render as a span element by default', () => {
		render(<VisuallyHidden>Hidden</VisuallyHidden>);
		const element = screen.getByText('Hidden');
		expect(element.tagName).toBe('SPAN');
	});

	it('should render as a different element when "as" prop is provided', () => {
		render(<VisuallyHidden as="div">Hidden div</VisuallyHidden>);
		const element = screen.getByText('Hidden div');
		expect(element.tagName).toBe('DIV');
	});

	it('should accept "as" prop with h1 element', () => {
		render(<VisuallyHidden as="h1">Hidden heading</VisuallyHidden>);
		const heading = screen.getByRole('heading', { level: 1 });
		expect(heading.tagName).toBe('H1');
		expect(heading).toHaveTextContent('Hidden heading');
	});

	it('should accept "as" prop with button element', () => {
		render(<VisuallyHidden as="button">Hidden button</VisuallyHidden>);
		const button = screen.getByRole('button');
		expect(button.tagName).toBe('BUTTON');
		expect(button).toHaveTextContent('Hidden button');
	});

	it('should have className applied for accessibility styles', () => {
		render(<VisuallyHidden>Screen reader only</VisuallyHidden>);
		const element = screen.getByText('Screen reader only');

		// Check that the element has a className (CSS-in-JS applied)
		// The actual styles (position: absolute, width: 1px, etc.) are defined in the component
		expect(element.className).toBeTruthy();
		expect(element.className.length).toBeGreaterThan(0);
	});
});
