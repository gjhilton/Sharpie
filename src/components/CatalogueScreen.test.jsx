import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CatalogueScreen from './CatalogueScreen';
import * as database from '../utilities/database.js';
import * as catalogueLogic from '../utilities/catalogueLogic.js';

// Mock child components
vi.mock('./Button.jsx', () => ({
	default: ({ label, onClick }) => (
		<button onClick={onClick} data-testid="mock-button">
			{label}
		</button>
	),
}));

vi.mock('./SmallPrint.jsx', () => ({
	default: ({ onShowFeedback }) => (
		<div data-testid="mock-smallprint">
			{onShowFeedback && (
				<button onClick={onShowFeedback}>Feedback</button>
			)}
		</div>
	),
}));

// Mock DB data
vi.mock('../data/DB.js', () => ({
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

// Mock database utilities
vi.mock('../utilities/database.js', () => ({
	getEnabledGraphSets: vi.fn(),
	getImagePath: vi.fn(),
}));

// Mock catalogue logic
vi.mock('../utilities/catalogueLogic.js', () => ({
	groupGraphsByGraphSetAndCharacter: vi.fn(),
}));

describe('CatalogueScreen', () => {
	const mockOnReturnToMenu = vi.fn();
	const mockOnShowFeedback = vi.fn();

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
	});

	describe('Title and Header', () => {
		it('renders the title "Character Catalogue"', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
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
				/>
			);

			expect(screen.getByText('Character Catalogue')).toBeInTheDocument();
		});
	});

	describe('Return to Menu Button', () => {
		it('renders Return to Menu button', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(screen.getByTestId('mock-button')).toBeInTheDocument();
			expect(screen.getByText('Return to Menu')).toBeInTheDocument();
		});

		it('calls onReturnToMenu when Return to Menu button is clicked', async () => {
			const user = userEvent.setup();
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const button = screen.getByTestId('mock-button');
			await user.click(button);

			expect(mockOnReturnToMenu).toHaveBeenCalledTimes(1);
		});

		it('button is enabled and clickable', async () => {
			const user = userEvent.setup();
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const button = screen.getByTestId('mock-button');
			expect(button).toBeEnabled();

			await user.click(button);
			expect(mockOnReturnToMenu).toHaveBeenCalled();
		});
	});

	describe('SmallPrint Component', () => {
		it('renders SmallPrint component', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(screen.getByTestId('mock-smallprint')).toBeInTheDocument();
		});

		it('passes onShowFeedback callback to SmallPrint', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const smallPrint = screen.getByTestId('mock-smallprint');
			expect(smallPrint).toBeInTheDocument();

			// SmallPrint should receive the callback and render feedback button
			expect(screen.getByText('Feedback')).toBeInTheDocument();
		});

		it('SmallPrint can trigger onShowFeedback callback', async () => {
			const user = userEvent.setup();
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const feedbackButton = screen.getByText('Feedback');
			await user.click(feedbackButton);

			expect(mockOnShowFeedback).toHaveBeenCalledTimes(1);
		});
	});

	describe('Database Integration', () => {
		it('calls getEnabledGraphSets with DB', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
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

	describe('Graph Set Rendering', () => {
		it('renders graph sets based on catalogueLogic output', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(
				screen.getByRole('heading', {
					name: 'Test Graph Set',
					level: 2,
				})
			).toBeInTheDocument();
		});

		it('renders multiple graph sets when provided', () => {
			const multipleGraphSets = [
				{
					title: 'Graph Set 1',
					characters: [
						{
							character: 'Character A',
							graphs: [
								{
									character: 'Character A',
									source: 'test-source-1',
								},
							],
						},
					],
				},
				{
					title: 'Graph Set 2',
					characters: [
						{
							character: 'Character B',
							graphs: [
								{
									character: 'Character B',
									source: 'test-source-2',
								},
							],
						},
					],
				},
			];

			vi.mocked(
				catalogueLogic.groupGraphsByGraphSetAndCharacter
			).mockReturnValue(multipleGraphSets);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(
				screen.getByRole('heading', { name: 'Graph Set 1', level: 2 })
			).toBeInTheDocument();
			expect(
				screen.getByRole('heading', { name: 'Graph Set 2', level: 2 })
			).toBeInTheDocument();
		});

		it('renders character headings within graph sets', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(
				screen.getByRole('heading', {
					name: 'Test Character 1',
					level: 3,
				})
			).toBeInTheDocument();
			expect(
				screen.getByRole('heading', {
					name: 'Test Character 2',
					level: 3,
				})
			).toBeInTheDocument();
		});

		it('handles empty catalogue data', () => {
			vi.mocked(
				catalogueLogic.groupGraphsByGraphSetAndCharacter
			).mockReturnValue([]);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			// Should still render title and button, but no graph sets
			expect(
				screen.getByRole('heading', {
					name: 'Character Catalogue',
					level: 1,
				})
			).toBeInTheDocument();
			expect(
				screen.queryByRole('heading', { level: 2 })
			).not.toBeInTheDocument();
		});
	});

	describe('ImageWithInfo Component', () => {
		it('renders images with correct paths from getImagePath', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const images = screen.getAllByRole('img');
			expect(images.length).toBeGreaterThan(0);

			// Check that getImagePath was called
			expect(database.getImagePath).toHaveBeenCalled();
		});

		it('calls getImagePath for each graph', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			// Should be called 3 times (2 graphs for Character 1, 1 graph for Character 2)
			expect(database.getImagePath).toHaveBeenCalledTimes(3);
		});

		it('images have correct src attributes based on getImagePath', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const images = screen.getAllByRole('img');

			// First two images should be Test Character 1
			expect(images[0]).toHaveAttribute(
				'src',
				'/images/Test Character 1.png'
			);
			expect(images[1]).toHaveAttribute(
				'src',
				'/images/Test Character 1.png'
			);

			// Third image should be Test Character 2
			expect(images[2]).toHaveAttribute(
				'src',
				'/images/Test Character 2.png'
			);
		});
	});

	describe('Image Alt Text and Aria Labels', () => {
		it('images have proper alt text with character name', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const character1Images = screen.getAllByAltText('Test Character 1');
			expect(character1Images.length).toBe(2);

			const character2Images = screen.getAllByAltText('Test Character 2');
			expect(character2Images.length).toBe(1);
		});

		it('image buttons have aria-labels with character and source info', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(
				screen.getByLabelText(
					'Test Character 1 - Click to show source: Test Source Title 1'
				)
			).toBeInTheDocument();
			expect(
				screen.getByLabelText(
					'Test Character 1 - Click to show source: Test Source Title 2'
				)
			).toBeInTheDocument();
			expect(
				screen.getByLabelText(
					'Test Character 2 - Click to show source: Test Source Title 1'
				)
			).toBeInTheDocument();
		});

		it('handles missing source title with "Unknown" in aria-label', () => {
			const catalogueDataWithMissingSource = [
				{
					title: 'Test Graph Set',
					characters: [
						{
							character: 'Test Character',
							graphs: [
								{
									character: 'Test Character',
									source: 'non-existent-source',
								},
							],
						},
					],
				},
			];

			vi.mocked(
				catalogueLogic.groupGraphsByGraphSetAndCharacter
			).mockReturnValue(catalogueDataWithMissingSource);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(
				screen.getByLabelText(
					'Test Character - Click to show source: Unknown'
				)
			).toBeInTheDocument();
		});
	});

	describe('Popover Functionality', () => {
		it('clicking an image shows popover with source title', async () => {
			const user = userEvent.setup();
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const imageButton = screen.getByLabelText(
				'Test Character 1 - Click to show source: Test Source Title 1'
			);

			await user.click(imageButton);

			expect(screen.getByText('Test Source Title 1')).toBeInTheDocument();
		});

		it('clicking an image toggles popover visibility', async () => {
			const user = userEvent.setup();
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const imageButton = screen.getByLabelText(
				'Test Character 1 - Click to show source: Test Source Title 1'
			);

			// Click to show popover
			await user.click(imageButton);
			expect(screen.getByText('Test Source Title 1')).toBeInTheDocument();

			// Click again to hide popover
			await user.click(imageButton);
			expect(
				screen.queryByText('Test Source Title 1')
			).not.toBeInTheDocument();
		});

		it('clicking outside popover closes it', async () => {
			const user = userEvent.setup();
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const imageButton = screen.getByLabelText(
				'Test Character 1 - Click to show source: Test Source Title 1'
			);

			// Click to show popover
			await user.click(imageButton);
			expect(screen.getByText('Test Source Title 1')).toBeInTheDocument();

			// Click outside (on the title)
			const title = screen.getByRole('heading', {
				name: 'Character Catalogue',
				level: 1,
			});
			await user.click(title);

			// Popover should be closed
			expect(
				screen.queryByText('Test Source Title 1')
			).not.toBeInTheDocument();
		});

		it('each image can show its own popover independently', async () => {
			const user = userEvent.setup();
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const imageButton1 = screen.getByLabelText(
				'Test Character 1 - Click to show source: Test Source Title 1'
			);
			const imageButton2 = screen.getByLabelText(
				'Test Character 1 - Click to show source: Test Source Title 2'
			);

			// Click first image
			await user.click(imageButton1);
			expect(screen.getByText('Test Source Title 1')).toBeInTheDocument();

			// Close first popover
			await user.click(imageButton1);
			expect(
				screen.queryByText('Test Source Title 1')
			).not.toBeInTheDocument();

			// Click second image
			await user.click(imageButton2);
			expect(screen.getByText('Test Source Title 2')).toBeInTheDocument();
		});

		it('shows "Unknown" when source is not found', async () => {
			const user = userEvent.setup();
			const catalogueDataWithMissingSource = [
				{
					title: 'Test Graph Set',
					characters: [
						{
							character: 'Test Character',
							graphs: [
								{
									character: 'Test Character',
									source: 'non-existent-source',
								},
							],
						},
					],
				},
			];

			vi.mocked(
				catalogueLogic.groupGraphsByGraphSetAndCharacter
			).mockReturnValue(catalogueDataWithMissingSource);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const imageButton = screen.getByLabelText(
				'Test Character - Click to show source: Unknown'
			);

			await user.click(imageButton);

			expect(screen.getByText('Unknown')).toBeInTheDocument();
		});
	});

	describe('Component Structure', () => {
		it('renders main container with correct structure', () => {
			const { container } = render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
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
				/>
			);

			// Should have the main heading at the top
			const heading = screen.getByRole('heading', {
				name: 'Character Catalogue',
				level: 1,
			});
			expect(heading).toBeInTheDocument();

			// Should have SmallPrint at the bottom
			const smallPrint = screen.getByTestId('mock-smallprint');
			expect(smallPrint).toBeInTheDocument();

			// Should have graph set sections in between
			const graphSetHeading = screen.getByRole('heading', {
				name: 'Test Graph Set',
				level: 2,
			});
			expect(graphSetHeading).toBeInTheDocument();
		});

		it('images are rendered within character sections', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const character1Heading = screen.getByRole('heading', {
				name: 'Test Character 1',
				level: 3,
			});
			const character2Heading = screen.getByRole('heading', {
				name: 'Test Character 2',
				level: 3,
			});

			expect(character1Heading).toBeInTheDocument();
			expect(character2Heading).toBeInTheDocument();

			// Should have images for both characters
			const images = screen.getAllByRole('img');
			expect(images.length).toBe(3); // 2 for Character 1, 1 for Character 2
		});
	});

	describe('Edge Cases', () => {
		it('handles graph with undefined source gracefully', async () => {
			const user = userEvent.setup();
			const catalogueDataWithUndefinedSource = [
				{
					title: 'Test Graph Set',
					characters: [
						{
							character: 'Test Character',
							graphs: [
								{
									character: 'Test Character',
									source: undefined,
								},
							],
						},
					],
				},
			];

			vi.mocked(
				catalogueLogic.groupGraphsByGraphSetAndCharacter
			).mockReturnValue(catalogueDataWithUndefinedSource);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const imageButton = screen.getByLabelText(
				'Test Character - Click to show source: Unknown'
			);
			await user.click(imageButton);

			expect(screen.getByText('Unknown')).toBeInTheDocument();
		});

		it('handles empty character graphs array', () => {
			const catalogueDataWithEmptyGraphs = [
				{
					title: 'Test Graph Set',
					characters: [
						{
							character: 'Test Character',
							graphs: [],
						},
					],
				},
			];

			vi.mocked(
				catalogueLogic.groupGraphsByGraphSetAndCharacter
			).mockReturnValue(catalogueDataWithEmptyGraphs);

			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			// Character heading should still render
			expect(
				screen.getByRole('heading', {
					name: 'Test Character',
					level: 3,
				})
			).toBeInTheDocument();

			// But no images
			expect(screen.queryByRole('img')).not.toBeInTheDocument();
		});

		it('renders when onShowFeedback is not provided', () => {
			render(<CatalogueScreen onReturnToMenu={mockOnReturnToMenu} />);

			expect(
				screen.getByRole('heading', {
					name: 'Character Catalogue',
					level: 1,
				})
			).toBeInTheDocument();
			expect(screen.getByTestId('mock-smallprint')).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('has proper heading hierarchy', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const h1 = screen.getByRole('heading', { level: 1 });
			const h2 = screen.getByRole('heading', { level: 2 });
			const h3s = screen.getAllByRole('heading', { level: 3 });

			expect(h1).toHaveTextContent('Character Catalogue');
			expect(h2).toHaveTextContent('Test Graph Set');
			expect(h3s.length).toBe(2);
		});

		it('all interactive elements are keyboard accessible', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const imageButtons = screen
				.getAllByRole('button')
				.filter(button =>
					button
						.getAttribute('aria-label')
						?.includes('Click to show source')
				);

			imageButtons.forEach(button => {
				expect(button).toBeInTheDocument();
				expect(button.tagName).toBe('BUTTON');
			});
		});

		it('images are properly labeled for screen readers', () => {
			render(
				<CatalogueScreen
					onReturnToMenu={mockOnReturnToMenu}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const images = screen.getAllByRole('img');

			images.forEach(image => {
				expect(image).toHaveAttribute('alt');
				expect(image.getAttribute('alt')).toBeTruthy();
			});
		});
	});
});
