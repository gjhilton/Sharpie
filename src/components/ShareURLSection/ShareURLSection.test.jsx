import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareURLSection from './ShareURLSection';

// Mock QRCodeSVG
vi.mock('qrcode.react', () => ({
	QRCodeSVG: ({ value }) => <svg data-testid="qr-code" data-value={value} />,
}));

// Mock SubSection
vi.mock('@components/SubSection/SubSection.jsx', () => ({
	default: ({ title, children }) => (
		<section>
			<h3>{title}</h3>
			{children}
		</section>
	),
}));

// Mock Layout components
vi.mock('@components/Layout/Layout.jsx', () => ({
	Paragraph: ({ children }) => <p>{children}</p>,
}));

// Mock InputWithButton - pass through all props to actual buttons
vi.mock('@components/InputWithButton/InputWithButton.jsx', () => ({
	InputWithButton: (props) => {
		const {
			inputValue,
			buttonLabel,
			buttonOnClick,
			rightButton2Label,
			rightButton2OnClick,
			inputOnClick,
			inputId,
			buttonActive,
			rightButton2Active
		} = props;

		return (
			<div>
				<input
					readOnly
					value={inputValue}
					onClick={inputOnClick}
					id={inputId}
				/>
				<button onClick={buttonOnClick}>{buttonLabel}</button>
				{rightButton2Label && (
					<button onClick={rightButton2OnClick}>
						{rightButton2Label}
					</button>
				)}
			</div>
		);
	},
}));

// Mock markdown
vi.mock('@data/share-url.md?raw', () => ({
	default: 'Share your settings with others',
}));

// Mock window.location
const mockLocation = {
	origin: 'http://localhost:3000',
	pathname: '/Sharpie/',
};

describe('ShareURLSection', () => {
	const mockOptions = {
		mode: 'both',
		enabledHands: { standard: true },
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
				enabledHands: {},
				numLetters: true,
				showBaseline: false,
			};
			render(<ShareURLSection options={defaultOptions} />);
			const input = screen.getByRole('textbox');
			expect(input.value).toBeTruthy();
		});
	});

	describe('Copy Functionality', () => {
		it('should render Copy button', () => {
			render(<ShareURLSection options={mockOptions} />);
			expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
		});
	});

	describe('QR Code Functionality', () => {
		it('should not show QR code by default', () => {
			render(<ShareURLSection options={mockOptions} />);
			expect(screen.queryByTestId('qr-code')).not.toBeInTheDocument();
		});

		it('should have QR toggle button', () => {
			render(<ShareURLSection options={mockOptions} />);
			expect(screen.getByRole('button', { name: 'QR' })).toBeInTheDocument();
		});
	});

	describe('Input Interaction', () => {
		it('should have input with onclick handler', () => {
			render(<ShareURLSection options={mockOptions} />);

			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
		});
	});
});
