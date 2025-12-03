import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroSection } from '@components/HeroSection/HeroSection';

vi.mock('@data/hero.md?raw', () => ({
	default: 'Test *hero* content with emphasis.',
}));

vi.mock('@components/Button/Button.jsx', () => ({
	Button: ({ label, onClick, hero }) => (
		<button onClick={onClick} data-hero={hero}>
			{label}
		</button>
	),
}));

vi.mock('@components/Layout/Layout.jsx', () => ({
	PageTitle: ({ children }) => <h1 data-testid="page-title">{children}</h1>,
	Paragraph: ({ children }) => <p>{children}</p>,
}));

describe('HeroSection', () => {
	it('should render the page title', () => {
		render(<HeroSection onPlay={() => {}} />);
		expect(screen.getByTestId('page-title')).toBeInTheDocument();
		expect(screen.getByText(/Hone your/)).toBeInTheDocument();
	});

	it('should render Secretary in title', () => {
		render(<HeroSection onPlay={() => {}} />);
		expect(screen.getByText('Secretary')).toBeInTheDocument();
	});

	it('should render hero content from markdown', () => {
		render(<HeroSection onPlay={() => {}} />);
		expect(screen.getByText(/Test/)).toBeInTheDocument();
	});

	it('should render emphasis from markdown', () => {
		render(<HeroSection onPlay={() => {}} />);
		const emphasis = screen.getByText('hero');
		expect(emphasis.tagName).toBe('EM');
	});

	it('should render Play button', () => {
		render(<HeroSection onPlay={() => {}} />);
		expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
	});

	it('should render Play button as hero style', () => {
		render(<HeroSection onPlay={() => {}} />);
		const button = screen.getByRole('button', { name: 'Play' });
		expect(button).toHaveAttribute('data-hero', 'true');
	});

	it('should call onPlay when Play button is clicked', async () => {
		const user = userEvent.setup();
		const handlePlay = vi.fn();
		render(<HeroSection onPlay={handlePlay} />);

		await user.click(screen.getByRole('button', { name: 'Play' }));
		expect(handlePlay).toHaveBeenCalledTimes(1);
	});

	it('should render as a section element', () => {
		const { container } = render(<HeroSection onPlay={() => {}} />);
		expect(container.querySelector('section')).toBeInTheDocument();
	});
});
