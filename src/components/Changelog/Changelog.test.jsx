import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Changelog, { VersionEntry } from './Changelog';

vi.mock('@components/Layout/Layout.jsx', () => ({
	DL: ({ children }) => <dl data-testid="dl">{children}</dl>,
	DT: ({ children }) => <dt>{children}</dt>,
	DD: ({ children }) => <dd>{children}</dd>,
}));

vi.mock('@data/changelog.json', () => ({
	default: [
		{ version: '1.2.0', description: 'Added new features' },
		{ version: '1.1.0', description: 'Bug fixes' },
		{ version: '1.0.0', description: 'Initial release' },
	],
}));

describe('VersionEntry', () => {
	it('should render version with v prefix', () => {
		render(
			<dl>
				<VersionEntry version="1.0.0" description="Test" />
			</dl>
		);
		expect(screen.getByText('v1.0.0')).toBeInTheDocument();
	});

	it('should render description', () => {
		render(
			<dl>
				<VersionEntry version="1.0.0" description="Test description" />
			</dl>
		);
		expect(screen.getByText('Test description')).toBeInTheDocument();
	});

	it('should render version in dt element', () => {
		render(
			<dl>
				<VersionEntry version="1.0.0" description="Test" />
			</dl>
		);
		const dt = screen.getByText('v1.0.0');
		expect(dt.tagName).toBe('DT');
	});

	it('should render description in dd element', () => {
		render(
			<dl>
				<VersionEntry version="1.0.0" description="Test" />
			</dl>
		);
		const dd = screen.getByText('Test');
		expect(dd.tagName).toBe('DD');
	});
});

describe('Changelog', () => {
	it('should render as a definition list', () => {
		render(<Changelog />);
		expect(screen.getByTestId('dl')).toBeInTheDocument();
	});

	it('should render all changelog entries', () => {
		render(<Changelog />);
		expect(screen.getByText('v1.2.0')).toBeInTheDocument();
		expect(screen.getByText('v1.1.0')).toBeInTheDocument();
		expect(screen.getByText('v1.0.0')).toBeInTheDocument();
	});

	it('should render all descriptions', () => {
		render(<Changelog />);
		expect(screen.getByText('Added new features')).toBeInTheDocument();
		expect(screen.getByText('Bug fixes')).toBeInTheDocument();
		expect(screen.getByText('Initial release')).toBeInTheDocument();
	});

	it('should render entries in order from changelog', () => {
		render(<Changelog />);
		const terms = screen.getAllByRole('term');
		expect(terms[0]).toHaveTextContent('v1.2.0');
		expect(terms[1]).toHaveTextContent('v1.1.0');
		expect(terms[2]).toHaveTextContent('v1.0.0');
	});
});
