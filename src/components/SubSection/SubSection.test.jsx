import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SubSection } from './SubSection';

describe('SubSection', () => {
	it('should render with title', () => {
		render(<SubSection title="Test Title">Content</SubSection>);
		expect(screen.getByText('Test Title')).toBeInTheDocument();
	});

	it('should render title as h3', () => {
		render(<SubSection title="Heading">Content</SubSection>);
		const heading = screen.getByRole('heading', { level: 3 });
		expect(heading).toHaveTextContent('Heading');
	});

	it('should render children', () => {
		render(<SubSection title="Title">Test Content</SubSection>);
		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('should render with grid layout', () => {
		const { container } = render(
			<SubSection title="Title">Content</SubSection>
		);
		const rootDiv = container.firstChild;
		expect(rootDiv.className).toContain('d_grid');
	});

	it('should render title with bold font', () => {
		render(<SubSection title="Bold Title">Content</SubSection>);
		const title = screen.getByRole('heading', { level: 3 });
		expect(title.className).toContain('fw_bold');
	});

	it('should render complex children', () => {
		render(
			<SubSection title="Title">
				<p>Paragraph 1</p>
				<p>Paragraph 2</p>
			</SubSection>
		);
		expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
		expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
	});
});
