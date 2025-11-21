import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DifficultyHeading from './DifficultyHeading';

describe('DifficultyHeading', () => {
	it('renders heading with easy difficulty', () => {
		render(<DifficultyHeading difficulty="easy" />);

		const heading = screen.getByRole('heading', { level: 3 });
		expect(heading).toHaveTextContent('Difficulty: Easy');
	});

	it('renders heading with medium difficulty', () => {
		render(<DifficultyHeading difficulty="medium" />);

		const heading = screen.getByRole('heading', { level: 3 });
		expect(heading).toHaveTextContent('Difficulty: Medium');
	});

	it('renders heading with hard difficulty', () => {
		render(<DifficultyHeading difficulty="hard" />);

		const heading = screen.getByRole('heading', { level: 3 });
		expect(heading).toHaveTextContent('Difficulty: Hard');
	});

	it('uses semantic h3 element', () => {
		render(<DifficultyHeading difficulty="easy" />);

		const heading = screen.getByRole('heading', { level: 3 });
		expect(heading.tagName).toBe('H3');
	});

	it('falls back to raw difficulty value if not in labels', () => {
		render(<DifficultyHeading difficulty="unknown" />);

		const heading = screen.getByRole('heading', { level: 3 });
		expect(heading).toHaveTextContent('Difficulty: unknown');
	});

	it('displays all three difficulty levels correctly', () => {
		const { rerender } = render(<DifficultyHeading difficulty="easy" />);
		expect(screen.getByText('Difficulty: Easy')).toBeInTheDocument();

		rerender(<DifficultyHeading difficulty="medium" />);
		expect(screen.getByText('Difficulty: Medium')).toBeInTheDocument();

		rerender(<DifficultyHeading difficulty="hard" />);
		expect(screen.getByText('Difficulty: Hard')).toBeInTheDocument();
	});
});
