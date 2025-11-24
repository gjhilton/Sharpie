import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LinkAsButton } from './LinkAsButton';

describe('LinkAsButton', () => {
	it('renders children', () => {
		render(<LinkAsButton>Click me</LinkAsButton>);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('renders as a button element', () => {
		render(<LinkAsButton>Click me</LinkAsButton>);
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('calls onClick when clicked', async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(<LinkAsButton onClick={handleClick}>Click me</LinkAsButton>);
		await user.click(screen.getByRole('button'));

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('does not call onClick when disabled', async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(
			<LinkAsButton onClick={handleClick} disabled>
				Click me
			</LinkAsButton>
		);
		await user.click(screen.getByRole('button'));

		expect(handleClick).not.toHaveBeenCalled();
	});

	it('is disabled when disabled prop is true', () => {
		render(<LinkAsButton disabled>Click me</LinkAsButton>);
		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('applies custom className', () => {
		render(<LinkAsButton className="custom-class">Click me</LinkAsButton>);
		expect(screen.getByRole('button')).toHaveClass('custom-class');
	});
});
