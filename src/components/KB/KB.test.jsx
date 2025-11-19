import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import KB from './KB';

// Mock the react-simple-keyboard library
vi.mock('react-simple-keyboard', () => ({
	default: ({ onKeyPress, layoutName, layout }) => {
		// Check if shift keys are in the layout
		const hasShiftKeys = layout && layout.default && layout.default.some(row => row.includes('{shift}'));
		return (
			<div data-testid="keyboard" data-layout={layoutName} data-has-shift={hasShiftKeys}>
				<button onClick={() => onKeyPress('a')}>a</button>
				<button onClick={() => onKeyPress('Q')}>Q</button>
				{hasShiftKeys && <button onClick={() => onKeyPress('{shift}')}>{'{shift}'}</button>}
			</div>
		);
	},
}));

describe('KB Component', () => {
	let mockKeyCallback;

	beforeEach(() => {
		mockKeyCallback = vi.fn();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('Default Layout Rendering', () => {
		it('should render with default layout when no initialLayout prop is provided', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			const keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toBeInTheDocument();
			expect(keyboard).toHaveAttribute('data-layout', 'default');
		});

		it('should render keyboard with all expected buttons', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			expect(screen.getByText('a')).toBeInTheDocument();
			expect(screen.getByText('Q')).toBeInTheDocument();
			expect(screen.getByText('{shift}')).toBeInTheDocument();
		});
	});

	describe('Shift Layout Rendering', () => {
		it('should render with shift layout when initialLayout="shift" is provided', () => {
			render(<KB keyCallback={mockKeyCallback} initialLayout="shift" />);

			const keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'shift');
		});
	});

	describe('Key Callback Functionality', () => {
		it('should call keyCallback when a letter key is pressed', async () => {
			const user = userEvent.setup();
			render(<KB keyCallback={mockKeyCallback} />);

			const letterButton = screen.getByText('a');
			await user.click(letterButton);

			expect(mockKeyCallback).toHaveBeenCalledWith('a');
			expect(mockKeyCallback).toHaveBeenCalledTimes(1);
		});

		it('should call keyCallback when an uppercase letter key is pressed', async () => {
			const user = userEvent.setup();
			render(<KB keyCallback={mockKeyCallback} />);

			const letterButton = screen.getByText('Q');
			await user.click(letterButton);

			expect(mockKeyCallback).toHaveBeenCalledWith('Q');
			expect(mockKeyCallback).toHaveBeenCalledTimes(1);
		});

		it('should not call keyCallback when shift key is pressed', async () => {
			const user = userEvent.setup();
			render(<KB keyCallback={mockKeyCallback} />);

			const shiftButton = screen.getByText('{shift}');
			await user.click(shiftButton);

			expect(mockKeyCallback).not.toHaveBeenCalled();
		});
	});

	describe('Shift/Lock Keys Layout Toggle', () => {
		it('should toggle layout from default to shift when shift key is clicked', async () => {
			const user = userEvent.setup();
			render(<KB keyCallback={mockKeyCallback} />);

			let keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'default');

			const shiftButton = screen.getByText('{shift}');
			await user.click(shiftButton);

			keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'shift');
		});

		it('should toggle layout from shift to default when shift key is clicked again', async () => {
			const user = userEvent.setup();
			render(<KB keyCallback={mockKeyCallback} initialLayout="shift" />);

			let keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'shift');

			const shiftButton = screen.getByText('{shift}');
			await user.click(shiftButton);

			keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'default');
		});

		it('should toggle layout multiple times', async () => {
			const user = userEvent.setup();
			render(<KB keyCallback={mockKeyCallback} />);

			const shiftButton = screen.getByText('{shift}');
			let keyboard = screen.getByTestId('keyboard');

			expect(keyboard).toHaveAttribute('data-layout', 'default');

			await user.click(shiftButton);
			keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'shift');

			await user.click(shiftButton);
			keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'default');

			await user.click(shiftButton);
			keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'shift');
		});
	});

	describe('Physical Keyboard Events - Keydown', () => {
		it('should handle physical keyboard letter key press and call keyCallback', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			fireEvent.keyDown(window, { key: 'a' });

			expect(mockKeyCallback).toHaveBeenCalledWith('a');
			expect(mockKeyCallback).toHaveBeenCalledTimes(1);
		});

		it('should handle uppercase letter key press from physical keyboard', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			fireEvent.keyDown(window, { key: 'A' });

			expect(mockKeyCallback).toHaveBeenCalledWith('A');
			expect(mockKeyCallback).toHaveBeenCalledTimes(1);
		});

		it('should not call keyCallback for non-letter keys', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			fireEvent.keyDown(window, { key: '1' });
			fireEvent.keyDown(window, { key: ' ' });
			fireEvent.keyDown(window, { key: 'Enter' });

			expect(mockKeyCallback).not.toHaveBeenCalled();
		});

		it('should prevent default behavior for letter keys', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			const event = new KeyboardEvent('keydown', { key: 'a' });
			const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

			fireEvent(window, event);

			expect(preventDefaultSpy).toHaveBeenCalled();
		});
	});

	describe('Physical Keyboard Events - Keyup', () => {
		it('should handle physical keyboard keyup event', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			fireEvent.keyUp(window, { key: 'a' });

			// KeyUp for letter keys should not trigger callback
			expect(mockKeyCallback).not.toHaveBeenCalled();
		});
	});

	describe('Physical Keyboard Shift Key Toggle', () => {
		it('should toggle layout to shift when physical Shift key is pressed', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			let keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'default');

			fireEvent.keyDown(window, { key: 'Shift' });

			keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'shift');
		});

		it('should toggle layout back to default when physical Shift key is released', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			let keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'default');

			fireEvent.keyDown(window, { key: 'Shift' });
			keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'shift');

			fireEvent.keyUp(window, { key: 'Shift' });
			keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'default');
		});

		it('should not call keyCallback when Shift key is pressed', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			fireEvent.keyDown(window, { key: 'Shift' });

			expect(mockKeyCallback).not.toHaveBeenCalled();
		});
	});

	describe('Input/Textarea Element Handling', () => {
		it('should ignore keydown events when target is an input element', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			const input = document.createElement('input');
			document.body.appendChild(input);

			fireEvent.keyDown(input, { key: 'a' });

			expect(mockKeyCallback).not.toHaveBeenCalled();

			document.body.removeChild(input);
		});

		it('should ignore keydown events when target is a textarea element', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			const textarea = document.createElement('textarea');
			document.body.appendChild(textarea);

			fireEvent.keyDown(textarea, { key: 'a' });

			expect(mockKeyCallback).not.toHaveBeenCalled();

			document.body.removeChild(textarea);
		});

		it('should handle keydown events when target is not an input or textarea', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			const div = document.createElement('div');
			document.body.appendChild(div);

			fireEvent.keyDown(div, { key: 'a' });

			expect(mockKeyCallback).toHaveBeenCalledWith('a');

			document.body.removeChild(div);
		});
	});

	describe('Event Listener Cleanup', () => {
		it('should remove event listeners on component unmount', () => {
			const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
			const removeEventListenerSpy = vi.spyOn(
				window,
				'removeEventListener'
			);

			const { unmount } = render(<KB keyCallback={mockKeyCallback} />);

			expect(addEventListenerSpy).toHaveBeenCalledWith(
				'keydown',
				expect.any(Function)
			);
			expect(addEventListenerSpy).toHaveBeenCalledWith(
				'keyup',
				expect.any(Function)
			);

			unmount();

			expect(removeEventListenerSpy).toHaveBeenCalledWith(
				'keydown',
				expect.any(Function)
			);
			expect(removeEventListenerSpy).toHaveBeenCalledWith(
				'keyup',
				expect.any(Function)
			);

			addEventListenerSpy.mockRestore();
			removeEventListenerSpy.mockRestore();
		});

		it('should not call keyCallback after component is unmounted', () => {
			const { unmount } = render(<KB keyCallback={mockKeyCallback} />);

			unmount();

			fireEvent.keyDown(window, { key: 'a' });

			expect(mockKeyCallback).not.toHaveBeenCalled();
		});
	});

	describe('Integration Tests', () => {
		it('should handle a complete user interaction flow with virtual keyboard', async () => {
			const user = userEvent.setup();
			render(<KB keyCallback={mockKeyCallback} />);

			// Type a lowercase letter
			const letterButton = screen.getByText('a');
			await user.click(letterButton);
			expect(mockKeyCallback).toHaveBeenCalledWith('a');

			// Toggle shift
			const shiftButton = screen.getByText('{shift}');
			await user.click(shiftButton);
			const keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'shift');

			// Type an uppercase letter
			const upperButton = screen.getByText('Q');
			await user.click(upperButton);
			expect(mockKeyCallback).toHaveBeenCalledWith('Q');

			expect(mockKeyCallback).toHaveBeenCalledTimes(2);
		});

		it('should handle a complete user interaction flow with physical keyboard', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			let keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'default');

			// Press Shift
			fireEvent.keyDown(window, { key: 'Shift' });
			keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'shift');

			// Type a letter while shift is held
			fireEvent.keyDown(window, { key: 'A' });
			expect(mockKeyCallback).toHaveBeenCalledWith('A');

			// Release Shift
			fireEvent.keyUp(window, { key: 'Shift' });
			keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'default');

			// Type another letter
			fireEvent.keyDown(window, { key: 'b' });
			expect(mockKeyCallback).toHaveBeenCalledWith('b');

			expect(mockKeyCallback).toHaveBeenCalledTimes(2);
		});
	});

	describe('showShiftKeys Prop', () => {
		it('should show shift keys by default (showShiftKeys=true)', () => {
			render(<KB keyCallback={mockKeyCallback} />);

			const keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-has-shift', 'true');
			expect(screen.getByText('{shift}')).toBeInTheDocument();
		});

		it('should show shift keys when showShiftKeys is explicitly true', () => {
			render(<KB keyCallback={mockKeyCallback} showShiftKeys={true} />);

			const keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-has-shift', 'true');
			expect(screen.getByText('{shift}')).toBeInTheDocument();
		});

		it('should hide shift keys when showShiftKeys is false', () => {
			render(<KB keyCallback={mockKeyCallback} showShiftKeys={false} />);

			const keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-has-shift', 'false');
			expect(screen.queryByText('{shift}')).not.toBeInTheDocument();
		});

		it('should not respond to physical Shift key when showShiftKeys is false', () => {
			render(<KB keyCallback={mockKeyCallback} showShiftKeys={false} />);

			let keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'default');

			// Press Shift - should NOT change layout
			fireEvent.keyDown(window, { key: 'Shift' });
			keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'default');

			// Release Shift - should remain in default
			fireEvent.keyUp(window, { key: 'Shift' });
			keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-layout', 'default');
		});

		it('should still call keyCallback for letter keys when showShiftKeys is false', () => {
			render(<KB keyCallback={mockKeyCallback} showShiftKeys={false} />);

			fireEvent.keyDown(window, { key: 'a' });
			expect(mockKeyCallback).toHaveBeenCalledWith('a');

			fireEvent.keyDown(window, { key: 'Z' });
			expect(mockKeyCallback).toHaveBeenCalledWith('Z');
		});

		it('should work with twentyFourLetterAlphabet when showShiftKeys is false', () => {
			render(
				<KB
					keyCallback={mockKeyCallback}
					showShiftKeys={false}
					twentyFourLetterAlphabet={true}
				/>
			);

			const keyboard = screen.getByTestId('keyboard');
			expect(keyboard).toHaveAttribute('data-has-shift', 'false');
			expect(screen.queryByText('{shift}')).not.toBeInTheDocument();
		});

		it('should work with initialLayout="shift" when showShiftKeys is false', () => {
			render(
				<KB
					keyCallback={mockKeyCallback}
					showShiftKeys={false}
					initialLayout="shift"
				/>
			);

			const keyboard = screen.getByTestId('keyboard');
			// Should still respect initial layout for uppercase keys
			expect(keyboard).toHaveAttribute('data-layout', 'shift');
			// But should not have shift keys visible
			expect(keyboard).toHaveAttribute('data-has-shift', 'false');
		});
	});

	describe('24-Letter Alphabet Mode', () => {
		// Update mock to handle 24-letter alphabet layout
		beforeEach(() => {
			vi.resetModules();
			vi.mock('react-simple-keyboard', () => ({
				default: ({ onKeyPress, layoutName, layout }) => {
					const hasShiftKeys = layout && layout.default && layout.default.some(row => row.includes('{shift}'));
					return (
						<div data-testid="keyboard" data-layout={layoutName} data-has-shift={hasShiftKeys}>
							<button onClick={() => onKeyPress('a')}>a</button>
							<button onClick={() => onKeyPress('Q')}>Q</button>
							<button onClick={() => onKeyPress('i(j)')}>i(j)</button>
							<button onClick={() => onKeyPress('j(i)')}>j(i)</button>
							<button onClick={() => onKeyPress('u(v)')}>u(v)</button>
							<button onClick={() => onKeyPress('v(u)')}>v(u)</button>
							<button onClick={() => onKeyPress('I(J)')}>I(J)</button>
							<button onClick={() => onKeyPress('J(I)')}>J(I)</button>
							<button onClick={() => onKeyPress('U(V)')}>U(V)</button>
							<button onClick={() => onKeyPress('V(U)')}>V(U)</button>
							{hasShiftKeys && <button onClick={() => onKeyPress('{shift}')}>{'{shift}'}</button>}
						</div>
					);
				},
			}));
		});

		describe('Paired Letter Display', () => {
			it('should display i(j) on the i key in lowercase layout', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} />);

				expect(screen.getByText('i(j)')).toBeInTheDocument();
			});

			it('should display j(i) on the j key in lowercase layout', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} />);

				expect(screen.getByText('j(i)')).toBeInTheDocument();
			});

			it('should display u(v) on the u key in lowercase layout', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} />);

				expect(screen.getByText('u(v)')).toBeInTheDocument();
			});

			it('should display v(u) on the v key in lowercase layout', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} />);

				expect(screen.getByText('v(u)')).toBeInTheDocument();
			});

			it('should display I(J) on the I key in uppercase layout', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} initialLayout="shift" />);

				expect(screen.getByText('I(J)')).toBeInTheDocument();
			});

			it('should display J(I) on the J key in uppercase layout', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} initialLayout="shift" />);

				expect(screen.getByText('J(I)')).toBeInTheDocument();
			});

			it('should display U(V) on the U key in uppercase layout', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} initialLayout="shift" />);

				expect(screen.getByText('U(V)')).toBeInTheDocument();
			});

			it('should display V(U) on the V key in uppercase layout', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} initialLayout="shift" />);

				expect(screen.getByText('V(U)')).toBeInTheDocument();
			});
		});

		describe('Paired Letter Normalization - Lowercase', () => {
			it('should normalize "i(j)" to "i" when i key is pressed', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} />);

				const iButton = screen.getByText('i(j)');
				await user.click(iButton);

				expect(mockKeyCallback).toHaveBeenCalledWith('i');
				expect(mockKeyCallback).toHaveBeenCalledTimes(1);
			});

			it('should normalize "j(i)" to "j" when j key is pressed', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} />);

				const jButton = screen.getByText('j(i)');
				await user.click(jButton);

				expect(mockKeyCallback).toHaveBeenCalledWith('j');
				expect(mockKeyCallback).toHaveBeenCalledTimes(1);
			});

			it('should normalize "u(v)" to "u" when u key is pressed', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} />);

				const uButton = screen.getByText('u(v)');
				await user.click(uButton);

				expect(mockKeyCallback).toHaveBeenCalledWith('u');
				expect(mockKeyCallback).toHaveBeenCalledTimes(1);
			});

			it('should normalize "v(u)" to "v" when v key is pressed', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} />);

				const vButton = screen.getByText('v(u)');
				await user.click(vButton);

				expect(mockKeyCallback).toHaveBeenCalledWith('v');
				expect(mockKeyCallback).toHaveBeenCalledTimes(1);
			});
		});

		describe('Paired Letter Normalization - Uppercase', () => {
			it('should normalize "I(J)" to "I" when I key is pressed in shift layout', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} initialLayout="shift" />);

				const iButton = screen.getByText('I(J)');
				await user.click(iButton);

				expect(mockKeyCallback).toHaveBeenCalledWith('I');
				expect(mockKeyCallback).toHaveBeenCalledTimes(1);
			});

			it('should normalize "J(I)" to "J" when J key is pressed in shift layout', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} initialLayout="shift" />);

				const jButton = screen.getByText('J(I)');
				await user.click(jButton);

				expect(mockKeyCallback).toHaveBeenCalledWith('J');
				expect(mockKeyCallback).toHaveBeenCalledTimes(1);
			});

			it('should normalize "U(V)" to "U" when U key is pressed in shift layout', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} initialLayout="shift" />);

				const uButton = screen.getByText('U(V)');
				await user.click(uButton);

				expect(mockKeyCallback).toHaveBeenCalledWith('U');
				expect(mockKeyCallback).toHaveBeenCalledTimes(1);
			});

			it('should normalize "V(U)" to "V" when V key is pressed in shift layout', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} initialLayout="shift" />);

				const vButton = screen.getByText('V(U)');
				await user.click(vButton);

				expect(mockKeyCallback).toHaveBeenCalledWith('V');
				expect(mockKeyCallback).toHaveBeenCalledTimes(1);
			});
		});

		describe('Layout Switching with Paired Letters', () => {
			it('should switch from lowercase paired letters to uppercase paired letters when shift is pressed', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} />);

				let keyboard = screen.getByTestId('keyboard');
				expect(keyboard).toHaveAttribute('data-layout', 'default');
				expect(screen.getByText('i(j)')).toBeInTheDocument();

				const shiftButton = screen.getByText('{shift}');
				await user.click(shiftButton);

				keyboard = screen.getByTestId('keyboard');
				expect(keyboard).toHaveAttribute('data-layout', 'shift');
				expect(screen.getByText('I(J)')).toBeInTheDocument();
			});

			it('should switch from uppercase paired letters to lowercase paired letters when shift is pressed', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} initialLayout="shift" />);

				let keyboard = screen.getByTestId('keyboard');
				expect(keyboard).toHaveAttribute('data-layout', 'shift');
				expect(screen.getByText('I(J)')).toBeInTheDocument();

				const shiftButton = screen.getByText('{shift}');
				await user.click(shiftButton);

				keyboard = screen.getByTestId('keyboard');
				expect(keyboard).toHaveAttribute('data-layout', 'default');
				expect(screen.getByText('i(j)')).toBeInTheDocument();
			});
		});

		describe('Non-Paired Letters in 24-Letter Mode', () => {
			it('should still handle regular letters normally in 24-letter mode', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} />);

				const aButton = screen.getByText('a');
				await user.click(aButton);

				expect(mockKeyCallback).toHaveBeenCalledWith('a');
				expect(mockKeyCallback).toHaveBeenCalledTimes(1);
			});

			it('should still handle regular uppercase letters normally in 24-letter mode', async () => {
				const user = userEvent.setup();
				render(<KB keyCallback={mockKeyCallback} twentyFourLetterAlphabet={true} initialLayout="shift" />);

				const qButton = screen.getByText('Q');
				await user.click(qButton);

				expect(mockKeyCallback).toHaveBeenCalledWith('Q');
				expect(mockKeyCallback).toHaveBeenCalledTimes(1);
			});
		});

		describe('Integration: 24-Letter Alphabet with showShiftKeys', () => {
			it('should work with twentyFourLetterAlphabet and showShiftKeys=false', () => {
				render(
					<KB
						keyCallback={mockKeyCallback}
						twentyFourLetterAlphabet={true}
						showShiftKeys={false}
					/>
				);

				const keyboard = screen.getByTestId('keyboard');
				expect(keyboard).toHaveAttribute('data-has-shift', 'false');
				expect(screen.queryByText('{shift}')).not.toBeInTheDocument();
				expect(screen.getByText('i(j)')).toBeInTheDocument();
			});

			it('should normalize paired letters correctly with showShiftKeys=false', async () => {
				const user = userEvent.setup();
				render(
					<KB
						keyCallback={mockKeyCallback}
						twentyFourLetterAlphabet={true}
						showShiftKeys={false}
					/>
				);

				const iButton = screen.getByText('i(j)');
				await user.click(iButton);

				expect(mockKeyCallback).toHaveBeenCalledWith('i');
			});
		});
	});
});
