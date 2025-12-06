import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DisclosureSection } from '@components/DisclosureSection/DisclosureSection';

describe('DisclosureSection', () => {
	describe('Initial State', () => {
		it('renders title', () => {
			render(
				<DisclosureSection title="Test Section">
					<p>Content</p>
				</DisclosureSection>
			);

			expect(screen.getByText('Test Section')).toBeInTheDocument();
		});

		it('starts collapsed by default', () => {
			render(
				<DisclosureSection title="Test Section">
					<p>Hidden Content</p>
				</DisclosureSection>
			);

			expect(
				screen.queryByText('Hidden Content')
			).not.toBeInTheDocument();
		});

		it('starts expanded when defaultExpanded is true', () => {
			render(
				<DisclosureSection title="Test Section" defaultExpanded={true}>
					<p>Visible Content</p>
				</DisclosureSection>
			);

			expect(screen.getByText('Visible Content')).toBeInTheDocument();
		});

		it('shows plus icon when collapsed', () => {
			render(
				<DisclosureSection title="Test Section">
					<p>Content</p>
				</DisclosureSection>
			);

			expect(screen.getByText('+')).toBeInTheDocument();
		});

		it('shows minus icon when expanded', () => {
			render(
				<DisclosureSection title="Test Section" defaultExpanded={true}>
					<p>Content</p>
				</DisclosureSection>
			);

			expect(screen.getByText('−')).toBeInTheDocument();
		});
	});

	describe('Title Bar Interaction', () => {
		it('expands content when title is clicked', async () => {
			const user = userEvent.setup();
			render(
				<DisclosureSection title="Test Section">
					<p>Hidden Content</p>
				</DisclosureSection>
			);

			expect(
				screen.queryByText('Hidden Content')
			).not.toBeInTheDocument();

			await user.click(screen.getByText('Test Section'));

			expect(screen.getByText('Hidden Content')).toBeInTheDocument();
		});

		it('collapses content when title is clicked again', async () => {
			const user = userEvent.setup();
			render(
				<DisclosureSection title="Test Section" defaultExpanded={true}>
					<p>Visible Content</p>
				</DisclosureSection>
			);

			expect(screen.getByText('Visible Content')).toBeInTheDocument();

			await user.click(screen.getByText('Test Section'));

			expect(
				screen.queryByText('Visible Content')
			).not.toBeInTheDocument();
		});

		it('toggles aria-expanded attribute', async () => {
			const user = userEvent.setup();
			render(
				<DisclosureSection title="Test Section">
					<p>Content</p>
				</DisclosureSection>
			);

			const titleButton = screen.getByRole('button', {
				name: /test section/i,
			});
			expect(titleButton).toHaveAttribute('aria-expanded', 'false');

			await user.click(titleButton);
			expect(titleButton).toHaveAttribute('aria-expanded', 'true');

			await user.click(titleButton);
			expect(titleButton).toHaveAttribute('aria-expanded', 'false');
		});
	});

	describe('Layout', () => {
		it('displays title and content when expanded', () => {
			render(
				<DisclosureSection title="Test Section" defaultExpanded={true}>
					<p>Content on right</p>
				</DisclosureSection>
			);

			expect(screen.getByText('Test Section')).toBeInTheDocument();
			expect(screen.getByText('Content on right')).toBeInTheDocument();
		});

		it('only shows title when collapsed', () => {
			render(
				<DisclosureSection title="Test Section">
					<p>Hidden Content</p>
				</DisclosureSection>
			);

			expect(screen.getByText('Test Section')).toBeInTheDocument();
			expect(
				screen.queryByText('Hidden Content')
			).not.toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('title button has correct role', () => {
			render(
				<DisclosureSection title="Test Section">
					<p>Content</p>
				</DisclosureSection>
			);

			expect(
				screen.getByRole('button', { name: /test section/i })
			).toBeInTheDocument();
		});
	});

	describe('Children Rendering', () => {
		it('renders complex children correctly', async () => {
			const user = userEvent.setup();
			render(
				<DisclosureSection title="Complex Content">
					<div>
						<h3>Nested Heading</h3>
						<p>Paragraph text</p>
						<ul>
							<li>Item 1</li>
							<li>Item 2</li>
						</ul>
					</div>
				</DisclosureSection>
			);

			await user.click(screen.getByText('Complex Content'));

			expect(screen.getByText('Nested Heading')).toBeInTheDocument();
			expect(screen.getByText('Paragraph text')).toBeInTheDocument();
			expect(screen.getByText('Item 1')).toBeInTheDocument();
			expect(screen.getByText('Item 2')).toBeInTheDocument();
		});
	});

	describe('Additional Component', () => {
		it('renders additionalComponent when provided', () => {
			const AdditionalComponent = <div>Additional Content</div>;
			render(
				<DisclosureSection
					title="Test Section"
					additionalComponent={AdditionalComponent}
				>
					<p>Main Content</p>
				</DisclosureSection>
			);

			expect(screen.getByText('Additional Content')).toBeInTheDocument();
		});

		it('does not render additionalComponent when not provided', () => {
			render(
				<DisclosureSection title="Test Section">
					<p>Main Content</p>
				</DisclosureSection>
			);

			expect(
				screen.queryByText('Additional Content')
			).not.toBeInTheDocument();
		});

		it('renders additionalComponent when section is collapsed', () => {
			const AdditionalComponent = <div>Additional Content</div>;
			render(
				<DisclosureSection
					title="Test Section"
					additionalComponent={AdditionalComponent}
				>
					<p>Main Content</p>
				</DisclosureSection>
			);

			expect(screen.getByText('Additional Content')).toBeInTheDocument();
			expect(
				screen.queryByText('Main Content')
			).not.toBeInTheDocument();
		});

		it('renders additionalComponent when section is expanded', () => {
			const AdditionalComponent = <div>Additional Content</div>;
			render(
				<DisclosureSection
					title="Test Section"
					defaultExpanded={true}
					additionalComponent={AdditionalComponent}
				>
					<p>Main Content</p>
				</DisclosureSection>
			);

			expect(screen.getByText('Additional Content')).toBeInTheDocument();
			expect(screen.getByText('Main Content')).toBeInTheDocument();
		});
	});
});
