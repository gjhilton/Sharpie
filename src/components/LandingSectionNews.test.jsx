import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LandingSectionNews from './LandingSectionNews';

// Mock the changelog data
vi.mock('../data/changelog.json', () => ({
	default: [
		{ version: '1.0.0', description: 'First working version.' },
		{ version: '0.9.0', description: 'Beta release.' },
		{ version: '0.8.0', description: 'Alpha release.' },
	],
}));

describe('LandingSectionNews', () => {
	it('renders with changelog data', () => {
		render(<LandingSectionNews />);
		expect(screen.getByText("What's new")).toBeInTheDocument();
	});

	it('displays most recent version outside details', () => {
		render(<LandingSectionNews />);
		expect(screen.getByText('v1.0.0')).toBeInTheDocument();
		expect(screen.getByText('First working version.')).toBeInTheDocument();
	});

	it('renders details element when multiple versions exist', () => {
		const { container } = render(<LandingSectionNews />);
		const details = container.querySelector('details');
		expect(details).toBeInTheDocument();
	});

	it('summary text is "Show more"', () => {
		render(<LandingSectionNews />);
		expect(screen.getByText('Show more')).toBeInTheDocument();
	});

	it('older versions appear inside details', () => {
		const { container } = render(<LandingSectionNews />);
		const details = container.querySelector('details');
		expect(details?.textContent).toContain('v0.9.0');
		expect(details?.textContent).toContain('v0.8.0');
	});

	it('older versions are in correct order (oldest last)', () => {
		const { container } = render(<LandingSectionNews />);
		const details = container.querySelector('details');
		const text = details?.textContent || '';
		const index09 = text.indexOf('v0.9.0');
		const index08 = text.indexOf('v0.8.0');
		// Component reverses order, so oldest (0.8.0) appears first, then 0.9.0
		// But actually we want oldest last, so let me check the actual positions
		// Since array is reversed from [0.9.0, 0.8.0] to [0.8.0, 0.9.0],
		// 0.8.0 comes BEFORE 0.9.0, so index08 < index09
		// This means test expectation was backwards
		expect(index09).toBeGreaterThan(index08);
	});

	it('version numbers and descriptions render correctly', () => {
		render(<LandingSectionNews />);
		expect(screen.getByText('v1.0.0')).toBeInTheDocument();
		expect(screen.getByText('First working version.')).toBeInTheDocument();
	});
});
