import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BulkSelectionLink } from './BulkSelectionLink';

describe('BulkSelectionLink', () => {
	it('renders children text', () => {
		render(<BulkSelectionLink>select all</BulkSelectionLink>);

		expect(screen.getByText('select all')).toBeInTheDocument();
	});

	it('calls onClick when clicked', async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(
			<BulkSelectionLink onClick={handleClick}>
				select all
			</BulkSelectionLink>
		);

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

	it('is disabled when disabled prop is true', () => {
		render(
			<BulkSelectionLink disabled={true}>select all</BulkSelectionLink>
		);

		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});

	it('is not disabled when disabled prop is false', () => {
		render(
			<BulkSelectionLink disabled={false}>select all</BulkSelectionLink>
		);

		const button = screen.getByRole('button');
		expect(button).not.toBeDisabled();
	});

	it('works without onClick handler', async () => {
		const user = userEvent.setup();

		render(<BulkSelectionLink>select all</BulkSelectionLink>);

		const button = screen.getByRole('button');
		// Should not throw error
		await user.click(button);
	});

	it('renders as a button element', () => {
		render(<BulkSelectionLink>select all</BulkSelectionLink>);

		const button = screen.getByRole('button');
		expect(button.tagName).toBe('BUTTON');
	});
});
