import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingScreen } from './LoadingScreen.jsx';

describe('LoadingScreen', () => {
	it('should render loading text', () => {
		render(<LoadingScreen />);
		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('should render spinner element', () => {
		const { container } = render(<LoadingScreen />);
		const spinner = container.querySelector('[aria-hidden="true"]');
		expect(spinner).toBeInTheDocument();
	});
});
