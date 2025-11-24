import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorScreen } from './ErrorScreen.jsx';

describe('ErrorScreen', () => {
	it('should render error heading', () => {
		render(<ErrorScreen />);
		expect(screen.getByText('Something went wrong')).toBeInTheDocument();
	});

	it('should display error message when provided', () => {
		const error = new Error('Test error message');
		render(<ErrorScreen error={error} />);
		expect(screen.getByText('Test error message')).toBeInTheDocument();
	});

	it('should display default message when no error provided', () => {
		render(<ErrorScreen />);
		expect(
			screen.getByText(/An unexpected error occurred/)
		).toBeInTheDocument();
	});

	it('should render Try again button when resetError is provided', () => {
		const resetError = vi.fn();
		render(<ErrorScreen resetError={resetError} />);
		expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
	});

	it('should call resetError when Try again is clicked', async () => {
		const user = userEvent.setup();
		const resetError = vi.fn();
		render(<ErrorScreen resetError={resetError} />);

		await user.click(screen.getByRole('button', { name: /try again/i }));
		expect(resetError).toHaveBeenCalledTimes(1);
	});

	it('should render Reload page button', () => {
		render(<ErrorScreen />);
		expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
	});
});
