import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HandSelectorWithSort } from '@components/HandSelectorWithSort/HandSelectorWithSort';

describe('HandSelectorWithSort', () => {
	const mockHandsMetadata = {
		Joscelyn: {
			title: 'Joscelyn typeface',
			date: '2019',
			sourceUri: 'https://example.com/joscelyn',
			difficulty: 'easy',
			majuscules: 26,
			minuscules: 26,
		},
		NBacon: {
			title: 'Letter from Nathaniel Bacon',
			date: '1594',
			sourceUri: 'https://example.com/nbacon',
			difficulty: 'medium',
			majuscules: 1,
			minuscules: 21,
		},
		Howard: {
			title: 'Letter: Charles Howard',
			date: '1579/80',
			sourceUri: 'https://example.com/howard',
			difficulty: 'medium',
			majuscules: 7,
			minuscules: 31,
		},
		Hill: {
			title: 'Commonplace book of William Hill',
			date: '1574/5',
			sourceUri: 'https://example.com/hill',
			difficulty: 'hard',
			majuscules: 20,
			minuscules: 49,
		},
	};

	const mockHandNames = ['Joscelyn', 'NBacon', 'Howard', 'Hill'];
	const mockEnabledHands = {
		Joscelyn: true,
		NBacon: false,
		Howard: true,
		Hill: false,
	};

	it('renders sort selector and hand list', () => {
		render(
			<HandSelectorWithSort
				handNames={mockHandNames}
				handsMetadata={mockHandsMetadata}
				enabledHands={mockEnabledHands}
				onToggle={() => {}}
			/>
		);

		expect(screen.getByText('Sort by:')).toBeInTheDocument();
		expect(screen.getByRole('combobox')).toBeInTheDocument();
		expect(screen.getByText('Joscelyn typeface')).toBeInTheDocument();
	});

	it('defaults to sorting by date', () => {
		render(
			<HandSelectorWithSort
				handNames={mockHandNames}
				handsMetadata={mockHandsMetadata}
				enabledHands={mockEnabledHands}
				onToggle={() => {}}
			/>
		);

		const select = screen.getByRole('combobox');
		expect(select).toHaveValue('date');
	});

	it('displays hands sorted by date initially', () => {
		render(
			<HandSelectorWithSort
				handNames={mockHandNames}
				handsMetadata={mockHandsMetadata}
				enabledHands={mockEnabledHands}
				onToggle={() => {}}
			/>
		);

		const titles = screen.getAllByText(/typeface|Letter|Commonplace/);
		// Hill (1574/5), Howard (1579/80), NBacon (1594), Joscelyn (2019)
		expect(titles[0]).toHaveTextContent('Commonplace book of William Hill');
		expect(titles[1]).toHaveTextContent('Letter: Charles Howard');
		expect(titles[2]).toHaveTextContent('Letter from Nathaniel Bacon');
		expect(titles[3]).toHaveTextContent('Joscelyn typeface');
	});

	it('switches to sort by name when selected', async () => {
		const user = userEvent.setup();

		render(
			<HandSelectorWithSort
				handNames={mockHandNames}
				handsMetadata={mockHandsMetadata}
				enabledHands={mockEnabledHands}
				onToggle={() => {}}
			/>
		);

		const select = screen.getByRole('combobox');
		await user.selectOptions(select, 'name');

		const titles = screen.getAllByText(/typeface|Letter|Commonplace/);
		// Hill, Howard, Joscelyn, NBacon (alphabetical)
		expect(titles[0]).toHaveTextContent('Commonplace book of William Hill');
		expect(titles[1]).toHaveTextContent('Letter: Charles Howard');
		expect(titles[2]).toHaveTextContent('Joscelyn typeface');
		expect(titles[3]).toHaveTextContent('Letter from Nathaniel Bacon');
	});

	it('switches to sort by difficulty when selected', async () => {
		const user = userEvent.setup();

		render(
			<HandSelectorWithSort
				handNames={mockHandNames}
				handsMetadata={mockHandsMetadata}
				enabledHands={mockEnabledHands}
				onToggle={() => {}}
			/>
		);

		const select = screen.getByRole('combobox');
		await user.selectOptions(select, 'difficulty');

		// Should show difficulty headings
		expect(screen.getByText('Difficulty: Easy')).toBeInTheDocument();
		expect(screen.getByText('Difficulty: Medium')).toBeInTheDocument();
		expect(screen.getByText('Difficulty: Hard')).toBeInTheDocument();
	});

	it('does not show difficulty headings when not sorted by difficulty', () => {
		render(
			<HandSelectorWithSort
				handNames={mockHandNames}
				handsMetadata={mockHandsMetadata}
				enabledHands={mockEnabledHands}
				onToggle={() => {}}
			/>
		);

		expect(screen.queryByText('Difficulty: Easy')).not.toBeInTheDocument();
		expect(
			screen.queryByText('Difficulty: Medium')
		).not.toBeInTheDocument();
		expect(screen.queryByText('Difficulty: Hard')).not.toBeInTheDocument();
	});

	it('groups hands by difficulty correctly', async () => {
		const user = userEvent.setup();

		render(
			<HandSelectorWithSort
				handNames={mockHandNames}
				handsMetadata={mockHandsMetadata}
				enabledHands={mockEnabledHands}
				onToggle={() => {}}
			/>
		);

		const select = screen.getByRole('combobox');
		await user.selectOptions(select, 'difficulty');

		const headings = screen.getAllByRole('heading', { level: 3 });
		expect(headings).toHaveLength(3);
		expect(headings[0]).toHaveTextContent('Difficulty: Easy');
		expect(headings[1]).toHaveTextContent('Difficulty: Medium');
		expect(headings[2]).toHaveTextContent('Difficulty: Hard');
	});

	it('calls onToggle when hand is toggled', async () => {
		const handleToggle = vi.fn();
		const user = userEvent.setup();

		render(
			<HandSelectorWithSort
				handNames={mockHandNames}
				handsMetadata={mockHandsMetadata}
				enabledHands={mockEnabledHands}
				onToggle={handleToggle}
			/>
		);

		const toggles = screen.getAllByRole('switch');
		await user.click(toggles[0]); // Click first toggle (Hill in date sort)

		expect(handleToggle).toHaveBeenCalledWith('Hill');
	});

	it('preserves toggle functionality when changing sort mode', async () => {
		const handleToggle = vi.fn();
		const user = userEvent.setup();

		render(
			<HandSelectorWithSort
				handNames={mockHandNames}
				handsMetadata={mockHandsMetadata}
				enabledHands={mockEnabledHands}
				onToggle={handleToggle}
			/>
		);

		// Change to difficulty sort
		const select = screen.getByRole('combobox');
		await user.selectOptions(select, 'difficulty');

		// Click a toggle
		const toggles = screen.getAllByRole('switch');
		await user.click(toggles[0]); // Click first toggle (Joscelyn in easy group)

		expect(handleToggle).toHaveBeenCalledWith('Joscelyn');
	});

	it('renders all three sort options', () => {
		render(
			<HandSelectorWithSort
				handNames={mockHandNames}
				handsMetadata={mockHandsMetadata}
				enabledHands={mockEnabledHands}
				onToggle={() => {}}
			/>
		);

		expect(
			screen.getByRole('option', { name: 'By Date' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('option', { name: 'By Name' })
		).toBeInTheDocument();
		expect(
			screen.getByRole('option', { name: 'By Difficulty' })
		).toBeInTheDocument();
	});

	it('displays letter counts for each hand', () => {
		render(
			<HandSelectorWithSort
				handNames={mockHandNames}
				handsMetadata={mockHandsMetadata}
				enabledHands={mockEnabledHands}
				onToggle={() => {}}
			/>
		);

		// Check for Joscelyn's letter count (26 + 26 = 52)
		expect(
			screen.getByText(/52 characters: 26 minuscule, 26 majuscule/)
		).toBeInTheDocument();
		// Check for NBacon's letter count (1 + 21 = 22)
		expect(
			screen.getByText(/22 characters: 21 minuscule, 1 majuscule/)
		).toBeInTheDocument();
	});

	it('handles empty hand list', () => {
		render(
			<HandSelectorWithSort
				handNames={[]}
				handsMetadata={{}}
				enabledHands={{}}
				onToggle={() => {}}
			/>
		);

		expect(screen.getByText('Sort by:')).toBeInTheDocument();
		expect(screen.queryAllByRole('switch')).toHaveLength(0);
	});

	describe('Bulk selection', () => {
		it('calls onToggle for each disabled hand when select all is clicked', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			const enabledHands = {
				Joscelyn: true,
				NBacon: false,
				Howard: false,
				Hill: false,
			};

			render(
				<HandSelectorWithSort
					handNames={mockHandNames}
					handsMetadata={mockHandsMetadata}
					enabledHands={enabledHands}
					onToggle={handleToggle}
				/>
			);

			// Switch to difficulty sort
			const select = screen.getByRole('combobox');
			await user.selectOptions(select, 'difficulty');

			// Click "select all" for medium difficulty (NBacon and Howard are disabled)
			const selectAllLinks = screen.getAllByText('select all');
			await user.click(selectAllLinks[1]); // Medium difficulty

			expect(handleToggle).toHaveBeenCalledTimes(2);
			expect(handleToggle).toHaveBeenCalledWith('NBacon');
			expect(handleToggle).toHaveBeenCalledWith('Howard');
		});

		it('calls onToggle for each enabled hand when deselect all is clicked', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			const enabledHands = {
				Joscelyn: true,
				NBacon: true,
				Howard: true,
				Hill: false,
			};

			render(
				<HandSelectorWithSort
					handNames={mockHandNames}
					handsMetadata={mockHandsMetadata}
					enabledHands={enabledHands}
					onToggle={handleToggle}
				/>
			);

			// Switch to difficulty sort
			const select = screen.getByRole('combobox');
			await user.selectOptions(select, 'difficulty');

			// Click "deselect all" for medium difficulty (NBacon and Howard are enabled)
			const deselectAllLinks = screen.getAllByText('deselect all');
			await user.click(deselectAllLinks[1]); // Medium difficulty

			expect(handleToggle).toHaveBeenCalledTimes(2);
			expect(handleToggle).toHaveBeenCalledWith('NBacon');
			expect(handleToggle).toHaveBeenCalledWith('Howard');
		});

		it('does not call onToggle if all hands in group are already selected', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			const enabledHands = {
				Joscelyn: true,
				NBacon: false,
				Howard: false,
				Hill: false,
			};

			render(
				<HandSelectorWithSort
					handNames={mockHandNames}
					handsMetadata={mockHandsMetadata}
					enabledHands={enabledHands}
					onToggle={handleToggle}
				/>
			);

			// Switch to difficulty sort
			const select = screen.getByRole('combobox');
			await user.selectOptions(select, 'difficulty');

			// Try to click "select all" for easy difficulty (Joscelyn is already enabled)
			const selectAllLinks = screen.getAllByText('select all');
			await user.click(selectAllLinks[0]); // Easy difficulty

			// Should not call onToggle because Joscelyn is already enabled
			expect(handleToggle).not.toHaveBeenCalled();
		});

		it('does not call onToggle if no hands in group are selected', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			const enabledHands = {
				Joscelyn: false,
				NBacon: false,
				Howard: false,
				Hill: false,
			};

			render(
				<HandSelectorWithSort
					handNames={mockHandNames}
					handsMetadata={mockHandsMetadata}
					enabledHands={enabledHands}
					onToggle={handleToggle}
				/>
			);

			// Switch to difficulty sort
			const select = screen.getByRole('combobox');
			await user.selectOptions(select, 'difficulty');

			// Try to click "deselect all" for easy difficulty (Joscelyn is already disabled)
			const deselectAllLinks = screen.getAllByText('deselect all');
			await user.click(deselectAllLinks[0]); // Easy difficulty

			// Should not call onToggle because Joscelyn is already disabled
			expect(handleToggle).not.toHaveBeenCalled();
		});

		it('handles select all when some hands are already selected', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			const enabledHands = {
				Joscelyn: false,
				NBacon: true,
				Howard: false,
				Hill: false,
			};

			render(
				<HandSelectorWithSort
					handNames={mockHandNames}
					handsMetadata={mockHandsMetadata}
					enabledHands={enabledHands}
					onToggle={handleToggle}
				/>
			);

			// Switch to difficulty sort
			const select = screen.getByRole('combobox');
			await user.selectOptions(select, 'difficulty');

			// Click "select all" for medium difficulty (NBacon is enabled, Howard is disabled)
			const selectAllLinks = screen.getAllByText('select all');
			await user.click(selectAllLinks[1]); // Medium difficulty

			// Should only toggle Howard (the disabled one)
			expect(handleToggle).toHaveBeenCalledTimes(1);
			expect(handleToggle).toHaveBeenCalledWith('Howard');
		});

		it('handles deselect all when some hands are already deselected', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			const enabledHands = {
				Joscelyn: false,
				NBacon: true,
				Howard: false,
				Hill: false,
			};

			render(
				<HandSelectorWithSort
					handNames={mockHandNames}
					handsMetadata={mockHandsMetadata}
					enabledHands={enabledHands}
					onToggle={handleToggle}
				/>
			);

			// Switch to difficulty sort
			const select = screen.getByRole('combobox');
			await user.selectOptions(select, 'difficulty');

			// Click "deselect all" for medium difficulty (NBacon is enabled, Howard is disabled)
			const deselectAllLinks = screen.getAllByText('deselect all');
			await user.click(deselectAllLinks[1]); // Medium difficulty

			// Should only toggle NBacon (the enabled one)
			expect(handleToggle).toHaveBeenCalledTimes(1);
			expect(handleToggle).toHaveBeenCalledWith('NBacon');
		});
	});
});
