import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
	PageWidth,
	PageTitle,
	Heading,
	Paragraph,
	Section,
	Article,
	DL,
	DT,
	DD,
	Fieldset,
	Legend,
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

	it('should combine default styles with custom className', () => {
		render(<Heading className="custom-class">Heading</Heading>);
		const heading = screen.getByRole('heading', { level: 2 });
		expect(heading.className).toContain('custom-class');
		// Default styles should also be present
		expect(heading.className).toContain('fs_l');
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

	it('should combine default styles with custom className', () => {
		render(<Paragraph className="custom-class">Paragraph</Paragraph>);
		const paragraph = screen.getByText('Paragraph');
		// Paragraph combines default styles with custom className
		expect(paragraph.className).toContain('custom-class');
		expect(paragraph.className).toContain('fs_m');
		expect(paragraph.className).toContain('lh_1.6');
		expect(paragraph.className).toContain('mb_lg');
	});
});

describe('Section', () => {
	it('should render with children', () => {
		render(<Section>Section content</Section>);
		expect(screen.getByText('Section content')).toBeInTheDocument();
	});

	it('should render as a section element', () => {
		render(<Section>Content</Section>);
		const section = screen.getByText('Content').closest('section');
		expect(section.tagName).toBe('SECTION');
	});

	it('should render title as h2 when provided', () => {
		render(<Section title="Section Title">Content here</Section>);
		expect(
			screen.getByRole('heading', { level: 2, name: 'Section Title' })
		).toBeInTheDocument();
	});

	it('should render both title and children', () => {
		render(
			<Section title="My Title">
				<p>My content</p>
			</Section>
		);
		expect(screen.getByText('My Title')).toBeInTheDocument();
		expect(screen.getByText('My content')).toBeInTheDocument();
	});

	it('should not render heading when title is not provided', () => {
		render(<Section>Just content</Section>);
		expect(screen.queryByRole('heading')).not.toBeInTheDocument();
	});

	it('should apply custom className', () => {
		render(<Section className="custom-class">Content</Section>);
		const section = screen.getByText('Content').closest('section');
		expect(section).toHaveClass('custom-class');
	});
});

describe('Article', () => {
	it('should render with children', () => {
		render(<Article>Article content</Article>);
		expect(screen.getByText('Article content')).toBeInTheDocument();
	});

	it('should render as an article element', () => {
		render(<Article>Content</Article>);
		const article = screen.getByText('Content').closest('article');
		expect(article.tagName).toBe('ARTICLE');
	});

	it('should apply custom className', () => {
		render(<Article className="custom-class">Content</Article>);
		const article = screen.getByText('Content').closest('article');
		expect(article).toHaveClass('custom-class');
	});
});

describe('DL, DT, DD', () => {
	it('should render DL as a dl element', () => {
		render(<DL>Definition list</DL>);
		const dl = screen.getByText('Definition list').closest('dl');
		expect(dl.tagName).toBe('DL');
	});

	it('should render DT as a dt element', () => {
		render(<DT>Term</DT>);
		const dt = screen.getByText('Term');
		expect(dt.tagName).toBe('DT');
	});

	it('should render DD as a dd element', () => {
		render(<DD>Definition</DD>);
		const dd = screen.getByText('Definition');
		expect(dd.tagName).toBe('DD');
	});

	it('should render a complete definition list', () => {
		render(
			<DL>
				<DT>Term 1</DT>
				<DD>Definition 1</DD>
				<DT>Term 2</DT>
				<DD>Definition 2</DD>
			</DL>
		);
		expect(screen.getByText('Term 1')).toBeInTheDocument();
		expect(screen.getByText('Definition 1')).toBeInTheDocument();
		expect(screen.getByText('Term 2')).toBeInTheDocument();
		expect(screen.getByText('Definition 2')).toBeInTheDocument();
	});

	it('should apply custom className to DL', () => {
		render(<DL className="custom-class">Content</DL>);
		const dl = screen.getByText('Content').closest('dl');
		expect(dl).toHaveClass('custom-class');
	});
});

describe('Fieldset and Legend', () => {
	it('should render Fieldset as a fieldset element', () => {
		render(<Fieldset>Fieldset content</Fieldset>);
		const fieldset = screen.getByText('Fieldset content').closest('fieldset');
		expect(fieldset.tagName).toBe('FIELDSET');
	});

	it('should render Legend as a legend element', () => {
		render(
			<Fieldset>
				<Legend>Legend text</Legend>
			</Fieldset>
		);
		const legend = screen.getByText('Legend text');
		expect(legend.tagName).toBe('LEGEND');
	});

	it('should render visually hidden legend when prop is set', () => {
		render(
			<Fieldset>
				<Legend visuallyHidden>Hidden legend</Legend>
			</Fieldset>
		);
		const legend = screen.getByText('Hidden legend');
		expect(legend.tagName).toBe('LEGEND');
	});

	it('should apply custom className to Fieldset', () => {
		render(<Fieldset className="custom-class">Content</Fieldset>);
		const fieldset = screen.getByText('Content').closest('fieldset');
		expect(fieldset).toHaveClass('custom-class');
	});

	it('should apply custom className to Legend', () => {
		render(
			<Fieldset>
				<Legend className="custom-class">Legend</Legend>
			</Fieldset>
		);
		const legend = screen.getByText('Legend');
		expect(legend).toHaveClass('custom-class');
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
