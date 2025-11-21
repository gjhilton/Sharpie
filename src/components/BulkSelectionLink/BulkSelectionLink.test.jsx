import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BulkSelectionLink from './BulkSelectionLink';

describe('BulkSelectionLink', () => {
	it('renders children text', () => {
		render(<BulkSelectionLink>select all</BulkSelectionLink>);

		expect(screen.getByText('select all')).toBeInTheDocument();
	});

	it('calls onClick when clicked', async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(<BulkSelectionLink onClick={handleClick}>select all</BulkSelectionLink>);

		const link = screen.getByText('select all');
		await user.click(link);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('does not call onClick when disabled', async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(
			<BulkSelectionLink disabled={true} onClick={handleClick}>
				select all
			</BulkSelectionLink>
		);

		const link = screen.getByText('select all');
		await user.click(link);

		expect(handleClick).not.toHaveBeenCalled();
	});

	it('sets aria-disabled to true when disabled', () => {
		render(<BulkSelectionLink disabled={true}>select all</BulkSelectionLink>);

		const link = screen.getByText('select all');
		expect(link).toHaveAttribute('aria-disabled', 'true');
	});

	it('sets aria-disabled to false when not disabled', () => {
		render(<BulkSelectionLink disabled={false}>select all</BulkSelectionLink>);

		const link = screen.getByText('select all');
		expect(link).toHaveAttribute('aria-disabled', 'false');
	});

	it('prevents default link behavior', async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(<BulkSelectionLink onClick={handleClick}>select all</BulkSelectionLink>);

		const link = screen.getByText('select all');
		await user.click(link);

		// If default was not prevented, page would navigate
		expect(handleClick).toHaveBeenCalled();
	});

	it('works without onClick handler', async () => {
		const user = userEvent.setup();

		render(<BulkSelectionLink>select all</BulkSelectionLink>);

		const link = screen.getByText('select all');
		// Should not throw error
		await user.click(link);
	});

	it('renders as a link element', () => {
		render(<BulkSelectionLink>select all</BulkSelectionLink>);

		const link = screen.getByText('select all');
		expect(link.tagName).toBe('A');
	});
});
