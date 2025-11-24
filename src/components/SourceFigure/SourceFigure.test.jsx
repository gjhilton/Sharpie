import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SourceFigure from './SourceFigure';

vi.mock('@data/alphabets.json', () => ({
	default: {
		'BeauChesne-Baildon': {
			title: 'Test Alphabet Title',
			sourceUri: 'https://example.com/source',
		},
	},
}));

describe('SourceFigure', () => {
	it('should render the secretary hand image', () => {
		render(<SourceFigure />);
		const img = screen.getByAltText('Secretary Hand');
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('src', 'secretary_hand.gif');
	});

	it('should render the alphabet title in figcaption', () => {
		render(<SourceFigure />);
		expect(screen.getByText('Test Alphabet Title')).toBeInTheDocument();
	});

	it('should render a source link', () => {
		render(<SourceFigure />);
		const link = screen.getByRole('link', { name: /source/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', 'https://example.com/source');
	});

	it('should open source link in new tab', () => {
		render(<SourceFigure />);
		const link = screen.getByRole('link', { name: /source/i });
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('should render as a figure element', () => {
		const { container } = render(<SourceFigure />);
		expect(container.querySelector('figure')).toBeInTheDocument();
	});

	it('should render figcaption with italic style', () => {
		const { container } = render(<SourceFigure />);
		const figcaption = container.querySelector('figcaption');
		expect(figcaption.className).toContain('font-style_italic');
	});
});
