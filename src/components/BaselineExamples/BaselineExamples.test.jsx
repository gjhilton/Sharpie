import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BaselineExamples } from './BaselineExamples';

vi.mock('@components/ExampleCard/ExampleCard', () => ({
	ExampleCard: ({ title, children }) => (
		<div data-testid="example-card" data-title={title}>
			{children}
		</div>
	),
}));

vi.mock('@components/CharacterImage/CharacterImage', () => ({
	CharacterImage: ({ imagePath, caption, showBaseline }) => (
		<div
			data-testid="character-image"
			data-baseline={showBaseline}
			data-caption={caption}
		>
			<img src={imagePath} alt={caption} />
		</div>
	),
}));

describe('BaselineExamples', () => {
	it('should render two example cards', () => {
		render(<BaselineExamples />);
		const cards = screen.getAllByTestId('example-card');
		expect(cards).toHaveLength(2);
	});

	it('should render "Without baseline" card', () => {
		render(<BaselineExamples />);
		const cards = screen.getAllByTestId('example-card');
		expect(cards[0]).toHaveAttribute('data-title', 'Without baseline');
	});

	it('should render "With baseline" card', () => {
		render(<BaselineExamples />);
		const cards = screen.getAllByTestId('example-card');
		expect(cards[1]).toHaveAttribute('data-title', 'With baseline');
	});

	it('should render two character images', () => {
		render(<BaselineExamples />);
		const images = screen.getAllByTestId('character-image');
		expect(images).toHaveLength(2);
	});

	it('should render first image without baseline', () => {
		render(<BaselineExamples />);
		const images = screen.getAllByTestId('character-image');
		expect(images[0]).toHaveAttribute('data-baseline', 'false');
	});

	it('should render second image with baseline', () => {
		render(<BaselineExamples />);
		const images = screen.getAllByTestId('character-image');
		expect(images[1]).toHaveAttribute('data-baseline', 'true');
	});

	it('should use Joscelyn minuscule b image', () => {
		render(<BaselineExamples />);
		const img = screen.getAllByRole('img')[0];
		expect(img.src).toContain('joscelyn-minuscule-assets/b.png');
	});

	it('should render with grid layout', () => {
		const { container } = render(<BaselineExamples />);
		const grid = container.firstChild;
		expect(grid.className).toContain('d_grid');
	});
});
