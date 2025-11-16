import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingScreen from './LandingScreen';
import { GAME_MODES } from '@constants/stages.js';

// Mock all child components
vi.mock('@components/Button/Button.jsx', () => ({
	default: ({ label, onClick, hero }) => (
		<button onClick={onClick} data-hero={hero}>
			{label}
		</button>
	),
}));

vi.mock('@components/Logo/Logo.jsx', () => ({
	default: ({ size }) => (
		<div data-testid="logo" data-size={size}>
			Logo
		</div>
	),
	SIZE: { S: 'small', M: 'medium', L: 'large' },
}));

vi.mock('@components/SmallPrint/SmallPrint.jsx', () => ({
	default: ({ onShowFeedback }) => (
		<footer data-testid="small-print">
			{onShowFeedback && (
				<button onClick={onShowFeedback}>Report a problem</button>
			)}
		</footer>
	),
}));

vi.mock('@components/Layout/Layout.jsx', () => ({
	PageWidth: ({ children }) => <div data-testid="page-width">{children}</div>,
	PageTitle: ({ children }) => <h1 data-testid="page-title">{children}</h1>,
	Heading: ({ children }) => <h2 data-testid="heading">{children}</h2>,
	Paragraph: ({ children, className }) => (
		<p className={className}>{children}</p>
	),
	Section: ({ title, children }) => (
		<section data-testid="section">
			{title}
			{children}
		</section>
	),
}));

// Mock sources.json
vi.mock('@data/sources.json', () => ({
	default: {
		'BeauChesne-Baildon': {
			title: 'Test BeauChesne Title',
			sourceUri: 'https://example.com/beauchesne',
		},
	},
}));

// Mock markdown imports for section components
vi.mock('@data/hero.md?raw', () => ({
	default: `Sharpie helps sharpen your eye for recognising letters written in the *secretary hand* used in the sixteenth and seventeenth centuries.`
}));

vi.mock('@data/how-to-use.md?raw', () => ({
	default: `1. You will be shown a character - a *graph*, in palaeography jargon - written in the secretary hand
2. Use your computer keyboard or the onscreen keyboard to enter the graph you see
3. See feedback about your answer: correct or incorrect
4. Hit 'next' to see another graph
5. Exit at any time by clicking the 'End game' button to view a summary of your score, and recap graphs identified wrongly`
}));

vi.mock('@data/options.md?raw', () => ({
	default: `You can practice just *minuscules* (the manuscript equivalent of print "lowercase") or *majuscules* (≈"uppercase")`
}));

vi.mock('@data/alphabet.md?raw', () => ({
	default: `During this era, the alphabet had 24 letters. *I* and *J* were the same letter, as were *U* and *V*: In each case, two graphs - two characters -  could be used to write the same letter.

{{ALPHABET_TOGGLE}}

When this option is enabled, if you are shown a 'J' and answer 'I', that answer will be accepted.`
}));

vi.mock('@data/baselines.md?raw', () => ({
	default: `Show the approximate baseline of the characters (can be useful for distinguishing majuscule from minuscule).

{{BASELINE_TOGGLE}}

When enabled, a baseline appears across each character image. This can help distinguish between majuscule (uppercase) and minuscule (lowercase) forms.

{{BASELINE_EXAMPLES}}

*Example: Joscelyn majuscule S*`
}));

vi.mock('@data/next-steps.md?raw', () => ({
	default: `Many resources are available online to help you read secretary hand:

- [English Handwriting Online 1500-1700](https://www.english.cam.ac.uk/ceres/ehoc/)
- [Beinecke Library](https://beinecke.library.yale.edu/article/quarantine-reading-learn-read-secretary-hand)
- [Scottish Handwriting](https://www.scotlandspeople.gov.uk/scottish-handwriting/tutorials)`
}));

describe('LandingScreen', () => {
	let mockOnSelectMode;
	let mockOnShowCatalogue;
	let mockOnShowFeedback;

	beforeEach(() => {
		mockOnSelectMode = vi.fn();
		mockOnShowCatalogue = vi.fn();
		mockOnShowFeedback = vi.fn();
	});

	describe('Component Structure', () => {
		it('should render within PageWidth layout', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(screen.getByTestId('page-width')).toBeInTheDocument();
		});

		it('should render all four sections', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const sections = screen.getAllByTestId('section');
			expect(sections).toHaveLength(7); // Hero, How to use, Options, Settings, Baselines, Next steps, News
		});
	});

	describe('Logo', () => {
		it('should render Logo with SIZE.S', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const logo = screen.getByTestId('logo');
			expect(logo).toBeInTheDocument();
			expect(logo).toHaveAttribute('data-size', 'small');
		});
	});

	describe('Secretary Hand Image', () => {
		it('should display the secretary hand image', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const image = screen.getByAltText('Secretary Hand');
			expect(image).toBeInTheDocument();
			expect(image).toHaveAttribute('src', 'secretary_hand.gif');
		});

		it('should render image caption with source information from sources.json', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(
				screen.getByText('Test BeauChesne Title')
			).toBeInTheDocument();
		});

		it('should render source link with correct attributes', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const sourceLink = screen.getByRole('link', { name: '[source]' });
			expect(sourceLink).toBeInTheDocument();
			expect(sourceLink).toHaveAttribute(
				'href',
				'https://example.com/beauchesne'
			);
			expect(sourceLink).toHaveAttribute('target', '_blank');
			expect(sourceLink).toHaveAttribute('rel', 'noopener noreferrer');
		});
	});

	describe('Hero Section', () => {
		it('should render hero section with page title', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(screen.getByTestId('page-title')).toBeInTheDocument();
			expect(screen.getByText(/Hone your/i)).toBeInTheDocument();
			expect(screen.getByText('Secretary')).toBeInTheDocument();
		});

		it('should render hero section description', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(
				screen.getByText(
					/Sharpie helps sharpen your eye for recognising letters written in the/i
				)
			).toBeInTheDocument();
		});

		it('should render Start button', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const startButton = screen.getByRole('button', { name: 'Start' });
			expect(startButton).toBeInTheDocument();
			expect(startButton).toHaveAttribute('data-hero', 'true');
		});

		it('should call onSelectMode with GAME_MODES.ALL when Start button is clicked', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const startButton = screen.getByRole('button', { name: 'Start' });
			await user.click(startButton);

			expect(mockOnSelectMode).toHaveBeenCalledTimes(1);
			expect(mockOnSelectMode).toHaveBeenCalledWith(
				GAME_MODES.ALL,
				false
			);
		});
	});

	describe('How to Use Section', () => {
		it('should render "How to use" heading', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(screen.getByText('How to use')).toBeInTheDocument();
		});

		it('should render ordered list with instructions', () => {
			const { container } = render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const orderedList = container.querySelector('ol');
			expect(orderedList).toBeInTheDocument();

			const listItems = orderedList.querySelectorAll('li');
			expect(listItems).toHaveLength(5);
		});

		it('should render all instruction steps', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(
				screen.getByText(/You will be shown a character/i)
			).toBeInTheDocument();
			expect(
				screen.getByText(/Use your computer keyboard/i)
			).toBeInTheDocument();
			expect(
				screen.getByText(/See feedback about your answer/i)
			).toBeInTheDocument();
			expect(
				screen.getByText(/Hit 'next' to see another graph/i)
			).toBeInTheDocument();
			expect(screen.getByText(/Exit at any time/i)).toBeInTheDocument();
		});
	});

	describe('Options Section', () => {
		it('should render "Options" heading', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(screen.getByText('Options')).toBeInTheDocument();
		});

		it('should render options description', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(
				screen.getByText(/You can practice just/i)
			).toBeInTheDocument();
			expect(
				screen.getByText(
					/the manuscript equivalent of print "lowercase"/i
				)
			).toBeInTheDocument();
		});

		it('should render minuscules button', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const minusculesButton = screen.getByRole('button', {
				name: 'minuscules',
			});
			expect(minusculesButton).toBeInTheDocument();
		});

		it('should render MAJUSCULES button', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const majusculesButton = screen.getByRole('button', {
				name: 'MAJUSCULES',
			});
			expect(majusculesButton).toBeInTheDocument();
		});

		it('should call onSelectMode with GAME_MODES.MINUSCULE when minuscules button is clicked', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const minusculesButton = screen.getByRole('button', {
				name: 'minuscules',
			});
			await user.click(minusculesButton);

			expect(mockOnSelectMode).toHaveBeenCalledTimes(1);
			expect(mockOnSelectMode).toHaveBeenCalledWith(
				GAME_MODES.MINUSCULE,
				false
			);
		});

		it('should call onSelectMode with GAME_MODES.MAJUSCULE when MAJUSCULES button is clicked', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const majusculesButton = screen.getByRole('button', {
				name: 'MAJUSCULES',
			});
			await user.click(majusculesButton);

			expect(mockOnSelectMode).toHaveBeenCalledTimes(1);
			expect(mockOnSelectMode).toHaveBeenCalledWith(
				GAME_MODES.MAJUSCULE,
				false
			);
		});

		it('should render "view all characters" link', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const catalogueLink = screen.getByRole('link', {
				name: 'view all characters',
			});
			expect(catalogueLink).toBeInTheDocument();
			expect(catalogueLink).toHaveAttribute('href', '#');
		});

		it('should call onShowCatalogue when "view all characters" link is clicked', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const catalogueLink = screen.getByRole('link', {
				name: 'view all characters',
			});
			await user.click(catalogueLink);

			expect(mockOnShowCatalogue).toHaveBeenCalledTimes(1);
		});

		it('should prevent default behavior when catalogue link is clicked', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const catalogueLink = screen.getByRole('link', {
				name: 'view all characters',
			});
			await user.click(catalogueLink);

			// If default wasn't prevented, browser would navigate
			expect(mockOnShowCatalogue).toHaveBeenCalled();
		});
	});

	describe('Next Steps Section', () => {
		it('should render "Next steps for learners" heading', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(screen.getByText('Next steps for learners')).toBeInTheDocument();
		});

		it('should render next steps description', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(
				screen.getByText(/Many resources are available online/i)
			).toBeInTheDocument();
		});

		it('should render unordered list with external resources', () => {
			const { container } = render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const unorderedList = container.querySelector('ul');
			expect(unorderedList).toBeInTheDocument();

			const listItems = unorderedList.querySelectorAll('li');
			expect(listItems).toHaveLength(3);
		});

		it('should render English Handwriting Online link with correct attributes', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const link = screen.getByRole('link', {
				name: 'English Handwriting Online 1500-1700',
			});
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute(
				'href',
				'https://www.english.cam.ac.uk/ceres/ehoc/'
			);
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		});

		it('should render Beinecke Library link with correct attributes', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const link = screen.getByRole('link', { name: 'Beinecke Library' });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute(
				'href',
				'https://beinecke.library.yale.edu/article/quarantine-reading-learn-read-secretary-hand'
			);
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		});

		it('should render Scottish Handwriting link with correct attributes', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const link = screen.getByRole('link', {
				name: 'Scottish Handwriting',
			});
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute(
				'href',
				'https://www.scotlandspeople.gov.uk/scottish-handwriting/tutorials'
			);
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		});

		it('should have all external links open in new tab with security attributes', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const externalLinks = [
				screen.getByRole('link', {
					name: 'English Handwriting Online 1500-1700',
				}),
				screen.getByRole('link', { name: 'Beinecke Library' }),
				screen.getByRole('link', { name: 'Scottish Handwriting' }),
				screen.getByRole('link', { name: '[source]' }),
			];

			externalLinks.forEach(link => {
				expect(link).toHaveAttribute('target', '_blank');
				expect(link).toHaveAttribute('rel', 'noopener noreferrer');
			});
		});
	});

	describe('SmallPrint Component', () => {
		it('should render SmallPrint component', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(screen.getByTestId('small-print')).toBeInTheDocument();
		});

		it('should pass onShowFeedback callback to SmallPrint', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const reportButton = screen.getByRole('button', {
				name: 'Report a problem',
			});
			expect(reportButton).toBeInTheDocument();
		});

		it('should call onShowFeedback when SmallPrint feedback link is clicked', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const reportButton = screen.getByRole('button', {
				name: 'Report a problem',
			});
			await user.click(reportButton);

			expect(mockOnShowFeedback).toHaveBeenCalledTimes(1);
		});
	});

	describe('Accessibility', () => {
		it('should render semantic header element', () => {
			const { container } = render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const header = container.querySelector('header');
			expect(header).toBeInTheDocument();
		});

		it('should render figure with figcaption for secretary hand image', () => {
			const { container } = render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const figure = container.querySelector('figure');
			expect(figure).toBeInTheDocument();

			const figcaption = container.querySelector('figcaption');
			expect(figcaption).toBeInTheDocument();
		});

		it('should have proper heading hierarchy', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(screen.getByTestId('page-title')).toBeInTheDocument(); // h1
			const headings = screen.getAllByTestId('heading'); // h2s
			expect(headings.length).toBeGreaterThan(0);
		});
	});

	describe('Integration', () => {
		it('should render all interactive elements', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			// 3 mode buttons + 1 report button
			const buttons = screen.getAllByRole('button');
			expect(buttons.length).toBeGreaterThanOrEqual(4);

			// 1 catalogue link + 3 external resource links + 1 source link
			const links = screen.getAllByRole('link');
			expect(links.length).toBeGreaterThanOrEqual(5);
		});

		it('should not call any callbacks on initial render', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			expect(mockOnSelectMode).not.toHaveBeenCalled();
			expect(mockOnShowCatalogue).not.toHaveBeenCalled();
			expect(mockOnShowFeedback).not.toHaveBeenCalled();
		});

		it('should handle multiple button clicks correctly', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
				/>
			);

			const startButton = screen.getByRole('button', { name: 'Start' });
			await user.click(startButton);
			expect(mockOnSelectMode).toHaveBeenCalledWith(
				GAME_MODES.ALL,
				false
			);

			const minusculesButton = screen.getByRole('button', {
				name: 'minuscules',
			});
			await user.click(minusculesButton);
			expect(mockOnSelectMode).toHaveBeenCalledWith(
				GAME_MODES.MINUSCULE,
				false
			);

			const majusculesButton = screen.getByRole('button', {
				name: 'MAJUSCULES',
			});
			await user.click(majusculesButton);
			expect(mockOnSelectMode).toHaveBeenCalledWith(
				GAME_MODES.MAJUSCULE,
				false
			);

			expect(mockOnSelectMode).toHaveBeenCalledTimes(3);
		});
	});
});
