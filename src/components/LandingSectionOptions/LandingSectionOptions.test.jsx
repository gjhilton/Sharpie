import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingSectionOptions from './LandingSectionOptions';
import { GAME_MODES } from '@constants/stages.js';

// Mock the markdown import
vi.mock('@data/options.md?raw', () => ({
	default: `Practice *lowercase* or *uppercase* characters.`
}));

describe('LandingSectionOptions', () => {
	const mockSetSelectedMode = vi.fn();
	const mockOnShowCatalogue = vi.fn();

	beforeEach(() => {
		mockSetSelectedMode.mockClear();
		mockOnShowCatalogue.mockClear();
	});

	it('renders section heading', () => {
		render(
			<LandingSectionOptions
				selectedMode={GAME_MODES.ALL}
				setSelectedMode={mockSetSelectedMode}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);
		expect(screen.getByText('Options')).toBeInTheDocument();
	});

	it('renders description from markdown with emphasis', () => {
		render(
			<LandingSectionOptions
				selectedMode={GAME_MODES.ALL}
				setSelectedMode={mockSetSelectedMode}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);
		expect(screen.getByText(/Practice/i)).toBeInTheDocument();
		const lowercaseEmphasis = screen.getByText('lowercase');
		expect(lowercaseEmphasis.tagName).toBe('EM');
	});

	it('renders radio button group with legend', () => {
		render(
			<LandingSectionOptions
				selectedMode={GAME_MODES.ALL}
				setSelectedMode={mockSetSelectedMode}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);
		expect(screen.getByText('Game mode')).toBeInTheDocument();
		expect(screen.getByRole('group')).toBeInTheDocument();
	});

	it('renders all three radio options', () => {
		render(
			<LandingSectionOptions
				selectedMode={GAME_MODES.ALL}
				setSelectedMode={mockSetSelectedMode}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);
		expect(screen.getByLabelText('minuscules')).toBeInTheDocument();
		expect(screen.getByLabelText('MAJUSCULES')).toBeInTheDocument();
		expect(screen.getByLabelText('both')).toBeInTheDocument();
	});

	it('has "both" selected by default when selectedMode is ALL', () => {
		render(
			<LandingSectionOptions
				selectedMode={GAME_MODES.ALL}
				setSelectedMode={mockSetSelectedMode}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);
		expect(screen.getByLabelText('both')).toBeChecked();
		expect(screen.getByLabelText('minuscules')).not.toBeChecked();
		expect(screen.getByLabelText('MAJUSCULES')).not.toBeChecked();
	});

	it('shows minuscules selected when selectedMode is MINUSCULE', () => {
		render(
			<LandingSectionOptions
				selectedMode={GAME_MODES.MINUSCULE}
				setSelectedMode={mockSetSelectedMode}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);
		expect(screen.getByLabelText('minuscules')).toBeChecked();
		expect(screen.getByLabelText('MAJUSCULES')).not.toBeChecked();
		expect(screen.getByLabelText('both')).not.toBeChecked();
	});

	it('shows MAJUSCULES selected when selectedMode is MAJUSCULE', () => {
		render(
			<LandingSectionOptions
				selectedMode={GAME_MODES.MAJUSCULE}
				setSelectedMode={mockSetSelectedMode}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);
		expect(screen.getByLabelText('MAJUSCULES')).toBeChecked();
		expect(screen.getByLabelText('minuscules')).not.toBeChecked();
		expect(screen.getByLabelText('both')).not.toBeChecked();
	});

	it('calls setSelectedMode when minuscules radio is clicked', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionOptions
				selectedMode={GAME_MODES.ALL}
				setSelectedMode={mockSetSelectedMode}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);

		await user.click(screen.getByLabelText('minuscules'));
		expect(mockSetSelectedMode).toHaveBeenCalledWith(GAME_MODES.MINUSCULE);
	});

	it('calls setSelectedMode when MAJUSCULES radio is clicked', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionOptions
				selectedMode={GAME_MODES.ALL}
				setSelectedMode={mockSetSelectedMode}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);

		await user.click(screen.getByLabelText('MAJUSCULES'));
		expect(mockSetSelectedMode).toHaveBeenCalledWith(GAME_MODES.MAJUSCULE);
	});

	it('calls setSelectedMode when both radio is clicked', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionOptions
				selectedMode={GAME_MODES.MINUSCULE}
				setSelectedMode={mockSetSelectedMode}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);

		await user.click(screen.getByLabelText('both'));
		expect(mockSetSelectedMode).toHaveBeenCalledWith(GAME_MODES.ALL);
	});

	it('renders catalogue link', () => {
		render(
			<LandingSectionOptions
				selectedMode={GAME_MODES.ALL}
				setSelectedMode={mockSetSelectedMode}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);
		expect(screen.getByText(/view all characters/i)).toBeInTheDocument();
	});

	it('catalogue link calls onShowCatalogue', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionOptions
				selectedMode={GAME_MODES.ALL}
				setSelectedMode={mockSetSelectedMode}
				onShowCatalogue={mockOnShowCatalogue}
			/>
		);

		await user.click(screen.getByRole('link', { name: /view all characters/i }));
		expect(mockOnShowCatalogue).toHaveBeenCalled();
	});
});
