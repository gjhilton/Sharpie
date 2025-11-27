import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptionsSection from './OptionsSection';
import { GAME_MODES, GAME_MODE_OPTIONS } from '@constants/stages.js';

// Mock the GameOptionsContext
const mockResetOptions = vi.fn();
const mockCycleMode = vi.fn();
vi.mock('@context/GameOptionsContext.jsx', () => ({
	useGameOptionsContext: () => ({
		resetOptions: mockResetOptions,
		cycleMode: mockCycleMode,
	}),
}));

vi.mock('@components/Layout/Layout.jsx', () => ({
	Paragraph: ({ children }) => <p>{children}</p>,
}));

vi.mock('@components/Button/Button.jsx', () => ({
	default: ({ label, onClick }) => <button onClick={onClick}>{label}</button>,
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

vi.mock('@components/SubSection/SubSection.jsx', () => ({
	default: ({ title, children }) => (
		<section>
			<h3>{title}</h3>
			{children}
		</section>
	),
}));

vi.mock('@components/RadioGroup/RadioGroup.jsx', () => ({
	RadioGroup: ({ legend, name, value, onChange, options }) => (
		<fieldset>
			<legend>{legend}</legend>
			{options.map(option => (
				<label key={option.value}>
					<input
						type="radio"
						name={name}
						value={option.value}
						checked={value === option.value}
						onChange={onChange}
					/>
					{option.label}
				</label>
			))}
		</fieldset>
	),
}));

vi.mock('@components/MarkdownWithPlaceholders/MarkdownWithPlaceholders.jsx', () => ({
	default: ({ content, placeholders }) => (
		<div data-testid="markdown-content">
			{content}
			{placeholders &&
				Object.entries(placeholders).map(([key, value]) => (
					<div key={key} data-testid={`placeholder-${key}`}>
						{value}
					</div>
				))}
		</div>
	),
}));

vi.mock('@components/BaselineExamples/BaselineExamples.jsx', () => ({
	default: () => <div data-testid="baseline-examples">Baseline Examples</div>,
}));

vi.mock('@data/identify.md?raw', () => ({
	default: 'Identify content',
}));

vi.mock('@data/alphabet.md?raw', () => ({
	default: 'Alphabet content',
}));

vi.mock('@data/baselines.md?raw', () => ({
	default: 'Baselines content',
}));

describe('OptionsSection', () => {
	const defaultProps = {
		gameModeOptions: GAME_MODE_OPTIONS,
		selectedMode: GAME_MODES.ALL,
		onModeChange: vi.fn(),
		numLetters: false,
		onNumLettersChange: vi.fn(),
		showBaseline: false,
		onShowBaselineChange: vi.fn(),
		characterCount: 80,
		alphabetCount: 3,
		onShowCatalogue: vi.fn(),
	};

	it('renders all subsections', () => {
		render(<OptionsSection {...defaultProps} />);

		expect(screen.getByText('Identify...')).toBeInTheDocument();
		expect(screen.getByText('Alphabets')).toBeInTheDocument();
		expect(screen.getByText('26 letters vs 24')).toBeInTheDocument();
		expect(screen.getByText('Baselines')).toBeInTheDocument();
	});

	it('renders game mode radio options', () => {
		render(<OptionsSection {...defaultProps} />);

		expect(screen.getByLabelText('minuscules only')).toBeInTheDocument();
		expect(screen.getByLabelText('MAJUSCULES only')).toBeInTheDocument();
		expect(screen.getByLabelText('both minuscules AND MAJUSCULES')).toBeInTheDocument();
	});

	it('selects the correct game mode', () => {
		render(<OptionsSection {...defaultProps} selectedMode={GAME_MODES.MINUSCULE} />);

		expect(screen.getByLabelText('minuscules only')).toBeChecked();
		expect(screen.getByLabelText('both minuscules AND MAJUSCULES')).not.toBeChecked();
	});

	it('calls onModeChange when radio is clicked', async () => {
		const onModeChange = vi.fn();
		const user = userEvent.setup();

		render(<OptionsSection {...defaultProps} onModeChange={onModeChange} />);

		await user.click(screen.getByLabelText('minuscules only'));

		expect(onModeChange).toHaveBeenCalled();
	});

	it('displays question bank stats', () => {
		render(<OptionsSection {...defaultProps} />);

		expect(screen.getByText('80')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
	});

	it('renders Choose alphabets button', () => {
		render(<OptionsSection {...defaultProps} />);

		expect(screen.getByRole('button', { name: 'Choose alphabets' })).toBeInTheDocument();
	});

	it('calls onShowCatalogue when Choose alphabets is clicked', async () => {
		const onShowCatalogue = vi.fn();
		const user = userEvent.setup();

		render(<OptionsSection {...defaultProps} onShowCatalogue={onShowCatalogue} />);

		await user.click(screen.getByRole('button', { name: 'Choose alphabets' }));

		expect(onShowCatalogue).toHaveBeenCalledTimes(1);
	});

	it('renders baseline toggle with correct state', () => {
		render(<OptionsSection {...defaultProps} showBaseline={true} />);

		expect(screen.getByLabelText('Show baselines')).toBeChecked();
	});

	it('calls onShowBaselineChange when baseline toggle is clicked', async () => {
		const onShowBaselineChange = vi.fn();
		const user = userEvent.setup();

		render(<OptionsSection {...defaultProps} onShowBaselineChange={onShowBaselineChange} />);

		await user.click(screen.getByLabelText('Show baselines'));

		expect(onShowBaselineChange).toHaveBeenCalledWith(true);
	});

	it('renders 24-letter alphabet toggle', () => {
		render(<OptionsSection {...defaultProps} />);

		expect(screen.getByLabelText('24-letter alphabet')).toBeInTheDocument();
	});

	it('calls onNumLettersChange when alphabet toggle is clicked', async () => {
		const onNumLettersChange = vi.fn();
		const user = userEvent.setup();

		render(<OptionsSection {...defaultProps} onNumLettersChange={onNumLettersChange} />);

		await user.click(screen.getByLabelText('24-letter alphabet'));

		expect(onNumLettersChange).toHaveBeenCalledWith(true);
	});

	it('renders BaselineExamples component', () => {
		render(<OptionsSection {...defaultProps} />);

		expect(screen.getByTestId('baseline-examples')).toBeInTheDocument();
	});
});
