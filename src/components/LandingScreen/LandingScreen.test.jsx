import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingScreen from './LandingScreen';
import { DEFAULT_OPTIONS, OPTIONS_SOURCE } from '@constants/options.js';

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
	Paragraph: ({ children }) => <p>{children}</p>,
}));

vi.mock('@components/Toggle/Toggle.jsx', () => ({
	default: ({ id, label, checked, onChange }) => (
		<label>
			<input
				type="checkbox"
				id={id}
				checked={checked}
				onChange={e => onChange(e.target.checked)}
			/>
			{label}
		</label>
	),
}));

vi.mock('@components/CharacterImage/CharacterImage.jsx', () => ({
	default: ({ imagePath, caption, showBaseline }) => (
		<div data-testid="character-image" data-baseline={showBaseline}>
			<img src={imagePath} alt={caption} />
		</div>
	),
}));

// Mock alphabets.json
vi.mock('@data/alphabets.json', () => ({
	default: {
		'BeauChesne-Baildon': {
			id: 4,
			title: 'Test BeauChesne Title',
			sourceUri: 'https://example.com/beauchesne',
			date: '1602',
		},
	},
}));

// Mock changelog.json
vi.mock('@data/changelog.json', () => ({
	default: [
		{ version: '1.2.0', description: 'Added new features' },
		{ version: '1.1.0', description: 'Bug fixes' },
		{ version: '1.0.0', description: 'Initial release' },
	],
}));

// Mock markdown imports
vi.mock('@data/hero.md?raw', () => ({
	default: 'Sharpie helps sharpen your eye for recognising letters.',
}));

vi.mock('@data/identify.md?raw', () => ({
	default:
		'_Minuscule_ is the manuscript equivalent of "lower case" in print.',
}));

vi.mock('@data/alphabet.md?raw', () => ({
	default:
		'During this era, the alphabet had 24 letters.\n\n{{ALPHABET_TOGGLE}}',
}));

vi.mock('@data/baselines.md?raw', () => ({
	default:
		'{{BASELINE_TOGGLE}}\n\nWhen enabled, a baseline appears.\n\n{{BASELINE_EXAMPLES}}',
}));

vi.mock('@data/how-to-use.md?raw', () => ({
	default:
		'1. You will be shown a character\n2. Use your keyboard\n3. See feedback\n4. Hit next\n5. Exit at any time',
}));

vi.mock('@data/letters-in-context.md?raw', () => ({
	default: 'For some alphabets we show you a fragment.\n\n{{CONTEXT_IMAGE}}',
}));

vi.mock('@data/hints.md?raw', () => ({
	default: 'Some letters supply additional information.',
}));

vi.mock('@data/next-steps.md?raw', () => ({
	default:
		'Many resources are available online:\n\n- [English Handwriting Online](https://www.english.cam.ac.uk/ceres/ehoc/)',
}));

// Mock database utilities
vi.mock('@utilities/database.js', () => ({
	countTotalCharacters: vi.fn(() => 100),
	countEnabledCharacters: vi.fn(() => 80),
	getAllAlphabetNames: vi.fn(() => [
		'Howard',
		'Joscelyn',
		'BeauChesne-Baildon',
	]),
	countEnabledAlphabets: vi.fn(() => 3),
}));

vi.mock('@data/DB.js', () => ({
	DB: {},
}));

describe('LandingScreen', () => {
	let mockOnSelectMode;
	let mockOnShowCatalogue;
	let mockOnShowFeedback;
	let mockSetOption;
	let mockResetOptions;
	let mockEnabledAlphabets;
	let defaultOptions;

	beforeEach(() => {
		mockOnSelectMode = vi.fn();
		mockOnShowCatalogue = vi.fn();
		mockOnShowFeedback = vi.fn();
		mockSetOption = vi.fn();
		mockResetOptions = vi.fn();
		mockEnabledAlphabets = {
			'BeauChesne-Baildon': true,
			Howard: true,
			Joscelyn: true,
		};
		defaultOptions = { ...DEFAULT_OPTIONS };
	});

	const renderLandingScreen = (overrideProps = {}) => {
		return render(
			<LandingScreen
				onSelectMode={mockOnSelectMode}
				onShowCatalogue={mockOnShowCatalogue}
				onShowFeedback={mockOnShowFeedback}
				options={defaultOptions}
				optionsSource={OPTIONS_SOURCE.DEFAULTS}
				setOption={mockSetOption}
				resetOptions={mockResetOptions}
				enabledAlphabets={mockEnabledAlphabets}
				{...overrideProps}
			/>
		);
	};

	describe('Component Structure', () => {
		it('should render within PageWidth layout', () => {
			renderLandingScreen();
			expect(screen.getByTestId('page-width')).toBeInTheDocument();
		});

		it('should render SmallPrint component', () => {
			renderLandingScreen();
			expect(screen.getByTestId('small-print')).toBeInTheDocument();
		});
	});

	describe('Hero Section', () => {
		it('should render Logo with SIZE.S', () => {
			renderLandingScreen();
			const logo = screen.getByTestId('logo');
			expect(logo).toBeInTheDocument();
			expect(logo).toHaveAttribute('data-size', 'small');
		});

		it('should display the secretary hand image', () => {
			renderLandingScreen();
			const image = screen.getByAltText('Secretary Hand');
			expect(image).toBeInTheDocument();
			expect(image).toHaveAttribute('src', 'secretary_hand.gif');
		});

		it('should render page title with Secretary in Joscelyn font', () => {
			renderLandingScreen();
			expect(screen.getByTestId('page-title')).toBeInTheDocument();
			expect(screen.getByText(/Hone your/i)).toBeInTheDocument();
			expect(screen.getByText('Secretary')).toBeInTheDocument();
		});

		it('should render Play button', () => {
			renderLandingScreen();
			const playButton = screen.getByRole('button', { name: 'Play' });
			expect(playButton).toBeInTheDocument();
			expect(playButton).toHaveAttribute('data-hero', 'true');
		});

		it('should call onSelectMode when Play is clicked', async () => {
			const user = userEvent.setup();
			renderLandingScreen();
			const playButton = screen.getByRole('button', { name: 'Play' });
			await user.click(playButton);
			expect(mockOnSelectMode).toHaveBeenCalledTimes(1);
		});
	});

	describe('Disclosure Sections', () => {
		it('should render Options disclosure section', () => {
			renderLandingScreen();
			expect(screen.getByText('Options')).toBeInTheDocument();
		});

		it('should render How to play disclosure section', () => {
			renderLandingScreen();
			expect(screen.getByText('How to play')).toBeInTheDocument();
		});

		it('should render Next steps for learners disclosure section', () => {
			renderLandingScreen();
			expect(
				screen.getByText('Next steps for learners')
			).toBeInTheDocument();
		});

		it("should render What's new? disclosure section", () => {
			renderLandingScreen();
			expect(screen.getByText("What's new?")).toBeInTheDocument();
		});

		it('should toggle disclosure section when header is clicked', async () => {
			const user = userEvent.setup();
			renderLandingScreen();

			// Options section starts collapsed (defaultExpanded=false)
			const optionsButton = screen.getByRole('button', {
				name: 'Options',
			});
			expect(optionsButton).toHaveAttribute('aria-expanded', 'false');

			// Click to expand
			await user.click(optionsButton);
			expect(optionsButton).toHaveAttribute('aria-expanded', 'true');

			// Click to collapse
			await user.click(optionsButton);
			expect(optionsButton).toHaveAttribute('aria-expanded', 'false');
		});
	});

	describe('Options Section Content', () => {
		it('should render Identify subsection with radio buttons when expanded', async () => {
			const user = userEvent.setup();
			renderLandingScreen();

			// Expand Options section
			await user.click(screen.getByRole('button', { name: 'Options' }));

			expect(screen.getByText('Identify...')).toBeInTheDocument();
			expect(
				screen.getByLabelText(/minuscules only/i)
			).toBeInTheDocument();
			expect(
				screen.getByLabelText(/MAJUSCULES only/i)
			).toBeInTheDocument();
			expect(
				screen.getByLabelText(/both minuscules AND MAJUSCULES/i)
			).toBeInTheDocument();
		});

		it('should have "both" selected by default', async () => {
			const user = userEvent.setup();
			renderLandingScreen();

			await user.click(screen.getByRole('button', { name: 'Options' }));

			expect(
				screen.getByLabelText(/both minuscules AND MAJUSCULES/i)
			).toBeChecked();
		});

		it('should call setOption when radio is clicked', async () => {
			const user = userEvent.setup();
			renderLandingScreen();

			await user.click(screen.getByRole('button', { name: 'Options' }));
			await user.click(screen.getByLabelText(/minuscules only/i));

			expect(mockSetOption).toHaveBeenCalledWith('gameMode', 'minuscule');
		});

		it('should render Alphabets subsection with question bank stats', async () => {
			const user = userEvent.setup();
			renderLandingScreen();

			await user.click(screen.getByRole('button', { name: 'Options' }));

			expect(screen.getByText('Alphabets')).toBeInTheDocument();
			expect(screen.getByText(/Question bank:/i)).toBeInTheDocument();
			expect(screen.getByText('80')).toBeInTheDocument(); // enabled characters
			expect(screen.getByText('3')).toBeInTheDocument(); // enabled alphabets
		});

		it('should render Choose alphabets button', async () => {
			const user = userEvent.setup();
			renderLandingScreen();

			await user.click(screen.getByRole('button', { name: 'Options' }));

			const chooseButton = screen.getByRole('button', {
				name: 'Choose alphabets',
			});
			expect(chooseButton).toBeInTheDocument();
		});

		it('should call onShowCatalogue when Choose alphabets button is clicked', async () => {
			const user = userEvent.setup();
			renderLandingScreen();

			await user.click(screen.getByRole('button', { name: 'Options' }));

			const chooseButton = screen.getByRole('button', {
				name: 'Choose alphabets',
			});
			await user.click(chooseButton);

			expect(mockOnShowCatalogue).toHaveBeenCalledTimes(1);
		});

		it('should render baseline toggle', async () => {
			const user = userEvent.setup();
			renderLandingScreen({
				options: { ...defaultOptions, showBaseline: true },
			});

			await user.click(screen.getByRole('button', { name: 'Options' }));

			expect(screen.getByText('Baselines')).toBeInTheDocument();
			const toggle = screen.getByLabelText('Show baselines');
			expect(toggle).toBeInTheDocument();
			expect(toggle).toBeChecked();
		});
	});

	describe('SmallPrint Integration', () => {
		it('should pass onShowFeedback callback to SmallPrint', () => {
			renderLandingScreen();
			const reportButton = screen.getByRole('button', {
				name: 'Report a problem',
			});
			expect(reportButton).toBeInTheDocument();
		});

		it('should call onShowFeedback when SmallPrint feedback button is clicked', async () => {
			const user = userEvent.setup();
			renderLandingScreen();

			const reportButton = screen.getByRole('button', {
				name: 'Report a problem',
			});
			await user.click(reportButton);

			expect(mockOnShowFeedback).toHaveBeenCalledTimes(1);
		});
	});

	describe('Accessibility', () => {
		it('should render semantic header element', () => {
			const { container } = renderLandingScreen();
			const header = container.querySelector('header');
			expect(header).toBeInTheDocument();
		});

		it('should have aria-expanded attributes on disclosure buttons', () => {
			renderLandingScreen();
			const optionsButton = screen.getByRole('button', {
				name: 'Options',
			});
			expect(optionsButton).toHaveAttribute('aria-expanded');
		});
	});

	describe('Integration', () => {
		it('should not call any callbacks on initial render', () => {
			renderLandingScreen();

			expect(mockOnSelectMode).not.toHaveBeenCalled();
			expect(mockOnShowCatalogue).not.toHaveBeenCalled();
			expect(mockOnShowFeedback).not.toHaveBeenCalled();
		});
	});

	describe('Options Summary', () => {
		it('should show options summary in Options section', async () => {
			const user = userEvent.setup();
			renderLandingScreen();

			await user.click(screen.getByRole('button', { name: 'Options' }));

			// Should display the current settings summary
			expect(screen.getByText(/both cases/i)).toBeInTheDocument();
		});

		it('should show source indicator for defaults', async () => {
			const user = userEvent.setup();
			renderLandingScreen();

			await user.click(screen.getByRole('button', { name: 'Options' }));

			expect(
				screen.getByText(/Using default settings/i)
			).toBeInTheDocument();
		});

		it('should show source indicator for query string', async () => {
			const user = userEvent.setup();
			renderLandingScreen({ optionsSource: OPTIONS_SOURCE.QUERY_STRING });

			await user.click(screen.getByRole('button', { name: 'Options' }));

			expect(
				screen.getByText(/Loaded from shared link/i)
			).toBeInTheDocument();
		});

		it('should show source indicator for local storage', async () => {
			const user = userEvent.setup();
			renderLandingScreen({
				optionsSource: OPTIONS_SOURCE.LOCAL_STORAGE,
			});

			await user.click(screen.getByRole('button', { name: 'Options' }));

			expect(
				screen.getByText(/Restored from previous session/i)
			).toBeInTheDocument();
		});
	});
});
