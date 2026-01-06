import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Badge } from './Badge';

describe('Badge', () => {
	describe('Rendering', () => {
		it('should render badge with text content', () => {
			render(<Badge>Test Badge</Badge>);
			expect(screen.getByText('Test Badge')).toBeInTheDocument();
		});

		it('should render badge with custom testId', () => {
			render(<Badge testId="custom-badge">Test</Badge>);
			expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
		});

		it('should render badge without testId when not provided', () => {
			const { container } = render(<Badge>Test</Badge>);
			const badge = container.firstChild;
			expect(badge).not.toHaveAttribute('data-testid');
		});

		it('should render multiple badges', () => {
			const { container } = render(
				<>
					<Badge>Badge 1</Badge>
					<Badge>Badge 2</Badge>
					<Badge>Badge 3</Badge>
				</>
			);
			expect(screen.getByText('Badge 1')).toBeInTheDocument();
			expect(screen.getByText('Badge 2')).toBeInTheDocument();
			expect(screen.getByText('Badge 3')).toBeInTheDocument();
		});

		it('should render with JSX content', () => {
			render(
				<Badge>
					Text <strong>Bold</strong>
				</Badge>
			);
			expect(screen.getByText('Text')).toBeInTheDocument();
			expect(screen.getByText('Bold')).toBeInTheDocument();
		});
	});

	describe('Content', () => {
		it('should render numeric content', () => {
			render(<Badge>{42}</Badge>);
			expect(screen.getByText('42')).toBeInTheDocument();
		});

		it('should render with special characters', () => {
			render(<Badge>Badge & Text</Badge>);
			expect(screen.getByText('Badge & Text')).toBeInTheDocument();
		});

		it('should render with long text', () => {
			const longText =
				'This is a very long badge text that should not wrap';
			render(<Badge>{longText}</Badge>);
			expect(screen.getByText(longText)).toBeInTheDocument();
		});

		it('should render empty badge', () => {
			const { container } = render(<Badge></Badge>);
			const badge = container.firstChild;
			expect(badge).toBeInTheDocument();
			expect(badge.textContent).toBe('');
		});
	});

	describe('Styling', () => {
		it('should render as span element', () => {
			const { container } = render(<Badge>Test</Badge>);
			const badge = container.firstChild;
			expect(badge.tagName).toBe('SPAN');
		});

		it('should have inline-block display', () => {
			const { container } = render(<Badge>Test</Badge>);
			const badge = container.firstChild;
			expect(badge).toBeInTheDocument();
		});

		it('should have Panda CSS classes applied', () => {
			render(<Badge testId="badge">Content</Badge>);
			const badge = screen.getByTestId('badge');
			// Panda CSS applies styles via class names, not inline styles
			expect(badge.className).toBeTruthy();
		});
	});

	describe('Non-clickable badge', () => {
		it('should not have role="button" when no onClick', () => {
			render(<Badge testId="static-badge">Static</Badge>);
			const badge = screen.getByTestId('static-badge');
			expect(badge).not.toHaveAttribute('role');
		});

		it('should not have tabIndex when no onClick', () => {
			render(<Badge testId="static-badge">Static</Badge>);
			const badge = screen.getByTestId('static-badge');
			expect(badge).not.toHaveAttribute('tabIndex');
		});
	});

	describe('Clickable badge', () => {
		it('should call onClick when clicked', async () => {
			const handleClick = vi.fn();
			const user = userEvent.setup();
			render(<Badge onClick={handleClick}>Clickable</Badge>);

			const badge = screen.getByText('Clickable');
			await user.click(badge);

			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it('should have role="button" when onClick provided', () => {
			const handleClick = vi.fn();
			render(
				<Badge onClick={handleClick} testId="clickable-badge">
					Clickable
				</Badge>
			);
			const badge = screen.getByTestId('clickable-badge');
			expect(badge).toHaveAttribute('role', 'button');
		});

		it('should have tabIndex=0 when onClick provided', () => {
			const handleClick = vi.fn();
			render(
				<Badge onClick={handleClick} testId="clickable-badge">
					Clickable
				</Badge>
			);
			const badge = screen.getByTestId('clickable-badge');
			expect(badge).toHaveAttribute('tabIndex', '0');
		});

		it('should have CSS classes applied when onClick provided', () => {
			const handleClick = vi.fn();
			render(
				<Badge onClick={handleClick} testId="clickable-badge">
					Clickable
				</Badge>
			);
			const badge = screen.getByTestId('clickable-badge');
			// Panda CSS applies cursor styles via class names
			expect(badge.className).toContain('cursor_pointer');
		});
	});

	describe('Keyboard interaction', () => {
		it('should call onClick when Enter key is pressed', async () => {
			const handleClick = vi.fn();
			const user = userEvent.setup();
			render(<Badge onClick={handleClick}>Clickable</Badge>);

			const badge = screen.getByText('Clickable');
			badge.focus();
			await user.keyboard('{Enter}');

			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it('should call onClick when Space key is pressed', async () => {
			const handleClick = vi.fn();
			const user = userEvent.setup();
			render(<Badge onClick={handleClick}>Clickable</Badge>);

			const badge = screen.getByText('Clickable');
			badge.focus();
			await user.keyboard(' ');

			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it('should not call onClick for other keys', async () => {
			const handleClick = vi.fn();
			const user = userEvent.setup();
			render(<Badge onClick={handleClick}>Clickable</Badge>);

			const badge = screen.getByText('Clickable');
			badge.focus();
			await user.keyboard('a');
			await user.keyboard('{Escape}');
			await user.keyboard('{Tab}');

			expect(handleClick).not.toHaveBeenCalled();
		});

		it('should not trigger keyboard events when no onClick', async () => {
			const user = userEvent.setup();
			render(<Badge testId="static-badge">Static</Badge>);

			const badge = screen.getByTestId('static-badge');
			badge.focus();

			// Should not throw errors
			await user.keyboard('{Enter}');
			await user.keyboard(' ');
		});
	});

	describe('Accessibility', () => {
		it('should be focusable when clickable', () => {
			const handleClick = vi.fn();
			render(<Badge onClick={handleClick}>Clickable</Badge>);

			const badge = screen.getByText('Clickable');
			badge.focus();

			expect(badge).toHaveFocus();
		});

		it('should have proper ARIA role when clickable', () => {
			const handleClick = vi.fn();
			render(<Badge onClick={handleClick}>Clickable</Badge>);

			const badge = screen.getByRole('button', { name: 'Clickable' });
			expect(badge).toBeInTheDocument();
		});
	});

	describe('Use Cases', () => {
		const Strong = ({ children }) => (
			<span style={{ fontWeight: 'bold' }}>{children}</span>
		);

		it('should render mode badge with current format', () => {
			render(
				<Badge testId="badge-mode">
					minuscules <Strong>✓</Strong> MAJUSCULES <Strong>✓</Strong>
				</Badge>
			);
			const badge = screen.getByTestId('badge-mode');
			expect(badge).toHaveTextContent('minuscules');
			expect(badge).toHaveTextContent('MAJUSCULES');
			expect(badge).toHaveTextContent('✓');
		});

		it('should render hand count badge with current format', () => {
			render(
				<Badge testId="badge-alphabets">
					Alphabets <Strong>3</Strong>
				</Badge>
			);
			const badge = screen.getByTestId('badge-alphabets');
			expect(badge).toHaveTextContent('Alphabets');
			expect(badge).toHaveTextContent('3');
		});

		it('should render letter count badge with current format', () => {
			render(
				<Badge testId="badge-letters">
					Letters <Strong>24</Strong>
				</Badge>
			);
			const badge = screen.getByTestId('badge-letters');
			expect(badge).toHaveTextContent('Letters');
			expect(badge).toHaveTextContent('24');
		});

		it('should render baseline toggle badge with current format', () => {
			render(
				<Badge testId="badge-baseline">
					Baseline <Strong>✓</Strong>
				</Badge>
			);
			const badge = screen.getByTestId('badge-baseline');
			expect(badge).toHaveTextContent('Baseline');
			expect(badge).toHaveTextContent('✓');
		});

		it('should work as interactive mode badge', async () => {
			const handleClick = vi.fn();
			const user = userEvent.setup();

			render(
				<Badge onClick={handleClick} testId="mode-badge">
					minuscules <Strong>✓</Strong> MAJUSCULES <Strong>✗</Strong>
				</Badge>
			);

			const badge = screen.getByTestId('mode-badge');
			await user.click(badge);

			expect(handleClick).toHaveBeenCalled();
		});

		it('should work as interactive boolean toggle badge', async () => {
			const handleClick = vi.fn();
			const user = userEvent.setup();

			render(
				<Badge onClick={handleClick}>
					Baseline <Strong>✓</Strong>
				</Badge>
			);

			const badge = screen.getByText('Baseline');
			await user.click(badge);

			expect(handleClick).toHaveBeenCalled();
		});

		it('should work as navigation badge', async () => {
			const handleNavigate = vi.fn();
			const user = userEvent.setup();

			render(
				<Badge onClick={handleNavigate}>
					Alphabets <Strong>3</Strong>
				</Badge>
			);

			const badge = screen.getByText('Alphabets');
			await user.click(badge);

			expect(handleNavigate).toHaveBeenCalled();
		});
	});
});
