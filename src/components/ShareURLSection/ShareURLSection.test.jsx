import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareURLSection from './ShareURLSection';

// Mock window.location
const mockLocation = {
	origin: 'http://localhost:3000',
	pathname: '/Sharpie/',
};

describe('ShareURLSection', () => {
	const mockOptions = {
		mode: 'both',
		enabledAlphabets: { standard: true },
		numLetters: true,
		showBaseline: false,
	};

	beforeEach(() => {
		Object.defineProperty(window, 'location', {
			value: mockLocation,
			writable: true,
		});
	});

	describe('Rendering', () => {
		it('should render the section title', () => {
			render(<ShareURLSection options={mockOptions} />);
			expect(
				screen.getByRole('heading', { name: 'Share settings' })
			).toBeInTheDocument();
		});

		it('should render markdown description', () => {
			render(<ShareURLSection options={mockOptions} />);
			expect(
				screen.getByText(/Share your settings with others/i)
			).toBeInTheDocument();
		});

		it('should render shareable URL input', () => {
			render(<ShareURLSection options={mockOptions} />);
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute('readonly');
		});

		it('should render Copy button', () => {
			render(<ShareURLSection options={mockOptions} />);
			expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
		});

		it('should render QR button', () => {
			render(<ShareURLSection options={mockOptions} />);
			expect(screen.getByRole('button', { name: 'QR' })).toBeInTheDocument();
		});

		it('should not show QR code by default', () => {
			render(<ShareURLSection options={mockOptions} />);
			expect(screen.queryByRole('button', { name: 'Download' })).not.toBeInTheDocument();
		});
	});

	describe('URL Generation', () => {
		it('should generate URL with serialized options', () => {
			render(<ShareURLSection options={mockOptions} />);
			const input = screen.getByRole('textbox');
			expect(input.value).toContain('http://localhost:3000/Sharpie/');
			expect(input.value).toContain('m=');
		});

		it('should generate base URL when options are defaults', () => {
			const defaultOptions = {
				mode: 'both',
				enabledAlphabets: {},
				numLetters: true,
				showBaseline: false,
			};
			render(<ShareURLSection options={defaultOptions} />);
			const input = screen.getByRole('textbox');
			expect(input.value).toBeTruthy();
		});
	});

	describe('Copy Functionality', () => {
		it('should show "Copied!" after clicking Copy button', async () => {
			const user = userEvent.setup();
			const mockWriteText = vi.fn().mockResolvedValue(undefined);
			Object.assign(navigator, {
				clipboard: {
					writeText: mockWriteText,
				},
			});

			render(<ShareURLSection options={mockOptions} />);
			const copyButton = screen.getByRole('button', { name: 'Copy' });

			await user.click(copyButton);

			await waitFor(() => {
				expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
			});
		});

		it('should copy URL to clipboard', async () => {
			const user = userEvent.setup();
			const mockWriteText = vi.fn().mockResolvedValue(undefined);
			Object.assign(navigator, {
				clipboard: {
					writeText: mockWriteText,
				},
			});

			render(<ShareURLSection options={mockOptions} />);
			const copyButton = screen.getByRole('button', { name: 'Copy' });

			await user.click(copyButton);

			expect(mockWriteText).toHaveBeenCalledTimes(1);
			expect(mockWriteText).toHaveBeenCalledWith(
				expect.stringContaining('http://localhost:3000/Sharpie/')
			);
		});

		it('should revert to "Copy" after 2 seconds', async () => {
			vi.useFakeTimers();
			const user = userEvent.setup({ delay: null });
			const mockWriteText = vi.fn().mockResolvedValue(undefined);
			Object.assign(navigator, {
				clipboard: {
					writeText: mockWriteText,
				},
			});

			render(<ShareURLSection options={mockOptions} />);
			const copyButton = screen.getByRole('button', { name: 'Copy' });

			await user.click(copyButton);

			await waitFor(() => {
				expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
			});

			vi.advanceTimersByTime(2000);

			await waitFor(() => {
				expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
			});

			vi.useRealTimers();
		});
	});

	describe('QR Code Functionality', () => {
		it('should show QR code when QR button is clicked', async () => {
			const user = userEvent.setup();
			render(<ShareURLSection options={mockOptions} />);

			const qrButton = screen.getByRole('button', { name: 'QR' });
			await user.click(qrButton);

			expect(screen.getByRole('button', { name: 'Hide QR' })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
		});

		it('should hide QR code when Hide QR button is clicked', async () => {
			const user = userEvent.setup();
			render(<ShareURLSection options={mockOptions} />);

			const qrButton = screen.getByRole('button', { name: 'QR' });
			await user.click(qrButton);

			const hideButton = screen.getByRole('button', { name: 'Hide QR' });
			await user.click(hideButton);

			expect(screen.getByRole('button', { name: 'QR' })).toBeInTheDocument();
			expect(screen.queryByRole('button', { name: 'Download' })).not.toBeInTheDocument();
		});
	});

	describe('Input Interaction', () => {
		it('should select text when input is clicked', async () => {
			const user = userEvent.setup();
			render(<ShareURLSection options={mockOptions} />);

			const input = screen.getByRole('textbox');
			await user.click(input);

			expect(input.selectionStart).toBe(0);
			expect(input.selectionEnd).toBe(input.value.length);
		});
	});
});
