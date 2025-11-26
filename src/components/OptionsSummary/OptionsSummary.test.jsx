import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptionsSummary from './OptionsSummary';

// Mock the GameOptionsContext
const mockResetOptions = vi.fn();
vi.mock('@context/GameOptionsContext.jsx', () => ({
	useGameOptionsContext: () => ({
		resetOptions: mockResetOptions,
	}),
}));

describe('OptionsSummary', () => {
	const defaultOptions = {
		mode: 'all',
		enabledAlphabets: { 'BeauChesne-Baildon': true, Hill: true },
		twentyFourLetterAlphabet: true,
		showBaseline: true,
	};

	describe('Badge rendering', () => {
		it('should render mode badge as "ALL" when mode is all', () => {
			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);
			expect(screen.getByText('ALL')).toBeInTheDocument();
		});

		it('should render mode badge as "minuscules only" when mode is minuscule', () => {
			const options = { ...defaultOptions, mode: 'minuscule' };
			render(<OptionsSummary options={options} alphabetCount={2} />);
			expect(screen.getByText('minuscules only')).toBeInTheDocument();
		});

		it('should render mode badge as "MAJUSCULES only" when mode is majuscule', () => {
			const options = { ...defaultOptions, mode: 'majuscule' };
			render(<OptionsSummary options={options} alphabetCount={2} />);
			expect(screen.getByText('MAJUSCULES only')).toBeInTheDocument();
		});

		it('should render alphabet count badge with plural', () => {
			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);
			expect(screen.getByText('2 alphabets')).toBeInTheDocument();
		});

		it('should render alphabet count badge with singular', () => {
			render(
				<OptionsSummary options={defaultOptions} alphabetCount={1} />
			);
			expect(screen.getByText('1 alphabet')).toBeInTheDocument();
		});

		it('should render 24 letters badge when twentyFourLetterAlphabet is true', () => {
			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);
			expect(screen.getByText('24 letters')).toBeInTheDocument();
		});

		it('should render 26 letters badge when twentyFourLetterAlphabet is false', () => {
			const options = {
				...defaultOptions,
				twentyFourLetterAlphabet: false,
			};
			render(<OptionsSummary options={options} alphabetCount={2} />);
			expect(screen.getByText('26 letters')).toBeInTheDocument();
		});

		it('should render Baselines ON badge when showBaseline is true', () => {
			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);
			expect(screen.getByText('Baselines ON')).toBeInTheDocument();
		});

		it('should render Baselines OFF badge when showBaseline is false', () => {
			const options = { ...defaultOptions, showBaseline: false };
			render(<OptionsSummary options={options} alphabetCount={2} />);
			expect(screen.getByText('Baselines OFF')).toBeInTheDocument();
		});
	});

	describe('URL display', () => {
		it('should display shareable URL input', () => {
			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);
			const input = screen.getByLabelText('Shareable link:');
			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute('readonly');
		});

		it('should generate URL containing origin', () => {
			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);
			const input = screen.getByLabelText('Shareable link:');
			expect(input.value).toContain(window.location.origin);
		});
	});

	describe('Button rendering', () => {
		it('should render Copy button', () => {
			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);
			expect(
				screen.getByRole('button', { name: /copy/i })
			).toBeInTheDocument();
		});

		it('should render Show QR Code button', () => {
			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);
			expect(
				screen.getByRole('button', { name: /show qr code/i })
			).toBeInTheDocument();
		});

		it('should render Reset to Defaults button', () => {
			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);
			expect(
				screen.getByRole('button', { name: /reset to defaults/i })
			).toBeInTheDocument();
		});
	});

	describe('QR Code toggle', () => {
		it('should not show QR code by default', () => {
			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);
			expect(
				screen.queryByRole('button', { name: /download qr code/i })
			).not.toBeInTheDocument();
		});

		it('should toggle QR code display when button is clicked', async () => {
			const user = userEvent.setup();
			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);

			const toggleButton = screen.getByRole('button', {
				name: /show qr code/i,
			});
			await user.click(toggleButton);

			expect(
				screen.getByRole('button', { name: /hide qr code/i })
			).toBeInTheDocument();
			expect(
				screen.getByRole('button', { name: /download qr code/i })
			).toBeInTheDocument();
		});
	});

	describe('Copy functionality', () => {
		it('should show success feedback after copying', async () => {
			const user = userEvent.setup();
			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);

			const copyButton = screen.getByRole('button', { name: /copy/i });
			await user.click(copyButton);

			expect(
				screen.getByRole('button', { name: /copied/i })
			).toBeInTheDocument();
		});
	});

	describe('Reset functionality', () => {
		it('should call resetOptions when confirmed', async () => {
			const user = userEvent.setup();
			const confirmSpy = vi
				.spyOn(window, 'confirm')
				.mockReturnValue(true);
			mockResetOptions.mockClear();

			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);

			const resetButton = screen.getByRole('button', {
				name: /reset to defaults/i,
			});
			await user.click(resetButton);

			expect(confirmSpy).toHaveBeenCalled();
			expect(mockResetOptions).toHaveBeenCalled();

			confirmSpy.mockRestore();
		});

		it('should not call resetOptions when cancelled', async () => {
			const user = userEvent.setup();
			const confirmSpy = vi
				.spyOn(window, 'confirm')
				.mockReturnValue(false);
			mockResetOptions.mockClear();

			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);

			const resetButton = screen.getByRole('button', {
				name: /reset to defaults/i,
			});
			await user.click(resetButton);

			expect(confirmSpy).toHaveBeenCalled();
			expect(mockResetOptions).not.toHaveBeenCalled();

			confirmSpy.mockRestore();
		});
	});

	describe('Accessibility', () => {
		it('should have accessible label for URL input', () => {
			render(
				<OptionsSummary options={defaultOptions} alphabetCount={2} />
			);
			const input = screen.getByLabelText('Shareable link:');
			expect(input).toBeInTheDocument();
		});
	});
});
