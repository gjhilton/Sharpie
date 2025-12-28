import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input, Textarea } from './Input';

describe('Input', () => {
	describe('Rendering', () => {
		it('should render an input element', () => {
			render(<Input id="test-input" name="test" />);
			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
		});

		it('should render with correct id', () => {
			render(<Input id="test-input" name="test" />);
			expect(screen.getByRole('textbox')).toHaveAttribute(
				'id',
				'test-input'
			);
		});

		it('should render with correct name', () => {
			render(<Input id="test-input" name="test-name" />);
			expect(screen.getByRole('textbox')).toHaveAttribute(
				'name',
				'test-name'
			);
		});

		it('should render with correct type', () => {
			render(<Input id="test-input" name="test" type="email" />);
			expect(screen.getByRole('textbox')).toHaveAttribute(
				'type',
				'email'
			);
		});

		it('should default to type text', () => {
			render(<Input id="test-input" name="test" />);
			expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
		});
	});

	describe('Attributes', () => {
		it('should render as required when required prop is true', () => {
			render(<Input id="test-input" name="test" required />);
			expect(screen.getByRole('textbox')).toBeRequired();
		});

		it('should not be required by default', () => {
			render(<Input id="test-input" name="test" />);
			expect(screen.getByRole('textbox')).not.toBeRequired();
		});

		it('should render as readOnly when readOnly prop is true', () => {
			render(<Input id="test-input" name="test" readOnly />);
			expect(screen.getByRole('textbox')).toHaveAttribute('readOnly');
		});

		it('should render with value', () => {
			render(
				<Input
					id="test-input"
					name="test"
					value="test value"
					readOnly
				/>
			);
			expect(screen.getByRole('textbox')).toHaveValue('test value');
		});
	});

	describe('Event Handlers', () => {
		it('should call onClick when clicked', async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(<Input id="test-input" name="test" onClick={handleClick} />);

			await user.click(screen.getByRole('textbox'));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it('should call onFocus when focused', async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();
			render(<Input id="test-input" name="test" onFocus={handleFocus} />);

			await user.click(screen.getByRole('textbox'));
			expect(handleFocus).toHaveBeenCalledTimes(1);
		});

		it('should call onTouchStart when touched', async () => {
			const handleTouchStart = vi.fn();
			render(
				<Input
					id="test-input"
					name="test"
					onTouchStart={handleTouchStart}
				/>
			);

			const input = screen.getByRole('textbox');
			input.dispatchEvent(
				new TouchEvent('touchstart', { bubbles: true })
			);
			expect(handleTouchStart).toHaveBeenCalledTimes(1);
		});
	});

	describe('Custom Styles', () => {
		it('should accept custom width style', () => {
			render(<Input id="test-input" name="test" width="50%" />);
			// Style prop is passed through to css function
			expect(screen.getByRole('textbox')).toBeInTheDocument();
		});

		it('should accept custom fontSize style', () => {
			render(<Input id="test-input" name="test" fontSize="xl" />);
			expect(screen.getByRole('textbox')).toBeInTheDocument();
		});
	});
});

describe('Textarea', () => {
	describe('Rendering', () => {
		it('should render a textarea element', () => {
			render(<Textarea id="test-textarea" name="test" />);
			const textarea = screen.getByRole('textbox');
			expect(textarea).toBeInTheDocument();
			expect(textarea.tagName).toBe('TEXTAREA');
		});

		it('should render with correct id', () => {
			render(<Textarea id="test-textarea" name="test" />);
			expect(screen.getByRole('textbox')).toHaveAttribute(
				'id',
				'test-textarea'
			);
		});

		it('should render with correct name', () => {
			render(<Textarea id="test-textarea" name="test-name" />);
			expect(screen.getByRole('textbox')).toHaveAttribute(
				'name',
				'test-name'
			);
		});

		it('should render with 6 rows by default', () => {
			render(<Textarea id="test-textarea" name="test" />);
			expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6');
		});
	});

	describe('Attributes', () => {
		it('should render as required when required prop is true', () => {
			render(<Textarea id="test-textarea" name="test" required />);
			expect(screen.getByRole('textbox')).toBeRequired();
		});

		it('should not be required by default', () => {
			render(<Textarea id="test-textarea" name="test" />);
			expect(screen.getByRole('textbox')).not.toBeRequired();
		});
	});

	describe('Custom Styles', () => {
		it('should accept custom styles', () => {
			render(
				<Textarea id="test-textarea" name="test" minHeight="200px" />
			);
			expect(screen.getByRole('textbox')).toBeInTheDocument();
		});
	});
});
