import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HandList } from '@components/HandList/HandList';

describe('HandList', () => {
	const mockHandsMetadata = {
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
		Hill: {
			title: 'Commonplace book of William Hill',
			date: '1574/5',
			sourceUri: 'https://example.com/hill',
			difficulty: 'hard',
		},
	};

	const mockEnabledHands = {
		Joscelyn: true,
		NBacon: false,
		Hill: true,
	};

	describe('Flat list mode', () => {
		it('renders all hands in flat list', () => {
			render(
				<HandList
					hands={['Joscelyn', 'NBacon', 'Hill']}
					handsMetadata={mockHandsMetadata}
					enabledHands={mockEnabledHands}
					onToggle={() => {}}
				/>
			);

			expect(screen.getByText('Joscelyn typeface')).toBeInTheDocument();
			expect(
				screen.getByText('Letter from Nathaniel Bacon')
			).toBeInTheDocument();
			expect(
				screen.getByText('Commonplace book of William Hill')
			).toBeInTheDocument();
		});

		it('does not render difficulty headings in flat mode', () => {
			render(
				<HandList
					hands={['Joscelyn', 'NBacon', 'Hill']}
					handsMetadata={mockHandsMetadata}
					enabledHands={mockEnabledHands}
					onToggle={() => {}}
					showDifficultyGroups={false}
				/>
			);

			expect(
				screen.queryByText('Difficulty: Easy')
			).not.toBeInTheDocument();
			expect(
				screen.queryByText('Difficulty: Medium')
			).not.toBeInTheDocument();
			expect(
				screen.queryByText('Difficulty: Hard')
			).not.toBeInTheDocument();
		});

		it('displays correct toggle states', () => {
			render(
				<HandList
					hands={['Joscelyn', 'NBacon']}
					handsMetadata={mockHandsMetadata}
					enabledHands={mockEnabledHands}
					onToggle={() => {}}
				/>
			);

			const toggles = screen.getAllByRole('switch');
			expect(toggles[0]).toHaveAttribute('aria-checked', 'true'); // Joscelyn
			expect(toggles[1]).toHaveAttribute('aria-checked', 'false'); // NBacon
		});

		it('calls onToggle with correct hand name', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			render(
				<HandList
					hands={['Joscelyn', 'NBacon']}
					handsMetadata={mockHandsMetadata}
					enabledHands={mockEnabledHands}
					onToggle={handleToggle}
				/>
			);

			const toggles = screen.getAllByRole('switch');
			await user.click(toggles[1]); // Click NBacon toggle

			expect(handleToggle).toHaveBeenCalledWith('NBacon');
		});
	});

	describe('Grouped by difficulty mode', () => {
		const mockDifficultyGroups = {
			easy: ['Joscelyn'],
			medium: ['NBacon'],
			hard: ['Hill'],
		};

		it('renders difficulty headings when grouped', () => {
			render(
				<HandList
					hands={[]}
					handsMetadata={mockHandsMetadata}
					enabledHands={mockEnabledHands}
					onToggle={() => {}}
					showDifficultyGroups={true}
					difficultyGroups={mockDifficultyGroups}
					onSelectAll={() => {}}
					onDeselectAll={() => {}}
				/>
			);

			expect(screen.getByText('Difficulty: Easy')).toBeInTheDocument();
			expect(screen.getByText('Difficulty: Medium')).toBeInTheDocument();
			expect(screen.getByText('Difficulty: Hard')).toBeInTheDocument();
		});

		it('renders hands under correct difficulty headings', () => {
			const { container } = render(
				<HandList
					hands={[]}
					handsMetadata={mockHandsMetadata}
					enabledHands={mockEnabledHands}
					onToggle={() => {}}
					showDifficultyGroups={true}
					difficultyGroups={mockDifficultyGroups}
					onSelectAll={() => {}}
					onDeselectAll={() => {}}
				/>
			);

			const easyHeading = screen.getByText('Difficulty: Easy');
			const mediumHeading = screen.getByText('Difficulty: Medium');
			const hardHeading = screen.getByText('Difficulty: Hard');

			// Check headings are h3 elements
			expect(easyHeading.tagName).toBe('H3');
			expect(mediumHeading.tagName).toBe('H3');
			expect(hardHeading.tagName).toBe('H3');

			// Check hands are present
			expect(screen.getByText('Joscelyn typeface')).toBeInTheDocument();
			expect(
				screen.getByText('Letter from Nathaniel Bacon')
			).toBeInTheDocument();
			expect(
				screen.getByText('Commonplace book of William Hill')
			).toBeInTheDocument();
		});

		it('does not render headings for empty difficulty groups', () => {
			const groupsWithEmpty = {
				easy: ['Joscelyn'],
				medium: [],
				hard: ['Hill'],
			};

			render(
				<HandList
					hands={[]}
					handsMetadata={mockHandsMetadata}
					enabledHands={mockEnabledHands}
					onToggle={() => {}}
					showDifficultyGroups={true}
					difficultyGroups={groupsWithEmpty}
					onSelectAll={() => {}}
					onDeselectAll={() => {}}
				/>
			);

			expect(screen.getByText('Difficulty: Easy')).toBeInTheDocument();
			expect(
				screen.queryByText('Difficulty: Medium')
			).not.toBeInTheDocument();
			expect(screen.getByText('Difficulty: Hard')).toBeInTheDocument();
		});

		it('renders groups in correct order (easy, medium, hard)', () => {
			render(
				<HandList
					hands={[]}
					handsMetadata={mockHandsMetadata}
					enabledHands={mockEnabledHands}
					onToggle={() => {}}
					showDifficultyGroups={true}
					difficultyGroups={mockDifficultyGroups}
					onSelectAll={() => {}}
					onDeselectAll={() => {}}
				/>
			);

			const headings = screen.getAllByRole('heading', { level: 3 });
			expect(headings[0]).toHaveTextContent('Difficulty: Easy');
			expect(headings[1]).toHaveTextContent('Difficulty: Medium');
			expect(headings[2]).toHaveTextContent('Difficulty: Hard');
		});

		it('calls onToggle correctly in grouped mode', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			render(
				<HandList
					hands={[]}
					handsMetadata={mockHandsMetadata}
					enabledHands={mockEnabledHands}
					onToggle={handleToggle}
					showDifficultyGroups={true}
					difficultyGroups={mockDifficultyGroups}
					onSelectAll={() => {}}
					onDeselectAll={() => {}}
				/>
			);

			const toggles = screen.getAllByRole('switch');
			await user.click(toggles[0]); // Click Joscelyn (in easy group)

			expect(handleToggle).toHaveBeenCalledWith('Joscelyn');
		});
	});

	describe('Bulk selection controls', () => {
		it('calculates allSelected correctly when all hands in group are selected', () => {
			const difficultyGroups = {
				easy: ['Joscelyn', 'NBacon'],
			};

			const enabledHands = {
				Joscelyn: true,
				NBacon: true,
			};

			render(
				<HandList
					hands={[]}
					handsMetadata={mockHandsMetadata}
					enabledHands={enabledHands}
					onToggle={() => {}}
					showDifficultyGroups={true}
					difficultyGroups={difficultyGroups}
					onSelectAll={() => {}}
					onDeselectAll={() => {}}
				/>
			);

			// "select all" button should be disabled
			const selectAllButton = screen.getByRole('button', {
				name: 'select all',
			});
			expect(selectAllButton).toBeDisabled();
		});

		it('calculates noneSelected correctly when no hands in group are selected', () => {
			const difficultyGroups = {
				medium: ['NBacon', 'Hill'],
			};

			const enabledHands = {
				NBacon: false,
				Hill: false,
			};

			render(
				<HandList
					hands={[]}
					handsMetadata={mockHandsMetadata}
					enabledHands={enabledHands}
					onToggle={() => {}}
					showDifficultyGroups={true}
					difficultyGroups={difficultyGroups}
					onSelectAll={() => {}}
					onDeselectAll={() => {}}
				/>
			);

			// "deselect all" button should be disabled
			const deselectAllButton = screen.getByRole('button', {
				name: 'deselect all',
			});
			expect(deselectAllButton).toBeDisabled();
		});

		it('enables both links when some but not all hands are selected', () => {
			const difficultyGroups = {
				hard: ['Joscelyn', 'NBacon', 'Hill'],
			};

			const enabledHands = {
				Joscelyn: true,
				NBacon: false,
				Hill: true,
			};

			render(
				<HandList
					hands={[]}
					handsMetadata={mockHandsMetadata}
					enabledHands={enabledHands}
					onToggle={() => {}}
					showDifficultyGroups={true}
					difficultyGroups={difficultyGroups}
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

		it('calls onSelectAll with correct difficulty when select all is clicked', async () => {
			const handleSelectAll = vi.fn();
			const user = userEvent.setup();

			const difficultyGroups = {
				easy: ['Joscelyn'],
			};

			render(
				<HandList
					hands={[]}
					handsMetadata={mockHandsMetadata}
					enabledHands={{ Joscelyn: false }}
					onToggle={() => {}}
					showDifficultyGroups={true}
					difficultyGroups={difficultyGroups}
					onSelectAll={handleSelectAll}
					onDeselectAll={() => {}}
				/>
			);

			const selectAllLink = screen.getByText('select all');
			await user.click(selectAllLink);

			expect(handleSelectAll).toHaveBeenCalledWith('easy');
		});

		it('calls onDeselectAll with correct difficulty when deselect all is clicked', async () => {
			const handleDeselectAll = vi.fn();
			const user = userEvent.setup();

			const difficultyGroups = {
				medium: ['NBacon'],
			};

			render(
				<HandList
					hands={[]}
					handsMetadata={mockHandsMetadata}
					enabledHands={{ NBacon: true }}
					onToggle={() => {}}
					showDifficultyGroups={true}
					difficultyGroups={difficultyGroups}
					onSelectAll={() => {}}
					onDeselectAll={handleDeselectAll}
				/>
			);

			const deselectAllLink = screen.getByText('deselect all');
			await user.click(deselectAllLink);

			expect(handleDeselectAll).toHaveBeenCalledWith('medium');
		});

		it('handles multiple difficulty groups with different selection states', () => {
			const difficultyGroups = {
				easy: ['Joscelyn'],
				medium: ['NBacon'],
				hard: ['Hill'],
			};

			const enabledHands = {
				Joscelyn: true,
				NBacon: false,
				Hill: true,
			};

			render(
				<HandList
					hands={[]}
					handsMetadata={mockHandsMetadata}
					enabledHands={enabledHands}
					onToggle={() => {}}
					showDifficultyGroups={true}
					difficultyGroups={difficultyGroups}
					onSelectAll={() => {}}
					onDeselectAll={() => {}}
				/>
			);

			const selectAllButtons = screen.getAllByRole('button', {
				name: 'select all',
			});
			const deselectAllButtons = screen.getAllByRole('button', {
				name: 'deselect all',
			});

			// Easy: all selected (Joscelyn: true)
			expect(selectAllButtons[0]).toBeDisabled();
			expect(deselectAllButtons[0]).not.toBeDisabled();

			// Medium: none selected (NBacon: false)
			expect(selectAllButtons[1]).not.toBeDisabled();
			expect(deselectAllButtons[1]).toBeDisabled();

			// Hard: all selected (Hill: true)
			expect(selectAllButtons[2]).toBeDisabled();
			expect(deselectAllButtons[2]).not.toBeDisabled();
		});
	});

	describe('Edge cases', () => {
		it('renders empty list', () => {
			const { container } = render(
				<HandList
					hands={[]}
					handsMetadata={{}}
					enabledHands={{}}
					onToggle={() => {}}
				/>
			);

			expect(screen.queryAllByRole('switch')).toHaveLength(0);
		});

		it('handles missing enabled state (defaults to false)', () => {
			render(
				<HandList
					hands={['Joscelyn']}
					handsMetadata={mockHandsMetadata}
					enabledHands={{}}
					onToggle={() => {}}
				/>
			);

			const toggle = screen.getByRole('switch');
			expect(toggle).toHaveAttribute('aria-checked', 'false');
		});
	});
});
