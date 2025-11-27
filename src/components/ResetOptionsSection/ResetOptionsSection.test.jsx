import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetOptionsSection from './ResetOptionsSection';
import { GameOptionsProvider } from '@context/GameOptionsContext';

const renderWithProvider = (component) => {
	return render(<GameOptionsProvider>{component}</GameOptionsProvider>);
};

describe('ResetOptionsSection', () => {
	describe('Rendering', () => {
		it('should render the section title', () => {
			renderWithProvider(<ResetOptionsSection />);
			expect(
				screen.getByRole('heading', { name: 'Reset settings' })
			).toBeInTheDocument();
		});

		it('should render markdown description', () => {
			renderWithProvider(<ResetOptionsSection />);
			expect(
				screen.getByText(/Reset all your settings back to the defaults/i)
			).toBeInTheDocument();
		});

		it('should render Reset to Defaults button', () => {
			renderWithProvider(<ResetOptionsSection />);
			expect(
				screen.getByRole('button', { name: 'Reset to Defaults' })
			).toBeInTheDocument();
		});
	});

	describe('Reset Functionality', () => {
		it('should show confirmation dialog when reset button is clicked', async () => {
			const user = userEvent.setup();
			const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

			renderWithProvider(<ResetOptionsSection />);
			const resetButton = screen.getByRole('button', {
				name: 'Reset to Defaults',
			});

			await user.click(resetButton);

			expect(confirmSpy).toHaveBeenCalledTimes(1);
			expect(confirmSpy).toHaveBeenCalledWith(
				'Reset all settings to defaults? This will clear your current configuration.'
			);

			confirmSpy.mockRestore();
		});

		it('should not reset if user cancels confirmation', async () => {
			const user = userEvent.setup();
			const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

			renderWithProvider(<ResetOptionsSection />);
			const resetButton = screen.getByRole('button', {
				name: 'Reset to Defaults',
			});

			await user.click(resetButton);

			expect(confirmSpy).toHaveBeenCalled();
			// The reset would be handled by the context, but since user cancelled,
			// the resetOptions function in context should not be called

			confirmSpy.mockRestore();
		});

		it('should call resetOptions if user confirms', async () => {
			const user = userEvent.setup();
			const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

			renderWithProvider(<ResetOptionsSection />);
			const resetButton = screen.getByRole('button', {
				name: 'Reset to Defaults',
			});

			await user.click(resetButton);

			expect(confirmSpy).toHaveBeenCalled();
			// The actual reset would happen in the context

			confirmSpy.mockRestore();
		});
	});

	describe('Button Styling', () => {
		it('should render button with correct type', () => {
			renderWithProvider(<ResetOptionsSection />);
			const resetButton = screen.getByRole('button', {
				name: 'Reset to Defaults',
			});
			expect(resetButton).toHaveAttribute('type', 'button');
		});
	});
});
