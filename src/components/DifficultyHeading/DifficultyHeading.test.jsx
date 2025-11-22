import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

	describe('Bulk selection controls', () => {
		it('renders select all and deselect all links', () => {
			render(
				<DifficultyHeading
					difficulty="easy"
					onSelectAll={() => {}}
					onDeselectAll={() => {}}
				/>
			);

			expect(screen.getByText('select all')).toBeInTheDocument();
			expect(screen.getByText('deselect all')).toBeInTheDocument();
		});

		it('calls onSelectAll when select all link is clicked', async () => {
			const handleSelectAll = vi.fn();
			const user = userEvent.setup();

			render(
				<DifficultyHeading
					difficulty="easy"
					allSelected={false}
					onSelectAll={handleSelectAll}
					onDeselectAll={() => {}}
				/>
			);

			const selectAllLink = screen.getByText('select all');
			await user.click(selectAllLink);

			expect(handleSelectAll).toHaveBeenCalledWith('easy');
		});

		it('calls onDeselectAll when deselect all link is clicked', async () => {
			const handleDeselectAll = vi.fn();
			const user = userEvent.setup();

			render(
				<DifficultyHeading
					difficulty="medium"
					noneSelected={false}
					onSelectAll={() => {}}
					onDeselectAll={handleDeselectAll}
				/>
			);

			const deselectAllLink = screen.getByText('deselect all');
			await user.click(deselectAllLink);

			expect(handleDeselectAll).toHaveBeenCalledWith('medium');
		});

		it('disables select all link when all alphabets are selected', async () => {
			const handleSelectAll = vi.fn();
			const user = userEvent.setup();

			render(
				<DifficultyHeading
					difficulty="easy"
					allSelected={true}
					onSelectAll={handleSelectAll}
					onDeselectAll={() => {}}
				/>
			);

			const selectAllLink = screen.getByText('select all');
			expect(selectAllLink).toHaveAttribute('aria-disabled', 'true');

			await user.click(selectAllLink);
			expect(handleSelectAll).not.toHaveBeenCalled();
		});

		it('disables deselect all link when no alphabets are selected', async () => {
			const handleDeselectAll = vi.fn();
			const user = userEvent.setup();

			render(
				<DifficultyHeading
					difficulty="hard"
					noneSelected={true}
					onSelectAll={() => {}}
					onDeselectAll={handleDeselectAll}
				/>
			);

			const deselectAllLink = screen.getByText('deselect all');
			expect(deselectAllLink).toHaveAttribute('aria-disabled', 'true');

			await user.click(deselectAllLink);
			expect(handleDeselectAll).not.toHaveBeenCalled();
		});

		it('applies disabled styling when select all is disabled', () => {
			render(
				<DifficultyHeading
					difficulty="easy"
					allSelected={true}
					onSelectAll={() => {}}
					onDeselectAll={() => {}}
				/>
			);

			const selectAllLink = screen.getByText('select all');
			expect(selectAllLink).toHaveAttribute('aria-disabled', 'true');
		});

		it('applies disabled styling when deselect all is disabled', () => {
			render(
				<DifficultyHeading
					difficulty="easy"
					noneSelected={true}
					onSelectAll={() => {}}
					onDeselectAll={() => {}}
				/>
			);

			const deselectAllLink = screen.getByText('deselect all');
			expect(deselectAllLink).toHaveAttribute('aria-disabled', 'true');
		});

		it('enables both links when some but not all alphabets are selected', () => {
			render(
				<DifficultyHeading
					difficulty="easy"
					allSelected={false}
					noneSelected={false}
					onSelectAll={() => {}}
					onDeselectAll={() => {}}
				/>
			);

			const selectAllLink = screen.getByText('select all');
			const deselectAllLink = screen.getByText('deselect all');

			expect(selectAllLink).toHaveAttribute('aria-disabled', 'false');
			expect(deselectAllLink).toHaveAttribute('aria-disabled', 'false');
		});

		it('works without callback functions', async () => {
			const user = userEvent.setup();

			render(
				<DifficultyHeading
					difficulty="easy"
					allSelected={false}
					noneSelected={false}
				/>
			);

			const selectAllLink = screen.getByText('select all');
			// Should not throw error when clicked
			await user.click(selectAllLink);
		});
	});
});
