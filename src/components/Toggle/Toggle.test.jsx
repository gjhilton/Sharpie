import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from './Toggle';

describe('Toggle', () => {
	it('should render with label', () => {
		render(
			<Toggle
				id="test-toggle"
				label="Test Toggle"
				checked={false}
				onChange={() => {}}
			/>
		);

		expect(screen.getByText('Test Toggle')).toBeInTheDocument();
		expect(screen.getByRole('switch')).toBeInTheDocument();
	});

	it('should show checked state', () => {
		render(
			<Toggle
				id="test-toggle"
				label="Test Toggle"
				checked={true}
				onChange={() => {}}
			/>
		);

		const toggle = screen.getByRole('switch');
		expect(toggle).toHaveAttribute('aria-checked', 'true');
	});

	it('should show unchecked state', () => {
		render(
			<Toggle
				id="test-toggle"
				label="Test Toggle"
				checked={false}
				onChange={() => {}}
			/>
		);

		const toggle = screen.getByRole('switch');
		expect(toggle).toHaveAttribute('aria-checked', 'false');
	});

	it('should call onChange when clicked', async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();

		render(
			<Toggle
				id="test-toggle"
				label="Test Toggle"
				checked={false}
				onChange={handleChange}
			/>
		);

		const toggle = screen.getByRole('switch');
		await user.click(toggle);

		expect(handleChange).toHaveBeenCalledWith(true);
	});

	it('should call onChange when label is clicked', async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();

		render(
			<Toggle
				id="test-toggle"
				label="Test Toggle"
				checked={false}
				onChange={handleChange}
			/>
		);

		const label = screen.getByText('Test Toggle');
		await user.click(label);

		expect(handleChange).toHaveBeenCalledWith(true);
	});

	it('should toggle from true to false', async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();

		render(
			<Toggle
				id="test-toggle"
				label="Test Toggle"
				checked={true}
				onChange={handleChange}
			/>
		);

		const toggle = screen.getByRole('switch');
		await user.click(toggle);

		expect(handleChange).toHaveBeenCalledWith(false);
	});

	it('should support keyboard interaction with Space key', async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();

		render(
			<Toggle
				id="test-toggle"
				label="Test Toggle"
				checked={false}
				onChange={handleChange}
			/>
		);

		const toggle = screen.getByRole('switch');
		toggle.focus();
		await user.keyboard(' ');

		expect(handleChange).toHaveBeenCalledWith(true);
	});

	it('should support keyboard interaction with Enter key', async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();

		render(
			<Toggle
				id="test-toggle"
				label="Test Toggle"
				checked={false}
				onChange={handleChange}
			/>
		);

		const toggle = screen.getByRole('switch');
		toggle.focus();
		await user.keyboard('{Enter}');

		expect(handleChange).toHaveBeenCalledWith(true);
	});

	it('should be disabled when disabled prop is true', () => {
		render(
			<Toggle
				id="test-toggle"
				label="Test Toggle"
				checked={false}
				onChange={() => {}}
				disabled={true}
			/>
		);

		const toggle = screen.getByRole('switch');
		expect(toggle).toBeDisabled();
	});

	it('should not call onChange when disabled and clicked', async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();

		render(
			<Toggle
				id="test-toggle"
				label="Test Toggle"
				checked={false}
				onChange={handleChange}
				disabled={true}
			/>
		);

		const toggle = screen.getByRole('switch');
		await user.click(toggle);

		expect(handleChange).not.toHaveBeenCalled();
	});

	it('should have proper aria-label', () => {
		render(
			<Toggle
				id="test-toggle"
				label="Test Toggle"
				checked={false}
				onChange={() => {}}
			/>
		);

		const toggle = screen.getByRole('switch');
		expect(toggle).toHaveAttribute('aria-label', 'Test Toggle');
	});
});
