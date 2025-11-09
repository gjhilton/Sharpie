import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Icon, { ICON_TYPE } from './Icon';

describe('Icon', () => {
	it('renders with default props', () => {
		const mockIcon = { path: 'M0 0 L10 10' };
		const { container } = render(<Icon icon={mockIcon} />);

		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg).toHaveAttribute('width', '24px');
		expect(svg).toHaveAttribute('height', '24px');
		expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
		expect(svg).toHaveAttribute('aria-hidden', 'true');
		expect(svg).toHaveAttribute('role', 'img');
	});

	it('renders with custom size', () => {
		const mockIcon = { path: 'M0 0 L10 10' };
		const { container } = render(<Icon icon={mockIcon} size={48} />);

		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('width', '48px');
		expect(svg).toHaveAttribute('height', '48px');
	});

	it('renders with custom colour', () => {
		const mockIcon = { path: 'M0 0 L10 10' };
		const { container } = render(<Icon icon={mockIcon} colour="#FF0000" />);

		const path = container.querySelector('path');
		expect(path).toHaveStyle({ stroke: '#FF0000' });
	});

	it('renders with custom weight', () => {
		const mockIcon = { path: 'M0 0 L10 10' };
		const { container } = render(<Icon icon={mockIcon} weight={4} />);

		const path = container.querySelector('path');
		expect(path).toHaveStyle({ strokeWidth: '4' });
	});

	it('renders with custom className', () => {
		const mockIcon = { path: 'M0 0 L10 10' };
		const { container } = render(
			<Icon icon={mockIcon} className="custom-class" />
		);

		const svg = container.querySelector('svg');
		expect(svg).toHaveClass('custom-class');
	});

	it('renders with ICON_TYPE.TICK', () => {
		const { container } = render(<Icon icon={ICON_TYPE.TICK} />);

		const path = container.querySelector('path');
		expect(path).toHaveAttribute('d', 'M4 13l5 5L20 7');
	});

	it('renders with ICON_TYPE.CROSS', () => {
		const { container } = render(<Icon icon={ICON_TYPE.CROSS} />);

		const path = container.querySelector('path');
		expect(path).toHaveAttribute('d', 'M6 6l12 12M18 6L6 18');
	});

	it('has correct SVG styles', () => {
		const mockIcon = { path: 'M0 0 L10 10' };
		const { container } = render(<Icon icon={mockIcon} />);

		const svg = container.querySelector('svg');
		expect(svg).toHaveStyle({
			display: 'inline-block',
			fill: 'none',
			strokeLinecap: 'round',
			strokeMiterlimit: '10',
			verticalAlign: 'middle',
		});
	});

	it('path has correct d attribute from icon prop', () => {
		const customIcon = { path: 'M5 5 L15 15 L5 25' };
		const { container } = render(<Icon icon={customIcon} />);

		const path = container.querySelector('path');
		expect(path).toHaveAttribute('d', 'M5 5 L15 15 L5 25');
	});

	it('path has vectorEffect attribute', () => {
		const mockIcon = { path: 'M0 0 L10 10' };
		const { container } = render(<Icon icon={mockIcon} />);

		const path = container.querySelector('path');
		// vectorEffect is rendered as vector-effect in the DOM
		expect(path).toHaveAttribute('vector-effect', 'non-scaling-stroke');
	});

	it('applies all custom props together', () => {
		const mockIcon = { path: 'M1 2 L3 4' };
		const { container } = render(
			<Icon
				icon={mockIcon}
				size={32}
				colour="#00FF00"
				weight={3}
				className="test-class"
			/>
		);

		const svg = container.querySelector('svg');
		const path = container.querySelector('path');

		expect(svg).toHaveAttribute('width', '32px');
		expect(svg).toHaveAttribute('height', '32px');
		expect(svg).toHaveClass('test-class');
		expect(path).toHaveStyle({ stroke: '#00FF00', strokeWidth: '3' });
		expect(path).toHaveAttribute('d', 'M1 2 L3 4');
	});
});
