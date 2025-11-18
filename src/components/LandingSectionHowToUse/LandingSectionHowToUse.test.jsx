import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LandingSectionHowToUse from './LandingSectionHowToUse';

// Mock the markdown import
vi.mock('@data/how-to-use.md?raw', () => ({
	default: `1. First *step* with emphasis
2. Second step
3. Third step`
}));

describe('LandingSectionHowToUse', () => {
	it('renders section heading', () => {
		render(<LandingSectionHowToUse />);
		expect(screen.getByText('How to use')).toBeInTheDocument();
	});

	it('renders ordered list from markdown', () => {
		const { container } = render(<LandingSectionHowToUse />);
		const list = container.querySelector('ol');
		expect(list).toBeInTheDocument();
		const listItems = list.querySelectorAll('li');
		expect(listItems).toHaveLength(3);
	});

	it('list uses lower-roman style', () => {
		const { container } = render(<LandingSectionHowToUse />);
		const list = container.querySelector('ol');
		expect(list).toHaveClass('li-t_lower-roman');
	});

	it('renders emphasis from markdown', () => {
		render(<LandingSectionHowToUse />);
		const emphasisElement = screen.getByText('step');
		expect(emphasisElement.tagName).toBe('EM');
	});

	it('renders list items from markdown content', () => {
		render(<LandingSectionHowToUse />);
		expect(screen.getByText(/First/i)).toBeInTheDocument();
		expect(screen.getByText(/Second step/i)).toBeInTheDocument();
		expect(screen.getByText(/Third step/i)).toBeInTheDocument();
	});
});
