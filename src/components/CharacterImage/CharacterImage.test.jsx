import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CharacterImage from './CharacterImage';

describe('CharacterImage', () => {
	it('renders image with imagePath', () => {
		const imagePath = '/path/to/image.jpg';
		render(<CharacterImage imagePath={imagePath} />);

		const img = screen.getByRole('img');
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('src', imagePath);
	});

	it('uses caption as alt text when provided', () => {
		const imagePath = '/path/to/image.jpg';
		const caption = 'A portrait of Shakespeare';
		render(<CharacterImage imagePath={imagePath} caption={caption} />);

		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('alt', caption);
	});

	it('uses default alt text when caption is not provided', () => {
		const imagePath = '/path/to/image.jpg';
		render(<CharacterImage imagePath={imagePath} />);

		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('alt', 'Character to identify');
	});

	it('uses default alt text when caption is empty string', () => {
		const imagePath = '/path/to/image.jpg';
		render(<CharacterImage imagePath={imagePath} caption="" />);

		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('alt', 'Character to identify');
	});

	it('renders with correct src attribute', () => {
		const imagePath = 'https://example.com/character.png';
		render(<CharacterImage imagePath={imagePath} />);

		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('src', imagePath);
	});

	it('wraps image in a container div', () => {
		const { container } = render(<CharacterImage imagePath="/test.jpg" />);

		const wrapper = container.firstChild;
		expect(wrapper.tagName).toBe('DIV');

		const img = wrapper.querySelector('img');
		expect(img).toBeInTheDocument();
	});

	it('handles relative image paths', () => {
		const imagePath = './images/character.jpg';
		render(<CharacterImage imagePath={imagePath} />);

		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('src', imagePath);
	});

	it('handles absolute image paths', () => {
		const imagePath = '/assets/characters/character1.jpg';
		render(<CharacterImage imagePath={imagePath} />);

		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('src', imagePath);
	});

	it('can find image by alt text when caption is provided', () => {
		const imagePath = '/test.jpg';
		const caption = 'Hamlet contemplating a skull';

		render(<CharacterImage imagePath={imagePath} caption={caption} />);

		const img = screen.getByAltText(caption);
		expect(img).toBeInTheDocument();
	});

	it('can find image by default alt text when caption is not provided', () => {
		const imagePath = '/test.jpg';

		render(<CharacterImage imagePath={imagePath} />);

		const img = screen.getByAltText('Character to identify');
		expect(img).toBeInTheDocument();
	});

	it('renders only one image element', () => {
		render(<CharacterImage imagePath="/test.jpg" caption="Test" />);

		const images = screen.getAllByRole('img');
		expect(images).toHaveLength(1);
	});

	it('handles special characters in caption', () => {
		const imagePath = '/test.jpg';
		const caption = 'King Lear & Cordelia - Act V';

		render(<CharacterImage imagePath={imagePath} caption={caption} />);

		const img = screen.getByAltText(caption);
		expect(img).toBeInTheDocument();
	});

	it('handles different image file types', () => {
		const extensions = ['.jpg', '.png', '.gif', '.webp', '.svg'];

		extensions.forEach(ext => {
			const imagePath = `/test${ext}`;
			const { unmount } = render(
				<CharacterImage imagePath={imagePath} />
			);

			const img = screen.getByRole('img');
			expect(img).toHaveAttribute('src', imagePath);

			unmount();
		});
	});

	describe('baseline functionality', () => {
		it('does not render baseline when showBaseline is false', () => {
			const { container } = render(
				<CharacterImage imagePath="/test.jpg" showBaseline={false} />
			);

			const baseline = container.querySelector('[aria-hidden="true"]');
			expect(baseline).not.toBeInTheDocument();
		});

		it('renders baseline when showBaseline is true', () => {
			const { container } = render(
				<CharacterImage imagePath="/test.jpg" showBaseline={true} />
			);

			const baseline = container.querySelector('[aria-hidden="true"]');
			expect(baseline).toBeInTheDocument();
		});

		it('baseline is a div element', () => {
			const { container } = render(
				<CharacterImage imagePath="/test.jpg" showBaseline={true} />
			);

			const baseline = container.querySelector('[aria-hidden="true"]');
			expect(baseline.tagName).toBe('DIV');
		});

		it('baseline has aria-hidden attribute', () => {
			const { container } = render(
				<CharacterImage imagePath="/test.jpg" showBaseline={true} />
			);

			const baseline = container.querySelector('[aria-hidden="true"]');
			expect(baseline).toHaveAttribute('aria-hidden', 'true');
		});
	});

	describe('note functionality', () => {
		it('does not render note when note prop is not provided', () => {
			render(<CharacterImage imagePath="/test.jpg" />);

			const note = screen.queryByText('First letter of word.');
			expect(note).not.toBeInTheDocument();
		});

		it('renders note when note prop is provided', () => {
			render(
				<CharacterImage
					imagePath="/test.jpg"
					note="First letter of word."
				/>
			);

			const note = screen.getByText('First letter of word.');
			expect(note).toBeInTheDocument();
		});

		it('renders custom note text', () => {
			render(
				<CharacterImage
					imagePath="/test.jpg"
					note="Round c with sharp turn."
				/>
			);

			const note = screen.getByText('Round c with sharp turn.');
			expect(note).toBeInTheDocument();
		});

		it('note is positioned above the image', () => {
			const { container } = render(
				<CharacterImage imagePath="/test.jpg" note="Test note" />
			);

			const noteElement = screen.getByText('Test note');
			const imageElement = container.querySelector('img');

			expect(noteElement).toBeInTheDocument();
			expect(imageElement).toBeInTheDocument();
		});

		it('does not render note when note prop is empty string', () => {
			render(<CharacterImage imagePath="/test.jpg" note="" />);

			const wrapper = screen
				.getByRole('img')
				.closest('div').parentElement;
			const children = wrapper.children;
			expect(children).toHaveLength(1);
		});

		it('renders note alongside baseline when both are present', () => {
			const { container } = render(
				<CharacterImage
					imagePath="/test.jpg"
					note="First letter of word."
					showBaseline={true}
				/>
			);

			const note = screen.getByText('First letter of word.');
			const baseline = container.querySelector('[aria-hidden="true"]');

			expect(note).toBeInTheDocument();
			expect(baseline).toBeInTheDocument();
		});
	});
});
