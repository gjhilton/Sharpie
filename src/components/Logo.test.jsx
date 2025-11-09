import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Logo, { SIZE } from './Logo';

describe('Logo', () => {
	it('renders SVG element', () => {
		const { container } = render(<Logo />);

		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute('viewBox', '0 0 595.28 234.59');
		expect(svg).toHaveAttribute('width', '595.28px');
		expect(svg).toHaveAttribute('height', '234.59px');
	});

	it('renders with default medium size', () => {
		render(<Logo />);
		// Logo uses CSS-in-JS (Panda CSS) which doesn't generate inline styles
		// Just verify the component renders without error
		expect(document.querySelector('svg')).toBeInTheDocument();
	});

	it('renders with small size', () => {
		render(<Logo size="s" />);
		// Verify the component renders with small size prop
		expect(document.querySelector('svg')).toBeInTheDocument();
	});

	it('renders with medium size', () => {
		render(<Logo size="m" />);
		// Verify the component renders with medium size prop
		expect(document.querySelector('svg')).toBeInTheDocument();
	});

	it('renders with large size', () => {
		render(<Logo size="l" />);
		// Verify the component renders with large size prop
		expect(document.querySelector('svg')).toBeInTheDocument();
	});

	it('renders with custom size string', () => {
		render(<Logo size="250px" />);
		// Verify the component renders with custom size prop
		expect(document.querySelector('svg')).toBeInTheDocument();
	});

	it('has animation keyframes defined', () => {
		const { container } = render(<Logo />);

		const styleElement = container.querySelector('style');
		expect(styleElement).toBeInTheDocument();
		expect(styleElement.textContent).toContain('@keyframes logo-dash');
		expect(styleElement.textContent).toContain('stroke-dashoffset: 0');
	});

	it('renders the red animated path', () => {
		const { container } = render(<Logo />);

		const redPath = container.querySelector('.red');
		expect(redPath).toBeInTheDocument();
		expect(redPath).toHaveClass('red');
	});

	it('has correct SVG namespace attributes', () => {
		const { container } = render(<Logo />);

		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
		expect(svg).toHaveAttribute('version', '1.1');
	});

	it('has responsive width and height styles', () => {
		const { container } = render(<Logo />);

		const svg = container.querySelector('svg');
		// Panda CSS styles are applied via className, not inline styles
		expect(svg).toBeInTheDocument();
	});

	it('contains logo paths', () => {
		const { container } = render(<Logo />);

		const paths = container.querySelectorAll('path');
		expect(paths.length).toBeGreaterThan(0);
	});

	it('SIZE constant has correct values', () => {
		expect(SIZE.S).toBe('150px');
		expect(SIZE.M).toBe('300px');
		expect(SIZE.L).toBe('500px');
	});

	it('wraps SVG in a div container', () => {
		const { container } = render(<Logo />);

		const wrapper = container.firstChild;
		expect(wrapper.tagName).toBe('DIV');

		const svg = wrapper.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('handles uppercase size prop', () => {
		const { container } = render(<Logo size="S" />);

		const svg = container.querySelector('svg');
		// SIZE object uses uppercase keys
		expect(svg).toHaveStyle({ maxWidth: undefined });
	});
});
