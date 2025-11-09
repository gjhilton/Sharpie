import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
	it('should render with label text', () => {
		render(<Button label="Click me" onClick={() => {}} />);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('should render with sublabel when provided', () => {
		render(
			<Button
				label="Main Label"
				sublabel="Sub Label"
				onClick={() => {}}
			/>
		);
		expect(screen.getByText('Main Label')).toBeInTheDocument();
		expect(screen.getByText('Sub Label')).toBeInTheDocument();
	});

	it('should not render sublabel when not provided', () => {
		render(<Button label="Main Label" onClick={() => {}} />);
		expect(screen.getByText('Main Label')).toBeInTheDocument();
		expect(screen.queryByText('Sub Label')).not.toBeInTheDocument();
	});

	it('should call onClick when clicked', async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(<Button label="Click me" onClick={handleClick} />);

		const button = screen.getByRole('button', { name: /click me/i });
		await user.click(button);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('should be disabled when disabled prop is true', () => {
		render(<Button label="Disabled" onClick={() => {}} disabled />);

		const button = screen.getByRole('button', { name: /disabled/i });
		expect(button).toBeDisabled();
	});

	it('should not call onClick when disabled', async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(<Button label="Disabled" onClick={handleClick} disabled />);

		const button = screen.getByRole('button', { name: /disabled/i });
		await user.click(button);

		expect(handleClick).not.toHaveBeenCalled();
	});

	it('should be enabled by default', () => {
		render(<Button label="Enabled" onClick={() => {}} />);

		const button = screen.getByRole('button', { name: /enabled/i });
		expect(button).toBeEnabled();
	});

	it('should render as a button element', () => {
		render(<Button label="Test" onClick={() => {}} />);

		const button = screen.getByRole('button');
		expect(button.tagName).toBe('BUTTON');
	});

	it('should be keyboard accessible', async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(<Button label="Press me" onClick={handleClick} />);

		const button = screen.getByRole('button', { name: /press me/i });
		button.focus();
		await user.keyboard('{Enter}');

		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
