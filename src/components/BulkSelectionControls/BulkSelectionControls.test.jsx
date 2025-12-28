import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BulkSelectionControls } from './BulkSelectionControls';

describe('BulkSelectionControls', () => {
	it('renders select all and deselect all links', () => {
		render(
			<BulkSelectionControls
				difficulty="easy"
				onSelectAll={() => {}}
				onDeselectAll={() => {}}
			/>
		);

		expect(screen.getByText('select all')).toBeInTheDocument();
		expect(screen.getByText('deselect all')).toBeInTheDocument();
	});

	it('calls onSelectAll with difficulty when select all is clicked', async () => {
		const handleSelectAll = vi.fn();
		const user = userEvent.setup();

		render(
			<BulkSelectionControls
				difficulty="medium"
				allSelected={false}
				onSelectAll={handleSelectAll}
				onDeselectAll={() => {}}
			/>
		);

		const selectAllLink = screen.getByText('select all');
		await user.click(selectAllLink);

		expect(handleSelectAll).toHaveBeenCalledWith('medium');
	});

	it('calls onDeselectAll with difficulty when deselect all is clicked', async () => {
		const handleDeselectAll = vi.fn();
		const user = userEvent.setup();

		render(
			<BulkSelectionControls
				difficulty="hard"
				noneSelected={false}
				onSelectAll={() => {}}
				onDeselectAll={handleDeselectAll}
			/>
		);

		const deselectAllLink = screen.getByText('deselect all');
		await user.click(deselectAllLink);

		expect(handleDeselectAll).toHaveBeenCalledWith('hard');
	});

	it('disables select all when allSelected is true', async () => {
		const handleSelectAll = vi.fn();
		const user = userEvent.setup();

		render(
			<BulkSelectionControls
				difficulty="easy"
				allSelected={true}
				onSelectAll={handleSelectAll}
				onDeselectAll={() => {}}
			/>
		);

		const selectAllButton = screen.getByRole('button', {
			name: 'select all',
		});
		expect(selectAllButton).toBeDisabled();

		await user.click(selectAllButton);
		expect(handleSelectAll).not.toHaveBeenCalled();
	});

	it('disables deselect all when noneSelected is true', async () => {
		const handleDeselectAll = vi.fn();
		const user = userEvent.setup();

		render(
			<BulkSelectionControls
				difficulty="easy"
				noneSelected={true}
				onSelectAll={() => {}}
				onDeselectAll={handleDeselectAll}
			/>
		);

		const deselectAllButton = screen.getByRole('button', {
			name: 'deselect all',
		});
		expect(deselectAllButton).toBeDisabled();

		await user.click(deselectAllButton);
		expect(handleDeselectAll).not.toHaveBeenCalled();
	});

	it('enables both buttons when some but not all are selected', () => {
		render(
			<BulkSelectionControls
				difficulty="easy"
				allSelected={false}
				noneSelected={false}
				onSelectAll={() => {}}
				onDeselectAll={() => {}}
			/>
		);

		const selectAllButton = screen.getByRole('button', {
			name: 'select all',
		});
		const deselectAllButton = screen.getByRole('button', {
			name: 'deselect all',
		});

		expect(selectAllButton).not.toBeDisabled();
		expect(deselectAllButton).not.toBeDisabled();
	});

	it('works without callback functions', async () => {
		const user = userEvent.setup();

		render(<BulkSelectionControls difficulty="easy" />);

		const selectAllLink = screen.getByText('select all');
		// Should not throw error
		await user.click(selectAllLink);
	});

	it('renders with different difficulty levels', () => {
		const { rerender } = render(
			<BulkSelectionControls
				difficulty="easy"
				onSelectAll={() => {}}
				onDeselectAll={() => {}}
			/>
		);

		expect(screen.getByText('select all')).toBeInTheDocument();

		rerender(
			<BulkSelectionControls
				difficulty="hard"
				onSelectAll={() => {}}
				onDeselectAll={() => {}}
			/>
		);

		expect(screen.getByText('select all')).toBeInTheDocument();
	});
});
