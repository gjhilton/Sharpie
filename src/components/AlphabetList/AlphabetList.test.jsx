import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlphabetList from './AlphabetList';

describe('AlphabetList', () => {
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
		Hill: {
			title: 'Commonplace book of William Hill',
			date: '1574/5',
			sourceUri: 'https://example.com/hill',
			difficulty: 'hard',
		},
	};

	const mockEnabledAlphabets = {
		Joscelyn: true,
		NBacon: false,
		Hill: true,
	};

	describe('Flat list mode', () => {
		it('renders all alphabets in flat list', () => {
			render(
				<AlphabetList
					alphabets={['Joscelyn', 'NBacon', 'Hill']}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={mockEnabledAlphabets}
					onToggle={() => {}}
				/>
			);

			expect(screen.getByText('Joscelyn typeface')).toBeInTheDocument();
			expect(screen.getByText('Letter from Nathaniel Bacon')).toBeInTheDocument();
			expect(screen.getByText('Commonplace book of William Hill')).toBeInTheDocument();
		});

		it('does not render difficulty headings in flat mode', () => {
			render(
				<AlphabetList
					alphabets={['Joscelyn', 'NBacon', 'Hill']}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={mockEnabledAlphabets}
					onToggle={() => {}}
					showDifficultyGroups={false}
				/>
			);

			expect(screen.queryByText('Difficulty: Easy')).not.toBeInTheDocument();
			expect(screen.queryByText('Difficulty: Medium')).not.toBeInTheDocument();
			expect(screen.queryByText('Difficulty: Hard')).not.toBeInTheDocument();
		});

		it('displays correct toggle states', () => {
			render(
				<AlphabetList
					alphabets={['Joscelyn', 'NBacon']}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={mockEnabledAlphabets}
					onToggle={() => {}}
				/>
			);

			const toggles = screen.getAllByRole('switch');
			expect(toggles[0]).toHaveAttribute('aria-checked', 'true'); // Joscelyn
			expect(toggles[1]).toHaveAttribute('aria-checked', 'false'); // NBacon
		});

		it('calls onToggle with correct alphabet name', async () => {
			const handleToggle = vi.fn();
			const user = userEvent.setup();

			render(
				<AlphabetList
					alphabets={['Joscelyn', 'NBacon']}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={mockEnabledAlphabets}
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
				<AlphabetList
					alphabets={[]}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={mockEnabledAlphabets}
					onToggle={() => {}}
					showDifficultyGroups={true}
					difficultyGroups={mockDifficultyGroups}
				/>
			);

			expect(screen.getByText('Difficulty: Easy')).toBeInTheDocument();
			expect(screen.getByText('Difficulty: Medium')).toBeInTheDocument();
			expect(screen.getByText('Difficulty: Hard')).toBeInTheDocument();
		});

		it('renders alphabets under correct difficulty headings', () => {
			const { container } = render(
				<AlphabetList
					alphabets={[]}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={mockEnabledAlphabets}
					onToggle={() => {}}
					showDifficultyGroups={true}
					difficultyGroups={mockDifficultyGroups}
				/>
			);

			const easyHeading = screen.getByText('Difficulty: Easy');
			const mediumHeading = screen.getByText('Difficulty: Medium');
			const hardHeading = screen.getByText('Difficulty: Hard');

			// Check headings are h3 elements
			expect(easyHeading.tagName).toBe('H3');
			expect(mediumHeading.tagName).toBe('H3');
			expect(hardHeading.tagName).toBe('H3');

			// Check alphabets are present
			expect(screen.getByText('Joscelyn typeface')).toBeInTheDocument();
			expect(screen.getByText('Letter from Nathaniel Bacon')).toBeInTheDocument();
			expect(screen.getByText('Commonplace book of William Hill')).toBeInTheDocument();
		});

		it('does not render headings for empty difficulty groups', () => {
			const groupsWithEmpty = {
				easy: ['Joscelyn'],
				medium: [],
				hard: ['Hill'],
			};

			render(
				<AlphabetList
					alphabets={[]}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={mockEnabledAlphabets}
					onToggle={() => {}}
					showDifficultyGroups={true}
					difficultyGroups={groupsWithEmpty}
				/>
			);

			expect(screen.getByText('Difficulty: Easy')).toBeInTheDocument();
			expect(screen.queryByText('Difficulty: Medium')).not.toBeInTheDocument();
			expect(screen.getByText('Difficulty: Hard')).toBeInTheDocument();
		});

		it('renders groups in correct order (easy, medium, hard)', () => {
			render(
				<AlphabetList
					alphabets={[]}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={mockEnabledAlphabets}
					onToggle={() => {}}
					showDifficultyGroups={true}
					difficultyGroups={mockDifficultyGroups}
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
				<AlphabetList
					alphabets={[]}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={mockEnabledAlphabets}
					onToggle={handleToggle}
					showDifficultyGroups={true}
					difficultyGroups={mockDifficultyGroups}
				/>
			);

			const toggles = screen.getAllByRole('switch');
			await user.click(toggles[0]); // Click Joscelyn (in easy group)

			expect(handleToggle).toHaveBeenCalledWith('Joscelyn');
		});
	});

	describe('Edge cases', () => {
		it('renders empty list', () => {
			const { container } = render(
				<AlphabetList
					alphabets={[]}
					alphabetsMetadata={{}}
					enabledAlphabets={{}}
					onToggle={() => {}}
				/>
			);

			expect(screen.queryAllByRole('switch')).toHaveLength(0);
		});

		it('handles missing enabled state (defaults to false)', () => {
			render(
				<AlphabetList
					alphabets={['Joscelyn']}
					alphabetsMetadata={mockAlphabetsMetadata}
					enabledAlphabets={{}}
					onToggle={() => {}}
				/>
			);

			const toggle = screen.getByRole('switch');
			expect(toggle).toHaveAttribute('aria-checked', 'false');
		});
	});
});
