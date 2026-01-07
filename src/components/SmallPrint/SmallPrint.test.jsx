import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SmallPrint } from './SmallPrint';

describe('SmallPrint', () => {
	it('renders copyright text', () => {
		render(<SmallPrint />);

		expect(screen.getByText(/Concept, design and/i)).toBeInTheDocument();
		expect(
			screen.getByText(/copyright ©2025-2026 g.j.hilton/i)
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

	it('does not show feedback button when onShowFeedback is not provided', () => {
		render(<SmallPrint />);

		const feedbackButton = screen.queryByRole('button', {
			name: /Report a problem/i,
		});
		expect(feedbackButton).not.toBeInTheDocument();
	});

	it('shows feedback button when onShowFeedback is provided', () => {
		const mockShowFeedback = vi.fn();
		render(<SmallPrint onShowFeedback={mockShowFeedback} />);

		const feedbackButton = screen.getByRole('button', {
			name: /Report a problem \/ send feedback/i,
		});
		expect(feedbackButton).toBeInTheDocument();
	});

	it('calls onShowFeedback when feedback button is clicked', async () => {
		const user = userEvent.setup();
		const mockShowFeedback = vi.fn();
		render(<SmallPrint onShowFeedback={mockShowFeedback} />);

		const feedbackButton = screen.getByRole('button', {
			name: /Report a problem \/ send feedback/i,
		});
		await user.click(feedbackButton);

		expect(mockShowFeedback).toHaveBeenCalledTimes(1);
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

	it('feedback button text is correct', () => {
		const mockShowFeedback = vi.fn();
		render(<SmallPrint onShowFeedback={mockShowFeedback} />);

		expect(
			screen.getByText('Report a problem / send feedback')
		).toBeInTheDocument();
	});

	it('renders correct number of elements when feedback is provided', () => {
		const mockShowFeedback = vi.fn();
		render(<SmallPrint onShowFeedback={mockShowFeedback} />);

		// Two actual links (GitHub, funeral games)
		const links = screen.getAllByRole('link');
		expect(links).toHaveLength(2);

		// One button for feedback
		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(1);
	});

	it('only renders two links when onShowFeedback is not provided', () => {
		render(<SmallPrint />);

		const links = screen.getAllByRole('link');
		expect(links).toHaveLength(2); // GitHub and funeral games only
	});

	it('displays version number in semantic versioning format', () => {
		render(<SmallPrint />);

		const versionElement = screen.getByText(/^v\d+\.\d+\.\d+$/);
		expect(versionElement).toBeInTheDocument();
	});
});
