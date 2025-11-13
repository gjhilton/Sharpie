import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LandingSectionHowToUse from './LandingSectionHowToUse';

describe('LandingSectionHowToUse', () => {
	it('renders section heading', () => {
		render(<LandingSectionHowToUse />);
		expect(screen.getByText('How to use')).toBeInTheDocument();
	});

	it('renders ordered list with 5 items', () => {
		const { container } = render(<LandingSectionHowToUse />);
		const list = container.querySelector('ol');
		expect(list).toBeInTheDocument();
		const listItems = list.querySelectorAll('li');
		expect(listItems).toHaveLength(5);
	});

	it('list uses lower-roman style', () => {
		const { container } = render(<LandingSectionHowToUse />);
		const list = container.querySelector('ol');
		expect(list).toHaveClass('li-t_lower-roman');
	});

	it('list items contain expected text', () => {
		render(<LandingSectionHowToUse />);
		expect(screen.getByText(/You will be shown a character/i)).toBeInTheDocument();
		expect(screen.getByText(/Use your computer keyboard/i)).toBeInTheDocument();
		expect(screen.getByText(/See feedback about your answer/i)).toBeInTheDocument();
		expect(screen.getByText(/Hit 'next' to see another graph/i)).toBeInTheDocument();
		expect(screen.getByText(/Exit at any time/i)).toBeInTheDocument();
	});
});
