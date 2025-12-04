import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
	it('renders without crashing', async () => {
		const { container } = render(<App />);
		await waitFor(() => {
			expect(container).toBeDefined();
		});
	});
});
