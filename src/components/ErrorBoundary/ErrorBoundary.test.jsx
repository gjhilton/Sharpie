import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary.jsx';

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
	if (shouldThrow) {
		throw new Error('Test error');
	}
	return <div>No error</div>;
};

describe('ErrorBoundary', () => {
	// Suppress console.error for cleaner test output
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	it('should render children when no error', () => {
		render(
			<ErrorBoundary>
				<div>Child content</div>
			</ErrorBoundary>
		);
		expect(screen.getByText('Child content')).toBeInTheDocument();
	});

	it('should render ErrorScreen when child throws', () => {
		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);
		expect(screen.getByText('Something went wrong')).toBeInTheDocument();
	});

	it('should display error message from caught error', () => {
		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);
		expect(screen.getByText('Test error')).toBeInTheDocument();
	});

	it('should provide resetError functionality', async () => {
		const { rerender } = render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		// Error screen should be shown
		expect(screen.getByText('Something went wrong')).toBeInTheDocument();

		// Try again button should exist
		expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
	});
});
