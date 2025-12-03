import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputWithButton } from './InputWithButton';

describe('InputWithButton', () => {
	describe('Rendering', () => {
		it('should render an input and button', () => {
			render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					buttonLabel="Click"
					buttonOnClick={vi.fn()}
				/>
			);

			expect(screen.getByRole('textbox')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
		});

		it('should render with input value', () => {
			render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					inputValue="test value"
					buttonLabel="Click"
					buttonOnClick={vi.fn()}
				/>
			);

			expect(screen.getByRole('textbox')).toHaveValue('test value');
		});

		it('should render button with correct label', () => {
			render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					buttonLabel="Copy"
					buttonOnClick={vi.fn()}
				/>
			);

			expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
		});

		it('should render button with active label when active', () => {
			render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					buttonLabel="Copied!"
					buttonOnClick={vi.fn()}
					buttonActive
				/>
			);

			expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
		});
	});

	describe('Input Attributes', () => {
		it('should render input as readOnly when readOnly prop is true', () => {
			render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					inputReadOnly
					buttonLabel="Click"
					buttonOnClick={vi.fn()}
				/>
			);

			expect(screen.getByRole('textbox')).toHaveAttribute('readOnly');
		});

		it('should render input with correct type', () => {
			render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					inputType="email"
					buttonLabel="Click"
					buttonOnClick={vi.fn()}
				/>
			);

			expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
		});

		it('should default to type text', () => {
			render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					buttonLabel="Click"
					buttonOnClick={vi.fn()}
				/>
			);

			expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
		});
	});

	describe('Event Handlers', () => {
		it('should call inputOnClick when input is clicked', async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();

			render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					inputOnClick={handleClick}
					buttonLabel="Click"
					buttonOnClick={vi.fn()}
				/>
			);

			await user.click(screen.getByRole('textbox'));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it('should call inputOnFocus when input is focused', async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();

			render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					inputOnFocus={handleFocus}
					buttonLabel="Click"
					buttonOnClick={vi.fn()}
				/>
			);

			await user.click(screen.getByRole('textbox'));
			expect(handleFocus).toHaveBeenCalledTimes(1);
		});

		it('should call buttonOnClick when button is clicked', async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();

			render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					buttonLabel="Copy"
					buttonOnClick={handleClick}
				/>
			);

			await user.click(screen.getByRole('button', { name: 'Copy' }));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it('should call inputOnTouchStart when input is touched', () => {
			const handleTouchStart = vi.fn();

			render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					inputOnTouchStart={handleTouchStart}
					buttonLabel="Click"
					buttonOnClick={vi.fn()}
				/>
			);

			const input = screen.getByRole('textbox');
			input.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
			expect(handleTouchStart).toHaveBeenCalledTimes(1);
		});
	});

	describe('Styling', () => {
		it('should apply monospace font family', () => {
			render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					fontFamily="monospace"
					buttonLabel="Click"
					buttonOnClick={vi.fn()}
				/>
			);

			expect(screen.getByRole('textbox')).toBeInTheDocument();
		});

		it('should apply custom font size', () => {
			render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					fontSize="s"
					buttonLabel="Click"
					buttonOnClick={vi.fn()}
				/>
			);

			expect(screen.getByRole('textbox')).toBeInTheDocument();
			expect(screen.getByRole('button')).toBeInTheDocument();
		});

		it('should apply cursor style', () => {
			render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					cursor="text"
					buttonLabel="Click"
					buttonOnClick={vi.fn()}
				/>
			);

			expect(screen.getByRole('textbox')).toBeInTheDocument();
		});
	});

	describe('Layout', () => {
		it('should render input and button in the same container', () => {
			const { container } = render(
				<InputWithButton
					inputId="test-input"
					inputName="test"
					buttonLabel="Click"
					buttonOnClick={vi.fn()}
				/>
			);

			const flexContainer = container.firstChild;
			expect(flexContainer.childNodes).toHaveLength(2);
			expect(flexContainer.childNodes[0]).toBe(screen.getByRole('textbox'));
			expect(flexContainer.childNodes[1]).toBe(screen.getByRole('button'));
		});
	});
});
