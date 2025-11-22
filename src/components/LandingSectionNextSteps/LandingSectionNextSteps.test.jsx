import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LandingSectionNextSteps from './LandingSectionNextSteps';

// Mock the markdown import
vi.mock('@data/next-steps.md?raw', () => ({
	default: `Introductory text about resources.

- [First Resource](https://example.com/first)
- [Second Resource](https://example.com/second)
- [Third Resource](https://example.com/third)`,
}));

describe('LandingSectionNextSteps', () => {
	it('renders section heading', () => {
		render(<LandingSectionNextSteps />);
		expect(screen.getByText('Next steps for learners')).toBeInTheDocument();
	});

	it('renders introductory paragraph from markdown', () => {
		render(<LandingSectionNextSteps />);
		expect(screen.getByText(/Introductory text/i)).toBeInTheDocument();
	});

	it('renders links from markdown with correct hrefs', () => {
		render(<LandingSectionNextSteps />);

		const firstLink = screen.getByRole('link', { name: /First Resource/i });
		expect(firstLink).toHaveAttribute('href', 'https://example.com/first');

		const secondLink = screen.getByRole('link', {
			name: /Second Resource/i,
		});
		expect(secondLink).toHaveAttribute(
			'href',
			'https://example.com/second'
		);

		const thirdLink = screen.getByRole('link', { name: /Third Resource/i });
		expect(thirdLink).toHaveAttribute('href', 'https://example.com/third');
	});

	it('links have target="_blank" and rel="noopener noreferrer"', () => {
		render(<LandingSectionNextSteps />);

		const links = screen.getAllByRole('link');
		links.forEach(link => {
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		});
	});

	it('renders unordered list from markdown', () => {
		const { container } = render(<LandingSectionNextSteps />);
		const list = container.querySelector('ul');
		expect(list).toBeInTheDocument();
		const listItems = list.querySelectorAll('li');
		expect(listItems).toHaveLength(3);
	});

	it('list uses disc style', () => {
		const { container } = render(<LandingSectionNextSteps />);
		const list = container.querySelector('ul');
		expect(list).toHaveClass('li-t_disc');
	});
});
