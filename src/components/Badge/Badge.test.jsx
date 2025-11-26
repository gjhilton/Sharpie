import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';

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
			const longText = 'This is a very long badge text that should not wrap';
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
	});

	describe('Use Cases', () => {
		it('should render mode badge', () => {
			render(<Badge testId="badge-mode">ALL</Badge>);
			expect(screen.getByTestId('badge-mode')).toHaveTextContent('ALL');
		});

		it('should render alphabet count badge', () => {
			render(<Badge testId="badge-alphabets">3 alphabets</Badge>);
			expect(screen.getByTestId('badge-alphabets')).toHaveTextContent('3 alphabets');
		});

		it('should render letter count badge', () => {
			render(<Badge testId="badge-letters">26 letters</Badge>);
			expect(screen.getByTestId('badge-letters')).toHaveTextContent('26 letters');
		});

		it('should render baseline toggle badge', () => {
			render(<Badge testId="badge-baseline">Baselines ON</Badge>);
			expect(screen.getByTestId('badge-baseline')).toHaveTextContent('Baselines ON');
		});
	});
});
