import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptionsSummary from './OptionsSummary';

// Mock TanStack Router
const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', () => ({
	useNavigate: () => mockNavigate,
}));

// Mock the GameOptionsContext
const mockResetOptions = vi.fn();
const mockToggleOption = vi.fn();
const mockCycleMode = vi.fn();
vi.mock('@lib/context/GameOptionsContext.jsx', () => ({
	useGameOptionsContext: () => ({
		resetOptions: mockResetOptions,
		toggleOption: mockToggleOption,
		cycleMode: mockCycleMode,
	}),
}));

describe('OptionsSummary', () => {
	const defaultOptions = {
		mode: 'all',
		enabledHands: { 'BeauChesne-Baildon': true, Hill: true },
		numLetters: true,
		showBaseline: true,
	};

	const defaultProps = {
		options: defaultOptions,
		handCount: 2,
	};

	describe('Badge rendering', () => {
		it('should render mode badge with both ticks when mode is all', () => {
			render(<OptionsSummary {...defaultProps} />);
			const badge = screen.getByTestId('badge-mode');
			expect(badge).toHaveTextContent('minuscules');
			expect(badge).toHaveTextContent('MAJUSCULES');
			expect(badge).toHaveTextContent('✓');
		});

		it('should render mode badge with minuscule tick when mode is minuscule', () => {
			const options = { ...defaultOptions, mode: 'minuscule' };
			render(<OptionsSummary {...defaultProps} options={options} />);
			const badge = screen.getByTestId('badge-mode');
			expect(badge).toHaveTextContent('minuscules');
			expect(badge).toHaveTextContent('✓');
			expect(badge).toHaveTextContent('MAJUSCULES');
			expect(badge).toHaveTextContent('✗');
		});

		it('should render mode badge with majuscule tick when mode is majuscule', () => {
			const options = { ...defaultOptions, mode: 'majuscule' };
			render(<OptionsSummary {...defaultProps} options={options} />);
			const badge = screen.getByTestId('badge-mode');
			expect(badge).toHaveTextContent('minuscules');
			expect(badge).toHaveTextContent('✗');
			expect(badge).toHaveTextContent('MAJUSCULES');
			expect(badge).toHaveTextContent('✓');
		});

		it('should render hand count badge with plural', () => {
			render(<OptionsSummary {...defaultProps} />);
			const badge = screen.getByTestId('badge-enabledHands');
			expect(badge).toHaveTextContent('Hands');
			expect(badge).toHaveTextContent('2');
		});

		it('should render hand count badge with singular', () => {
			render(<OptionsSummary {...defaultProps} handCount={1} />);
			const badge = screen.getByTestId('badge-enabledHands');
			expect(badge).toHaveTextContent('Hands');
			expect(badge).toHaveTextContent('1');
		});

		it('should render 24 letters badge when numLetters is true', () => {
			render(<OptionsSummary {...defaultProps} />);
			const badge = screen.getByTestId('badge-numLetters');
			expect(badge).toHaveTextContent('Letters');
			expect(badge).toHaveTextContent('24');
		});

		it('should render 26 letters badge when numLetters is false', () => {
			const options = {
				...defaultOptions,
				numLetters: false,
			};
			render(<OptionsSummary {...defaultProps} options={options} />);
			const badge = screen.getByTestId('badge-numLetters');
			expect(badge).toHaveTextContent('Letters');
			expect(badge).toHaveTextContent('26');
		});

		it('should render Baseline with tick when showBaseline is true', () => {
			render(<OptionsSummary {...defaultProps} />);
			const badge = screen.getByTestId('badge-showBaseline');
			expect(badge).toHaveTextContent('Baseline');
			expect(badge).toHaveTextContent('✓');
		});

		it('should render Baseline with cross when showBaseline is false', () => {
			const options = { ...defaultOptions, showBaseline: false };
			render(<OptionsSummary {...defaultProps} options={options} />);
			const badge = screen.getByTestId('badge-showBaseline');
			expect(badge).toHaveTextContent('Baseline');
			expect(badge).toHaveTextContent('✗');
		});
	});

	describe('Badge interactions', () => {
		it('should call toggleOption when numLetters badge is clicked', async () => {
			const user = userEvent.setup();
			render(<OptionsSummary {...defaultProps} />);

			const badge = screen.getByTestId('badge-numLetters');
			await user.click(badge);

			expect(mockToggleOption).toHaveBeenCalledWith('numLetters');
		});

		it('should call toggleOption when showBaseline badge is clicked', async () => {
			const user = userEvent.setup();
			render(<OptionsSummary {...defaultProps} />);

			const badge = screen.getByTestId('badge-showBaseline');
			await user.click(badge);

			expect(mockToggleOption).toHaveBeenCalledWith('showBaseline');
		});

		it('should call cycleMode when mode badge is clicked', async () => {
			const user = userEvent.setup();
			render(<OptionsSummary {...defaultProps} />);

			const badge = screen.getByTestId('badge-mode');
			await user.click(badge);

			expect(mockCycleMode).toHaveBeenCalled();
		});

		it('should navigate to catalogue when hands badge is clicked', async () => {
			const user = userEvent.setup();
			render(<OptionsSummary {...defaultProps} />);

			const badge = screen.getByTestId('badge-enabledHands');
			await user.click(badge);

			expect(mockNavigate).toHaveBeenCalledWith({
				to: '/catalogue',
				search: expect.any(Function),
			});
		});
	});
});
