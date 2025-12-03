import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExampleCard } from '@components/ExampleCard/ExampleCard';

describe('ExampleCard', () => {
	it('should render with title', () => {
		render(<ExampleCard title="Test Title">Content</ExampleCard>);
		expect(screen.getByText('Test Title')).toBeInTheDocument();
	});

	it('should render children', () => {
		render(<ExampleCard title="Title">Test Content</ExampleCard>);
		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('should render title with bold font weight', () => {
		render(<ExampleCard title="Bold Title">Content</ExampleCard>);
		const title = screen.getByText('Bold Title');
		expect(title.className).toContain('fw_bold');
	});

	it('should render title with centered text', () => {
		render(<ExampleCard title="Centered">Content</ExampleCard>);
		const title = screen.getByText('Centered');
		expect(title.className).toContain('ta_center');
	});

	it('should apply default height to content container', () => {
		const { container } = render(
			<ExampleCard title="Title">Content</ExampleCard>
		);
		const contentBox = container.querySelector('[class*="h_300px"]');
		expect(contentBox).toBeInTheDocument();
	});

	it('should apply custom height when provided', () => {
		const { container } = render(
			<ExampleCard title="Title" height="200px">
				Content
			</ExampleCard>
		);
		const contentBox = container.querySelector('[class*="h_200px"]');
		expect(contentBox).toBeInTheDocument();
	});

	it('should render content in bordered container', () => {
		const { container } = render(
			<ExampleCard title="Title">Content</ExampleCard>
		);
		const contentContainer = screen.getByText('Content').closest('div');
		expect(contentContainer.className).toContain('bd_');
	});
});
