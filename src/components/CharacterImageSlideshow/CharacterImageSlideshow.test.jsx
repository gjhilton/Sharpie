import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CharacterImageSlideshow } from '@components/CharacterImageSlideshow/CharacterImageSlideshow';

// Mock the CharacterImage component
vi.mock('@components/CharacterImage/CharacterImage.jsx', () => ({
	CharacterImage: ({ imagePath, caption, graph }) => (
		<div data-testid="character-image">
			<div data-testid="image-path">{imagePath}</div>
			{caption && <div data-testid="caption">{caption}</div>}
			{graph && <div data-testid="graph">{graph}</div>}
		</div>
	),
}));

describe('CharacterImageSlideshow', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it('renders CharacterImage with the first image initially', () => {
		const imagePaths = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];
		render(<CharacterImageSlideshow imagePaths={imagePaths} />);

		expect(screen.getByTestId('character-image')).toBeInTheDocument();
		expect(screen.getByTestId('image-path')).toHaveTextContent(
			'/image1.jpg'
		);
	});

	it('cycles through images after the default interval (2000ms)', () => {
		const imagePaths = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];
		const { container } = render(
			<CharacterImageSlideshow imagePaths={imagePaths} />
		);

		// Initially shows first image
		expect(
			container.querySelector('[data-testid="image-path"]')
		).toHaveTextContent('/image1.jpg');

		// After 2000ms, shows second image
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(
			container.querySelector('[data-testid="image-path"]')
		).toHaveTextContent('/image2.jpg');

		// After another 2000ms, shows third image
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(
			container.querySelector('[data-testid="image-path"]')
		).toHaveTextContent('/image3.jpg');

		// After another 2000ms, cycles back to first image
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(
			container.querySelector('[data-testid="image-path"]')
		).toHaveTextContent('/image1.jpg');
	});

	it('cycles through images with a custom interval', () => {
		const imagePaths = ['/image1.jpg', '/image2.jpg'];
		const { container } = render(
			<CharacterImageSlideshow imagePaths={imagePaths} interval={1000} />
		);

		// Initially shows first image
		expect(
			container.querySelector('[data-testid="image-path"]')
		).toHaveTextContent('/image1.jpg');

		// After 1000ms, shows second image
		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(
			container.querySelector('[data-testid="image-path"]')
		).toHaveTextContent('/image2.jpg');

		// After another 1000ms, cycles back to first image
		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(
			container.querySelector('[data-testid="image-path"]')
		).toHaveTextContent('/image1.jpg');
	});

	it('returns null when imagePaths is empty', () => {
		const { container } = render(
			<CharacterImageSlideshow imagePaths={[]} />
		);
		expect(container.firstChild).toBeNull();
	});

	it('returns null when imagePaths is undefined', () => {
		const { container } = render(
			<CharacterImageSlideshow imagePaths={undefined} />
		);
		expect(container.firstChild).toBeNull();
	});

	it('returns null when imagePaths is null', () => {
		const { container } = render(
			<CharacterImageSlideshow imagePaths={null} />
		);
		expect(container.firstChild).toBeNull();
	});

	it('passes caption prop to CharacterImage', () => {
		const imagePaths = ['/image1.jpg'];
		const caption = 'Test caption';
		render(
			<CharacterImageSlideshow
				imagePaths={imagePaths}
				caption={caption}
			/>
		);

		expect(screen.getByTestId('caption')).toHaveTextContent('Test caption');
	});

	it('cleans up the interval timer on unmount', () => {
		const imagePaths = ['/image1.jpg', '/image2.jpg'];
		const { unmount } = render(
			<CharacterImageSlideshow imagePaths={imagePaths} />
		);

		// Spy on clearInterval
		const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

		unmount();

		expect(clearIntervalSpy).toHaveBeenCalled();
		clearIntervalSpy.mockRestore();
	});

	it('restarts the timer when imagePaths prop changes', () => {
		const imagePaths1 = ['/image1.jpg', '/image2.jpg'];
		const imagePaths2 = ['/image3.jpg', '/image4.jpg'];
		const { rerender, container } = render(
			<CharacterImageSlideshow imagePaths={imagePaths1} />
		);

		// Initially shows first image from first array
		expect(
			container.querySelector('[data-testid="image-path"]')
		).toHaveTextContent('/image1.jpg');

		// Change imagePaths prop
		rerender(<CharacterImageSlideshow imagePaths={imagePaths2} />);

		// Should reset to first image of new array
		expect(
			container.querySelector('[data-testid="image-path"]')
		).toHaveTextContent('/image3.jpg');
	});

	it('restarts the timer when interval prop changes', () => {
		const imagePaths = ['/image1.jpg', '/image2.jpg'];
		const { rerender, container } = render(
			<CharacterImageSlideshow imagePaths={imagePaths} interval={2000} />
		);

		// Initially shows first image
		expect(
			container.querySelector('[data-testid="image-path"]')
		).toHaveTextContent('/image1.jpg');

		// Advance by 1500ms (not enough for 2000ms interval)
		act(() => {
			vi.advanceTimersByTime(1500);
		});
		expect(
			container.querySelector('[data-testid="image-path"]')
		).toHaveTextContent('/image1.jpg');

		// Change interval to 1000ms
		rerender(
			<CharacterImageSlideshow imagePaths={imagePaths} interval={1000} />
		);

		// Advance by 1000ms with new interval
		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(
			container.querySelector('[data-testid="image-path"]')
		).toHaveTextContent('/image2.jpg');
	});

	it('handles single image array without cycling', () => {
		const imagePaths = ['/single-image.jpg'];
		render(<CharacterImageSlideshow imagePaths={imagePaths} />);

		// Initially shows the single image
		expect(screen.getByTestId('image-path')).toHaveTextContent(
			'/single-image.jpg'
		);

		// After interval, should still show the same image (cycles back to index 0)
		vi.advanceTimersByTime(2000);
		expect(screen.getByTestId('image-path')).toHaveTextContent(
			'/single-image.jpg'
		);
	});
});
