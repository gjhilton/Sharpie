import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SortSelector from './SortSelector';

describe('SortSelector', () => {
	const mockOptions = [
		{ value: 'date', label: 'By Date' },
		{ value: 'name', label: 'By Name' },
		{ value: 'difficulty', label: 'By Difficulty' },
	];

	it('renders label and select element', () => {
		render(
			<SortSelector
				value="date"
				onChange={() => {}}
				options={mockOptions}
			/>
		);

		expect(screen.getByText('Sort by:')).toBeInTheDocument();
		expect(screen.getByRole('combobox')).toBeInTheDocument();
	});

	it('renders all options', () => {
		render(
			<SortSelector
				value="date"
				onChange={() => {}}
				options={mockOptions}
			/>
		);

		expect(screen.getByRole('option', { name: 'By Date' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'By Name' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'By Difficulty' })).toBeInTheDocument();
	});

	it('displays the selected value', () => {
		render(
			<SortSelector
				value="name"
				onChange={() => {}}
				options={mockOptions}
			/>
		);

		const select = screen.getByRole('combobox');
		expect(select).toHaveValue('name');
	});

	it('calls onChange when selection changes', async () => {
		const handleChange = vi.fn();
		const user = userEvent.setup();

		render(
			<SortSelector
				value="date"
				onChange={handleChange}
				options={mockOptions}
			/>
		);

		const select = screen.getByRole('combobox');
		await user.selectOptions(select, 'difficulty');

		expect(handleChange).toHaveBeenCalledWith('difficulty');
	});

	it('uses custom label when provided', () => {
		render(
			<SortSelector
				value="date"
				onChange={() => {}}
				options={mockOptions}
				label="Order by:"
			/>
		);

		expect(screen.getByText('Order by:')).toBeInTheDocument();
		expect(screen.queryByText('Sort by:')).not.toBeInTheDocument();
	});

	it('uses custom id when provided', () => {
		render(
			<SortSelector
				value="date"
				onChange={() => {}}
				options={mockOptions}
				id="custom-sort"
			/>
		);

		const select = screen.getByRole('combobox');
		expect(select).toHaveAttribute('id', 'custom-sort');
	});

	it('associates label with select element', () => {
		render(
			<SortSelector
				value="date"
				onChange={() => {}}
				options={mockOptions}
				id="test-sort"
			/>
		);

		const label = screen.getByText('Sort by:');
		const select = screen.getByRole('combobox');

		expect(label).toHaveAttribute('for', 'test-sort');
		expect(select).toHaveAttribute('id', 'test-sort');
	});

	it('handles empty options array', () => {
		render(
			<SortSelector
				value=""
				onChange={() => {}}
				options={[]}
			/>
		);

		const select = screen.getByRole('combobox');
		expect(select.children).toHaveLength(0);
	});

	it('handles single option', () => {
		const singleOption = [{ value: 'date', label: 'By Date' }];

		render(
			<SortSelector
				value="date"
				onChange={() => {}}
				options={singleOption}
			/>
		);

		expect(screen.getByRole('option', { name: 'By Date' })).toBeInTheDocument();
		expect(screen.getAllByRole('option')).toHaveLength(1);
	});
});
