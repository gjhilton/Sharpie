import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContextImage from './ContextImage';

describe('ContextImage', () => {
	it('should render an image', () => {
		render(<ContextImage />);
		expect(screen.getByRole('img')).toBeInTheDocument();
	});

	it('should have descriptive alt text', () => {
		render(<ContextImage />);
		const img = screen.getByAltText(
			"The word 'there' with the first 'e' highlighted in black"
		);
		expect(img).toBeInTheDocument();
	});

	it('should use Howard alphabet image', () => {
		render(<ContextImage />);
		const img = screen.getByRole('img');
		expect(img.src).toContain('Howard-assets/e-word-7asd.png');
	});

	it('should render as block element', () => {
		render(<ContextImage />);
		const img = screen.getByRole('img');
		expect(img.className).toContain('d_block');
	});

	it('should have max-width 100%', () => {
		render(<ContextImage />);
		const img = screen.getByRole('img');
		expect(img.className).toContain('max-w_100%');
	});
});
