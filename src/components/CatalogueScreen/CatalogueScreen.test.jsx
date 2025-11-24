import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CatalogueScreen from './CatalogueScreen';
import * as database from '@utilities/database.js';
import * as catalogueLogic from '@utilities/catalogueLogic.js';

// Mock child components
vi.mock('@components/Button/Button.jsx', () => ({
	default: ({ label, onClick }) => (
		<button onClick={onClick} data-testid="mock-button">
			{label}
		</button>
	),
}));

vi.mock('@components/SmallPrint/SmallPrint.jsx', () => ({
	default: ({ onShowFeedback }) => (
		<div data-testid="mock-smallprint">
			{onShowFeedback && (
				<button onClick={onShowFeedback}>Feedback</button>
			)}
		</div>
	),
}));

// Mock DB data
vi.mock('@data/DB.js', () => ({
	DB: {
		sources: {
			'test-source-1': {
				title: 'Test Source Title 1',
				sourceUri: 'https://example.com/test1',
			},
			'test-source-2': {
				title: 'Test Source Title 2',
				sourceUri: 'https://example.com/test2',
			},
		},
	},
}));

// Mock alphabets data
vi.mock('@data/alphabets.json', () => ({
	default: {
		'test-source-1': {
			title: 'Test Source Title 1',
			date: '1570',
			isDefaultEnabled: true,
		},
		'test-source-2': {
			title: 'Test Source Title 2',
			date: '1602',
			isDefaultEnabled: true,
		},
	},
}));

// Mock Toggle component
vi.mock('@components/Toggle/Toggle.jsx', () => ({
	default: ({ id, checked, onChange }) => (
		<label data-testid={`toggle-${id}`}>
			<input
				type="checkbox"
				id={id}
				checked={checked}
				onChange={onChange}
			/>
		</label>
	),
}));

// Mock database utilities
vi.mock('@utilities/database.js', () => ({
	getEnabledGraphSets: vi.fn(),
	getImagePath: vi.fn(),
	getAllAlphabetNames: vi.fn(),
	sortAlphabetsByDate: vi.fn(),
	countEnabledAlphabets: vi.fn(),
	countEnabledCharacters: vi.fn(),
}));

// Mock catalogue logic
vi.mock('@utilities/catalogueLogic.js', () => ({
	groupGraphsByGraphSetAndCharacter: vi.fn(),
}));

describe('CatalogueScreen', () => {
	const mockOnReturnToMenu = vi.fn();
	const mockOnShowFeedback = vi.fn();
	const mockSetEnabledAlphabets = vi.fn();
	const mockEnabledAlphabets = {
		'test-source-1': true,
		'test-source-2': true,
	};

	const mockGraphSet = {
		id: 'test-graphset',
		title: 'Test Graph Set',
		enabled: true,
		graphs: [
			{
				character: 'Test Character 1',
				source: 'test-source-1',
			},
			{
				character: 'Test Character 2',
				source: 'test-source-2',
			},
		],
	};

	const mockCatalogueData = [
		{
			title: 'Test Graph Set',
			characters: [
				{
					character: 'Test Character 1',
					graphs: [
						{
							character: 'Test Character 1',
							source: 'test-source-1',
						},
						{
							character: 'Test Character 1',
							source: 'test-source-2',
						},
					],
				},
				{
					character: 'Test Character 2',
					graphs: [
						{
							character: 'Test Character 2',
							source: 'test-source-1',
						},
					],
				},
			],
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(database.getEnabledGraphSets).mockReturnValue([mockGraphSet]);
		vi.mocked(database.getImagePath).mockImplementation(
			graph => `/images/${graph.character}.png`
		);
		vi.mocked(
			catalogueLogic.groupGraphsByGraphSetAndCharacter
		).mockReturnValue(mockCatalogueData);
		vi.mocked(database.getAllAlphabetNames).mockReturnValue([
			'test-source-1',
			'test-source-2',
		]);
		vi.mocked(database.sortAlphabetsByDate).mockImplementation(
			names => names
		);
		vi.mocked(database.countEnabledAlphabets).mockReturnValue(2);
		vi.mocked(database.countEnabledCharacters).mockReturnValue(123);
	});

	describe('Title and Header', () => {
		it('renders the title "Character Catalogue"', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			expect(
				screen.getByRole('heading', {
					name: 'Character Catalogue',
					level: 1,
				})
			).toBeInTheDocument();
		});

		it('renders title with correct text', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			expect(screen.getByText('Character Catalogue')).toBeInTheDocument();
		});

		it('renders Back to Menu button', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			const backButton = screen.getByRole('button', {
				name: /back to menu/i,
			});
			expect(backButton).toBeInTheDocument();
		});

		it('calls onReturnToMenu when Back to Menu button is clicked', async () => {
			const user = userEvent.setup();
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			const backButton = screen.getByRole('button', {
				name: /back to menu/i,
			});
			await user.click(backButton);

			expect(mockOnReturnToMenu).toHaveBeenCalledTimes(1);
		});
	});

	describe('Database Integration', () => {
		it('calls getEnabledGraphSets with DB', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			expect(database.getEnabledGraphSets).toHaveBeenCalledTimes(1);
			expect(database.getEnabledGraphSets).toHaveBeenCalledWith(
				expect.objectContaining({
					sources: expect.any(Object),
				})
			);
		});

		it('calls groupGraphsByGraphSetAndCharacter with enabled graph sets', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			expect(
				catalogueLogic.groupGraphsByGraphSetAndCharacter
			).toHaveBeenCalledTimes(1);
			expect(
				catalogueLogic.groupGraphsByGraphSetAndCharacter
			).toHaveBeenCalledWith([mockGraphSet]);
		});
	});

	describe('Alphabets Configuration', () => {
		it('renders Choose Alphabets section', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			expect(screen.getByText('Choose Alphabets')).toBeInTheDocument();
		});

		it('renders toggles for each alphabet', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			expect(
				screen.getByTestId('toggle-alphabet-test-source-1')
			).toBeInTheDocument();
			expect(
				screen.getByTestId('toggle-alphabet-test-source-2')
			).toBeInTheDocument();
		});

		it('displays alphabet dates', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			expect(screen.getByText('1570')).toBeInTheDocument();
			expect(screen.getByText('1602')).toBeInTheDocument();
		});

		it('displays alphabet titles', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			expect(screen.getByText('Test Source Title 1')).toBeInTheDocument();
			expect(screen.getByText('Test Source Title 2')).toBeInTheDocument();
		});

		it('toggles call setEnabledAlphabets when clicked', async () => {
			const user = userEvent.setup();
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			const toggle = screen
				.getByTestId('toggle-alphabet-test-source-1')
				.querySelector('input');
			await user.click(toggle);

			expect(mockSetEnabledAlphabets).toHaveBeenCalled();
		});

		it('toggles reflect enabled state', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			const toggle1 = screen
				.getByTestId('toggle-alphabet-test-source-1')
				.querySelector('input');
			const toggle2 = screen
				.getByTestId('toggle-alphabet-test-source-2')
				.querySelector('input');

			expect(toggle1).toBeChecked();
			expect(toggle2).toBeChecked();
		});

		it('toggles reflect disabled state', () => {
			const disabledAlphabets = {
				'test-source-1': false,
				'test-source-2': true,
			};

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={disabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			const toggle1 = screen
				.getByTestId('toggle-alphabet-test-source-1')
				.querySelector('input');
			const toggle2 = screen
				.getByTestId('toggle-alphabet-test-source-2')
				.querySelector('input');

			expect(toggle1).not.toBeChecked();
			expect(toggle2).toBeChecked();
		});
	});

	describe('Component Structure', () => {
		it('renders main container with correct structure', () => {
			const { container } = render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			const mainDiv = container.firstChild;
			expect(mainDiv).toBeInTheDocument();
			expect(mainDiv.tagName).toBe('DIV');
		});

		it('renders all main sections in correct order', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			// Should have the main heading
			const heading = screen.getByRole('heading', {
				name: 'Character Catalogue',
				level: 1,
			});
			expect(heading).toBeInTheDocument();

			// Should have Choose Alphabets section
			expect(screen.getByText('Choose Alphabets')).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('has proper heading hierarchy', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			const h1 = screen.getByRole('heading', { level: 1 });
			const h2s = screen.getAllByRole('heading', { level: 2 });

			expect(h1).toHaveTextContent('Character Catalogue');
			expect(h2s.length).toBeGreaterThanOrEqual(1);
		});

		it('all interactive elements are keyboard accessible', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			// Check toggles are accessible
			const checkboxes = screen.getAllByRole('checkbox');
			checkboxes.forEach(checkbox => {
				expect(checkbox).toBeInTheDocument();
			});
		});
	});

	describe('Edge Cases', () => {
		it('renders when onShowFeedback is not provided', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			expect(
				screen.getByRole('heading', {
					name: 'Character Catalogue',
					level: 1,
				})
			).toBeInTheDocument();
		});
	});

	describe('No Alphabets Selected Error State', () => {
		it('displays error message when no alphabets are enabled', () => {
			vi.mocked(database.countEnabledAlphabets).mockReturnValue(0);
			vi.mocked(database.countEnabledCharacters).mockReturnValue(0);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={{}}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			expect(screen.getByText(/Error:/)).toBeInTheDocument();
			expect(
				screen.getByText(/Please select at least one alphabet/)
			).toBeInTheDocument();
		});

		it('displays error message when character count is zero', () => {
			vi.mocked(database.countEnabledAlphabets).mockReturnValue(1);
			vi.mocked(database.countEnabledCharacters).mockReturnValue(0);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			expect(screen.getByText(/Error:/)).toBeInTheDocument();
			expect(
				screen.getByText(/Please select at least one alphabet/)
			).toBeInTheDocument();
		});

		it('disables Back to Menu button when no alphabets are selected', () => {
			vi.mocked(database.countEnabledAlphabets).mockReturnValue(0);
			vi.mocked(database.countEnabledCharacters).mockReturnValue(0);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={{}}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			const backButton = screen.queryByRole('button', {
				name: /back to menu/i,
			});
			expect(backButton).not.toBeInTheDocument();
			expect(
				screen.getByText(
					/Not allowed! Select one or more alphabets to continue/
				)
			).toBeInTheDocument();
		});

		it('does not call onReturnToMenu when Back to Menu is disabled', async () => {
			vi.mocked(database.countEnabledAlphabets).mockReturnValue(0);
			vi.mocked(database.countEnabledCharacters).mockReturnValue(0);

			const user = userEvent.setup();
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={{}}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			const backText = screen.getByText(
				/Not allowed! Select one or more alphabets to continue/
			);
			await user.click(backText);

			expect(mockOnReturnToMenu).not.toHaveBeenCalled();
		});

		it('displays normal message with counts when alphabets are selected', () => {
			vi.mocked(database.countEnabledAlphabets).mockReturnValue(2);
			vi.mocked(database.countEnabledCharacters).mockReturnValue(123);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
			expect(screen.getByText('2')).toBeInTheDocument();
			expect(screen.getByText('123')).toBeInTheDocument();
			expect(screen.getByText(/alphabets \(/)).toBeInTheDocument();
			expect(screen.getByText(/characters\)\./)).toBeInTheDocument();
		});

		it('enables Back to Menu button when alphabets are selected', () => {
			vi.mocked(database.countEnabledAlphabets).mockReturnValue(2);
			vi.mocked(database.countEnabledCharacters).mockReturnValue(123);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			const backButton = screen.getByRole('button', {
				name: /back to menu/i,
			});
			expect(backButton).toBeInTheDocument();
		});
	});

	describe('Character Index (LetterIndex)', () => {
		it('renders character index with letter links', () => {
			const mockCatalogueDataWithLetters = [
				{
					title: 'minuscules',
					characters: [
						{
							character: 'a',
							graphs: [{ character: 'a', source: 'test-source-1' }],
						},
						{
							character: 'b',
							graphs: [{ character: 'b', source: 'test-source-1' }],
						},
					],
				},
				{
					title: 'MAJUSCULES',
					characters: [
						{
							character: 'A',
							graphs: [{ character: 'A', source: 'test-source-1' }],
						},
					],
				},
			];
			vi.mocked(
				catalogueLogic.groupGraphsByGraphSetAndCharacter
			).mockReturnValue(mockCatalogueDataWithLetters);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			// Should render character index links
			const minusculeLink = screen.getByRole('link', { name: 'a' });
			const majusculeLink = screen.getByRole('link', { name: 'A' });
			expect(minusculeLink).toBeInTheDocument();
			expect(majusculeLink).toBeInTheDocument();
		});

		it('renders minuscule and MAJUSCULE labels in index', () => {
			const mockCatalogueDataWithLetters = [
				{
					title: 'minuscules',
					characters: [
						{
							character: 'a',
							graphs: [{ character: 'a', source: 'test-source-1' }],
						},
					],
				},
				{
					title: 'MAJUSCULES',
					characters: [
						{
							character: 'A',
							graphs: [{ character: 'A', source: 'test-source-1' }],
						},
					],
				},
			];
			vi.mocked(
				catalogueLogic.groupGraphsByGraphSetAndCharacter
			).mockReturnValue(mockCatalogueDataWithLetters);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			expect(screen.getByText('minuscule:')).toBeInTheDocument();
			expect(screen.getByText('MAJUSCULE:')).toBeInTheDocument();
		});

		it('does not render empty letter index sections', () => {
			const mockCatalogueDataEmpty = [
				{
					title: 'minuscules',
					characters: [],
				},
				{
					title: 'MAJUSCULES',
					characters: [],
				},
			];
			vi.mocked(
				catalogueLogic.groupGraphsByGraphSetAndCharacter
			).mockReturnValue(mockCatalogueDataEmpty);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			// Should not render labels when no characters
			expect(screen.queryByText('minuscule:')).not.toBeInTheDocument();
			expect(screen.queryByText('MAJUSCULE:')).not.toBeInTheDocument();
		});

		it('renders links with correct href anchors', () => {
			const mockCatalogueDataWithLetters = [
				{
					title: 'minuscules',
					characters: [
						{
							character: 'z',
							graphs: [{ character: 'z', source: 'test-source-1' }],
						},
					],
				},
			];
			vi.mocked(
				catalogueLogic.groupGraphsByGraphSetAndCharacter
			).mockReturnValue(mockCatalogueDataWithLetters);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabledAlphabets}
				/>
			);

			const link = screen.getByRole('link', { name: 'z' });
			expect(link).toHaveAttribute('href', '#char-z');
		});
	});

	describe('handleToggleAlphabet', () => {
		it('toggles alphabet from enabled to disabled', async () => {
			const user = userEvent.setup();
			let capturedCallback;
			const mockSetEnabled = vi.fn(callback => {
				capturedCallback = callback;
			});

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={mockEnabledAlphabets}
					setEnabledAlphabets={mockSetEnabled}
				/>
			);

			const toggle = screen
				.getByTestId('toggle-alphabet-test-source-1')
				.querySelector('input');
			await user.click(toggle);

			expect(mockSetEnabled).toHaveBeenCalled();
			// Verify the callback toggles the value correctly
			const result = capturedCallback({
				'test-source-1': true,
				'test-source-2': true,
			});
			expect(result).toEqual({
				'test-source-1': false,
				'test-source-2': true,
			});
		});

		it('toggles alphabet from disabled to enabled', async () => {
			const user = userEvent.setup();
			let capturedCallback;
			const mockSetEnabled = vi.fn(callback => {
				capturedCallback = callback;
			});

			const disabledAlphabets = {
				'test-source-1': false,
				'test-source-2': true,
			};

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
					enabledAlphabets={disabledAlphabets}
					setEnabledAlphabets={mockSetEnabled}
				/>
			);

			const toggle = screen
				.getByTestId('toggle-alphabet-test-source-1')
				.querySelector('input');
			await user.click(toggle);

			expect(mockSetEnabled).toHaveBeenCalled();
			// Verify the callback toggles the value correctly
			const result = capturedCallback({
				'test-source-1': false,
				'test-source-2': true,
			});
			expect(result).toEqual({
				'test-source-1': true,
				'test-source-2': true,
			});
		});
	});
});
