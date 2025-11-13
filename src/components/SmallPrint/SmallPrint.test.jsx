import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SmallPrint from './SmallPrint';

describe('SmallPrint', () => {
	it('renders copyright text', () => {
		render(<SmallPrint />);

		expect(screen.getByText(/Concept, design and/i)).toBeInTheDocument();
		expect(
			screen.getByText(/copyright ©2025 g.j.hilton/i)
		).toBeInTheDocument();
	});

	it('renders GitHub link', () => {
		render(<SmallPrint />);

		const githubLink = screen.getByRole('link', { name: /code/i });
		expect(githubLink).toBeInTheDocument();
		expect(githubLink).toHaveAttribute(
			'href',
			'https://github.com/gjhilton/Sharpie'
		);
	});

	it('renders funeral games link', () => {
		render(<SmallPrint />);

		const funeralGamesLink = screen.getByRole('link', {
			name: /funeral games/i,
		});
		expect(funeralGamesLink).toBeInTheDocument();
		expect(funeralGamesLink).toHaveAttribute(
			'href',
			'http://funeralgames.co.uk'
		);
	});

	it('does not show feedback link when onShowFeedback is not provided', () => {
		render(<SmallPrint />);

		const feedbackLink = screen.queryByRole('link', {
			name: /Report a problem/i,
		});
		expect(feedbackLink).not.toBeInTheDocument();
	});

	it('shows feedback link when onShowFeedback is provided', () => {
		const mockShowFeedback = vi.fn();
		render(<SmallPrint onShowFeedback={mockShowFeedback} />);

		const feedbackLink = screen.getByRole('link', {
			name: /Report a problem \/ send feedback/i,
		});
		expect(feedbackLink).toBeInTheDocument();
	});

	it('calls onShowFeedback when feedback link is clicked', async () => {
		const user = userEvent.setup();
		const mockShowFeedback = vi.fn();
		render(<SmallPrint onShowFeedback={mockShowFeedback} />);

		const feedbackLink = screen.getByRole('link', {
			name: /Report a problem \/ send feedback/i,
		});
		await user.click(feedbackLink);

		expect(mockShowFeedback).toHaveBeenCalledTimes(1);
	});

	it('prevents default behavior when feedback link is clicked', async () => {
		const user = userEvent.setup();
		const mockShowFeedback = vi.fn();
		render(<SmallPrint onShowFeedback={mockShowFeedback} />);

		const feedbackLink = screen.getByRole('link', {
			name: /Report a problem \/ send feedback/i,
		});
		expect(feedbackLink).toHaveAttribute('href', '#');

		await user.click(feedbackLink);

		// If default wasn't prevented, browser would navigate
		expect(mockShowFeedback).toHaveBeenCalled();
	});

	it('renders as a footer element', () => {
		const { container } = render(<SmallPrint />);

		const footer = container.querySelector('footer');
		expect(footer).toBeInTheDocument();
	});

	it('contains manuscript context copyright notice', () => {
		render(<SmallPrint />);

		expect(
			screen.getByText(/Manuscript context copyright: as shown inline/i)
		).toBeInTheDocument();
	});

	it('feedback link text is correct', () => {
		const mockShowFeedback = vi.fn();
		render(<SmallPrint onShowFeedback={mockShowFeedback} />);

		expect(
			screen.getByText('Report a problem / send feedback')
		).toBeInTheDocument();
	});

	it('renders all links with correct targets', () => {
		const mockShowFeedback = vi.fn();
		render(<SmallPrint onShowFeedback={mockShowFeedback} />);

		const links = screen.getAllByRole('link');
		expect(links).toHaveLength(3); // feedback, GitHub, funeral games

		const githubLink = screen.getByRole('link', { name: /code/i });
		const funeralGamesLink = screen.getByRole('link', {
			name: /funeral games/i,
		});
		const feedbackLink = screen.getByRole('link', {
			name: /Report a problem/i,
		});

		expect(feedbackLink).toHaveAttribute('href', '#');
		expect(githubLink).toHaveAttribute(
			'href',
			'https://github.com/gjhilton/Sharpie'
		);
		expect(funeralGamesLink).toHaveAttribute(
			'href',
			'http://funeralgames.co.uk'
		);
	});

	it('only renders two links when onShowFeedback is not provided', () => {
		render(<SmallPrint />);

		const links = screen.getAllByRole('link');
		expect(links).toHaveLength(2); // GitHub and funeral games only
	});

	it('displays version number', () => {
		render(<SmallPrint />);

		const version = screen.getByText(/v\d+\.\d+\.\d+/);
		expect(version).toBeInTheDocument();
	});

	it('displays version 1.0.1', () => {
		render(<SmallPrint />);

		expect(screen.getByText('v1.0.1')).toBeInTheDocument();
	});

	it('version is in semantic versioning format', () => {
		render(<SmallPrint />);

		const versionText = screen.getByText(/^v\d+\.\d+\.\d+$/);
		expect(versionText).toBeInTheDocument();
	});
});
