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
vi.mock('@context/GameOptionsContext.jsx', () => ({
	useGameOptionsContext: () => ({
		resetOptions: mockResetOptions,
		toggleOption: mockToggleOption,
		cycleMode: mockCycleMode,
	}),
}));

describe('OptionsSummary', () => {
	const defaultOptions = {
		mode: 'all',
		enabledAlphabets: { 'BeauChesne-Baildon': true, Hill: true },
		numLetters: true,
		showBaseline: true,
	};

	const defaultProps = {
		options: defaultOptions,
		alphabetCount: 2,
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

		it('should render alphabet count badge with plural', () => {
			render(<OptionsSummary {...defaultProps} />);
			const badge = screen.getByTestId('badge-enabledAlphabets');
			expect(badge).toHaveTextContent('Alphabets');
			expect(badge).toHaveTextContent('2');
		});

		it('should render alphabet count badge with singular', () => {
			render(<OptionsSummary {...defaultProps} alphabetCount={1} />);
			const badge = screen.getByTestId('badge-enabledAlphabets');
			expect(badge).toHaveTextContent('Alphabets');
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

	describe('URL display', () => {
		it('should display shareable URL input', () => {
			render(<OptionsSummary {...defaultProps} />);
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute('readonly');
		});

		it('should generate URL containing origin', () => {
			render(<OptionsSummary {...defaultProps} />);
			const input = screen.getByRole('textbox');
			expect(input.value).toContain(window.location.origin);
		});
	});

	describe('Button rendering', () => {
		it('should render Copy button', () => {
			render(<OptionsSummary {...defaultProps} />);
			expect(
				screen.getByRole('button', { name: /copy/i })
			).toBeInTheDocument();
		});

		it('should render QR button', () => {
			render(<OptionsSummary {...defaultProps} />);
			expect(
				screen.getByRole('button', { name: /^qr$/i })
			).toBeInTheDocument();
		});

	});

	describe('QR Code toggle', () => {
		it('should not show QR code by default', () => {
			render(<OptionsSummary {...defaultProps} />);
			expect(
				screen.queryByRole('button', { name: /download qr code/i })
			).not.toBeInTheDocument();
		});

		it('should toggle QR code display when button is clicked', async () => {
			const user = userEvent.setup();
			render(<OptionsSummary {...defaultProps} />);

			const toggleButton = screen.getByRole('button', {
				name: /^qr$/i,
			});
			await user.click(toggleButton);

			expect(
				screen.getByRole('button', { name: /^hide qr$/i })
			).toBeInTheDocument();
			expect(
				screen.getByRole('button', { name: /download qr code/i })
			).toBeInTheDocument();
		});
	});

	describe('Copy functionality', () => {
		it('should show success feedback after copying', async () => {
			const user = userEvent.setup();
			render(<OptionsSummary {...defaultProps} />);

			const copyButton = screen.getByRole('button', { name: /copy/i });
			await user.click(copyButton);

			expect(
				screen.getByRole('button', { name: /copied/i })
			).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('should have accessible URL input with id', () => {
			render(<OptionsSummary {...defaultProps} />);
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute('id', 'shareable-url');
		});
	});
});
