import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlphabetSelectorWithSort from './AlphabetSelectorWithSort';

describe('AlphabetSelectorWithSort', () => {
	const mockAlphabetsMetadata = {
		Joscelyn: {
			title: 'Joscelyn typeface',
			date: '2019',
			sourceUri: 'https://example.com/joscelyn',
			difficulty: 'easy',
		},
		NBacon: {
			title: 'Letter from Nathaniel Bacon',
			date: '1594',
			sourceUri: 'https://example.com/nbacon',
			difficulty: 'medium',
		},
		Howard: {
			title: 'Letter: Charles Howard',
			date: '1579/80',
			sourceUri: 'https://example.com/howard',
			difficulty: 'medium',
		},
		Hill: {
			title: 'Commonplace book of William Hill',
			date: '1574/5',
			sourceUri: 'https://example.com/hill',
			difficulty: 'hard',
		},
	};

	const mockAlphabetNames = ['Joscelyn', 'NBacon', 'Howard', 'Hill'];
	const mockEnabledAlphabets = {
		Joscelyn: true,
		NBacon: false,
		Howard: true,
		Hill: false,
	};

	it('renders sort selector and alphabet list', () => {
		render(
			<AlphabetSelectorWithSort
				alphabetNames={mockAlphabetNames}
				alphabetsMetadata={mockAlphabetsMetadata}
				enabledAlphabets={mockEnabledAlphabets}
				onToggle={() => {}}
			/>
		);

		expect(screen.getByText('Sort by:')).toBeInTheDocument();
		expect(screen.getByRole('combobox')).toBeInTheDocument();
		expect(screen.getByText('Joscelyn typeface')).toBeInTheDocument();
	});

	it('defaults to sorting by date', () => {
		render(
			<AlphabetSelectorWithSort
				alphabetNames={mockAlphabetNames}
				alphabetsMetadata={mockAlphabetsMetadata}
				enabledAlphabets={mockEnabledAlphabets}
				onToggle={() => {}}
			/>
		);

		const select = screen.getByRole('combobox');
		expect(select).toHaveValue('date');
	});

	it('displays alphabets sorted by date initially', () => {
		render(
			<AlphabetSelectorWithSort
				alphabetNames={mockAlphabetNames}
				alphabetsMetadata={mockAlphabetsMetadata}
				enabledAlphabets={mockEnabledAlphabets}
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
			<AlphabetSelectorWithSort
				alphabetNames={mockAlphabetNames}
				alphabetsMetadata={mockAlphabetsMetadata}
				enabledAlphabets={mockEnabledAlphabets}
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
			<AlphabetSelectorWithSort
				alphabetNames={mockAlphabetNames}
				alphabetsMetadata={mockAlphabetsMetadata}
				enabledAlphabets={mockEnabledAlphabets}
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
			<AlphabetSelectorWithSort
				alphabetNames={mockAlphabetNames}
				alphabetsMetadata={mockAlphabetsMetadata}
				enabledAlphabets={mockEnabledAlphabets}
				onToggle={() => {}}
			/>
		);

		expect(screen.queryByText('Difficulty: Easy')).not.toBeInTheDocument();
		expect(
			screen.queryByText('Difficulty: Medium')
		).not.toBeInTheDocument();
		expect(screen.queryByText('Difficulty: Hard')).not.toBeInTheDocument();
	});

	it('groups alphabets by difficulty correctly', async () => {
		const user = userEvent.setup();

		render(
			<AlphabetSelectorWithSort
				alphabetNames={mockAlphabetNames}
				alphabetsMetadata={mockAlphabetsMetadata}
				enabledAlphabets={mockEnabledAlphabets}
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

	it('calls onToggle when alphabet is toggled', async () => {
		const handleToggle = vi.fn();
		const user = userEvent.setup();

		render(
			<AlphabetSelectorWithSort
				alphabetNames={mockAlphabetNames}
				alphabetsMetadata={mockAlphabetsMetadata}
				enabledAlphabets={mockEnabledAlphabets}
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
			<AlphabetSelectorWithSort
				alphabetNames={mockAlphabetNames}
				alphabetsMetadata={mockAlphabetsMetadata}
				enabledAlphabets={mockEnabledAlphabets}
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
			<AlphabetSelectorWithSort
				alphabetNames={mockAlphabetNames}
				alphabetsMetadata={mockAlphabetsMetadata}
				enabledAlphabets={mockEnabledAlphabets}
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

	it('handles empty alphabet list', () => {
		render(
			<AlphabetSelectorWithSort
				alphabetNames={[]}
				alphabetsMetadata={{}}
				enabledAlphabets={{}}
				onToggle={() => {}}
			/>
		);

		expect(screen.getByText('Sort by:')).toBeInTheDocument();
		expect(screen.queryAllByRole('switch')).toHaveLength(0);
	});

	describe('Bulk selection', () => {
		it('calls onToggle for each disabled alphabet when select all is clicked', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			const enabledAlphabets = {
				Joscelyn: true,
				NBacon: false,
				Howard: false,
				Hill: false,
			};

			render(
				<AlphabetSelectorWithSort
					alphabetNames={mockAlphabetNames}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={enabledAlphabets}
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

		it('calls onToggle for each enabled alphabet when deselect all is clicked', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			const enabledAlphabets = {
				Joscelyn: true,
				NBacon: true,
				Howard: true,
				Hill: false,
			};

			render(
				<AlphabetSelectorWithSort
					alphabetNames={mockAlphabetNames}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={enabledAlphabets}
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

		it('does not call onToggle if all alphabets in group are already selected', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			const enabledAlphabets = {
				Joscelyn: true,
				NBacon: false,
				Howard: false,
				Hill: false,
			};

			render(
				<AlphabetSelectorWithSort
					alphabetNames={mockAlphabetNames}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={enabledAlphabets}
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

		it('does not call onToggle if no alphabets in group are selected', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			const enabledAlphabets = {
				Joscelyn: false,
				NBacon: false,
				Howard: false,
				Hill: false,
			};

			render(
				<AlphabetSelectorWithSort
					alphabetNames={mockAlphabetNames}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={enabledAlphabets}
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

		it('handles select all when some alphabets are already selected', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			const enabledAlphabets = {
				Joscelyn: false,
				NBacon: true,
				Howard: false,
				Hill: false,
			};

			render(
				<AlphabetSelectorWithSort
					alphabetNames={mockAlphabetNames}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={enabledAlphabets}
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

		it('handles deselect all when some alphabets are already deselected', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			const enabledAlphabets = {
				Joscelyn: false,
				NBacon: true,
				Howard: false,
				Hill: false,
			};

			render(
				<AlphabetSelectorWithSort
					alphabetNames={mockAlphabetNames}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={enabledAlphabets}
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
