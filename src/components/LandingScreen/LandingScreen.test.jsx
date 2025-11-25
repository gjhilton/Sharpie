import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingScreen from './LandingScreen';
import { GAME_MODES } from '@constants/stages.js';

// Mock child components
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
	Article: ({ children }) => <article>{children}</article>,
}));

vi.mock('@components/SourceFigure/SourceFigure.jsx', () => ({
	default: () => (
		<figure data-testid="source-figure">
			<img alt="Secretary Hand" src="secretary_hand.gif" />
		</figure>
	),
}));

vi.mock('@components/HeroSection/HeroSection.jsx', () => ({
	default: ({ onPlay }) => (
		<section data-testid="hero-section">
			<h1 data-testid="page-title">
				Hone your <span>Secretary</span>
			</h1>
			<button onClick={onPlay} data-hero="true">
				Play
			</button>
		</section>
	),
}));

// Mock the new section components
let mockOptionsProps = null;
vi.mock('@components/OptionsSection/OptionsSection.jsx', () => ({
	default: props => {
		mockOptionsProps = props;
		return (
			<div data-testid="options-section">
				<fieldset>
					<legend>Game mode</legend>
					<label>
						<input
							type="radio"
							name="gameMode"
							value={GAME_MODES.MINUSCULE}
							checked={props.selectedMode === GAME_MODES.MINUSCULE}
							onChange={props.onModeChange}
						/>
						minuscules only
					</label>
					<label>
						<input
							type="radio"
							name="gameMode"
							value={GAME_MODES.MAJUSCULE}
							checked={props.selectedMode === GAME_MODES.MAJUSCULE}
							onChange={props.onModeChange}
						/>
						MAJUSCULES only
					</label>
					<label>
						<input
							type="radio"
							name="gameMode"
							value={GAME_MODES.ALL}
							checked={props.selectedMode === GAME_MODES.ALL}
							onChange={props.onModeChange}
						/>
						both minuscules AND MAJUSCULES
					</label>
				</fieldset>
				<p>
					Question bank: <strong>80</strong> characters from{' '}
					<strong>3</strong> alphabets.
				</p>
				<button onClick={props.onShowCatalogue}>Choose alphabets</button>
				<label>
					<input
						type="checkbox"
						checked={props.showBaseline}
						onChange={e => props.onShowBaselineChange(e.target.checked)}
					/>
					Show baselines
				</label>
			</div>
		);
	},
}));

vi.mock('@components/HowToPlaySection/HowToPlaySection.jsx', () => ({
	default: () => <div data-testid="how-to-play-section">How to play content</div>,
}));

vi.mock('@components/NextStepsSection/NextStepsSection.jsx', () => ({
	default: () => <div data-testid="next-steps-section">Next steps content</div>,
}));

vi.mock('@components/WhatsNewSection/WhatsNewSection.jsx', () => ({
	default: () => <div data-testid="whats-new-section">What's new content</div>,
}));

vi.mock('@utilities/database.js', () => ({
	countEnabledCharacters: vi.fn(() => 80),
	countEnabledAlphabets: vi.fn(() => 3),
}));

vi.mock('@data/DB.js', () => ({
	DB: {},
}));

describe('LandingScreen', () => {
	let mockOnSelectMode;
	let mockOnShowCatalogue;
	let mockOnShowFeedback;
	let mockSetShowBaseline;
	let mockEnabledAlphabets;

	beforeEach(() => {
		mockOnSelectMode = vi.fn();
		mockOnShowCatalogue = vi.fn();
		mockOnShowFeedback = vi.fn();
		mockSetShowBaseline = vi.fn();
		mockEnabledAlphabets = {
			'BeauChesne-Baildon': true,
			Howard: true,
			Joscelyn: true,
		};
		mockOptionsProps = null;
	});

	describe('Component Structure', () => {
		it('should render within PageWidth layout', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			expect(screen.getByTestId('page-width')).toBeInTheDocument();
		});

		it('should render SmallPrint component', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			expect(screen.getByTestId('small-print')).toBeInTheDocument();
		});
	});

	describe('Hero Section', () => {
		it('should render Logo with SIZE.S', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			const logo = screen.getByTestId('logo');
			expect(logo).toBeInTheDocument();
			expect(logo).toHaveAttribute('data-size', 'small');
		});

		it('should display the secretary hand image', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			const image = screen.getByAltText('Secretary Hand');
			expect(image).toBeInTheDocument();
			expect(image).toHaveAttribute('src', 'secretary_hand.gif');
		});

		it('should render page title with Secretary in Joscelyn font', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			expect(screen.getByTestId('page-title')).toBeInTheDocument();
			expect(screen.getByText(/Hone your/i)).toBeInTheDocument();
			expect(screen.getByText('Secretary')).toBeInTheDocument();
		});

		it('should render Play button', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			const playButton = screen.getByRole('button', { name: 'Play' });
			expect(playButton).toBeInTheDocument();
			expect(playButton).toHaveAttribute('data-hero', 'true');
		});

		it('should call onSelectMode with default ALL mode when Play is clicked', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			const playButton = screen.getByRole('button', { name: 'Play' });
			await user.click(playButton);

			expect(mockOnSelectMode).toHaveBeenCalledTimes(1);
			expect(mockOnSelectMode).toHaveBeenCalledWith(GAME_MODES.ALL, false);
		});
	});

	describe('Disclosure Sections', () => {
		it('should render Options disclosure section', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			expect(screen.getByText('Options')).toBeInTheDocument();
		});

		it('should render How to play disclosure section', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			expect(screen.getByText('How to play')).toBeInTheDocument();
		});

		it('should render Next steps for learners disclosure section', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			expect(screen.getByText('Next steps for learners')).toBeInTheDocument();
		});

		it("should render What's new? disclosure section", () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			expect(screen.getByText("What's new?")).toBeInTheDocument();
		});

		it('should toggle disclosure section when header is clicked', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			const optionsButton = screen.getByRole('button', {
				name: 'Options',
			});
			expect(optionsButton).toHaveAttribute('aria-expanded', 'false');

			await user.click(optionsButton);
			expect(optionsButton).toHaveAttribute('aria-expanded', 'true');

			await user.click(optionsButton);
			expect(optionsButton).toHaveAttribute('aria-expanded', 'false');
		});
	});

	describe('Options Section Content', () => {
		it('should render OptionsSection with correct props when expanded', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={true}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			await user.click(screen.getByRole('button', { name: 'Options' }));

			expect(screen.getByTestId('options-section')).toBeInTheDocument();
			expect(mockOptionsProps.selectedMode).toBe(GAME_MODES.ALL);
			expect(mockOptionsProps.showBaseline).toBe(true);
			expect(mockOptionsProps.characterCount).toBe(80);
			expect(mockOptionsProps.alphabetCount).toBe(3);
		});

		it('should have "both" selected by default', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			await user.click(screen.getByRole('button', { name: 'Options' }));

			expect(
				screen.getByLabelText(/both minuscules AND MAJUSCULES/i)
			).toBeChecked();
		});

		it('should update selected mode when radio is clicked', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			await user.click(screen.getByRole('button', { name: 'Options' }));

			await user.click(screen.getByLabelText(/minuscules only/i));
			expect(screen.getByLabelText(/minuscules only/i)).toBeChecked();
			expect(
				screen.getByLabelText(/both minuscules AND MAJUSCULES/i)
			).not.toBeChecked();
		});

		it('should call onShowCatalogue when Choose alphabets button is clicked', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			await user.click(screen.getByRole('button', { name: 'Options' }));

			const chooseButton = screen.getByRole('button', {
				name: 'Choose alphabets',
			});
			await user.click(chooseButton);

			expect(mockOnShowCatalogue).toHaveBeenCalledTimes(1);
		});
	});

	describe('Game Mode Selection', () => {
		it('should call onSelectMode with minuscule mode after selecting it', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			await user.click(screen.getByRole('button', { name: 'Options' }));
			await user.click(screen.getByLabelText(/minuscules only/i));

			const playButton = screen.getByRole('button', { name: 'Play' });
			await user.click(playButton);

			expect(mockOnSelectMode).toHaveBeenCalledWith(GAME_MODES.MINUSCULE, false);
		});

		it('should call onSelectMode with majuscule mode after selecting it', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			await user.click(screen.getByRole('button', { name: 'Options' }));
			await user.click(screen.getByLabelText(/MAJUSCULES only/i));

			const playButton = screen.getByRole('button', { name: 'Play' });
			await user.click(playButton);

			expect(mockOnSelectMode).toHaveBeenCalledWith(GAME_MODES.MAJUSCULE, false);
		});
	});

	describe('SmallPrint Integration', () => {
		it('should pass onShowFeedback callback to SmallPrint', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			const reportButton = screen.getByRole('button', {
				name: 'Report a problem',
			});
			expect(reportButton).toBeInTheDocument();
		});

		it('should call onShowFeedback when SmallPrint feedback button is clicked', async () => {
			const user = userEvent.setup();

			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
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
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			const header = container.querySelector('header');
			expect(header).toBeInTheDocument();
		});

		it('should have aria-expanded attributes on disclosure buttons', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			const optionsButton = screen.getByRole('button', {
				name: 'Options',
			});
			expect(optionsButton).toHaveAttribute('aria-expanded');
		});

		it('should render semantic main element for content sections', () => {
			const { container } = render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			const main = container.querySelector('main');
			expect(main).toBeInTheDocument();
		});
	});

	describe('Integration', () => {
		it('should not call any callbacks on initial render', () => {
			render(
				<LandingScreen
					onSelectMode={mockOnSelectMode}
					onShowCatalogue={mockOnShowCatalogue}
					onShowFeedback={mockOnShowFeedback}
					showBaseline={false}
					setShowBaseline={mockSetShowBaseline}
					enabledAlphabets={mockEnabledAlphabets}
				/>
			);

			expect(mockOnSelectMode).not.toHaveBeenCalled();
			expect(mockOnShowCatalogue).not.toHaveBeenCalled();
			expect(mockOnShowFeedback).not.toHaveBeenCalled();
		});
	});
});
