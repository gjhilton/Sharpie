import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LandingSectionNextSteps from './LandingSectionNextSteps';

describe('LandingSectionNextSteps', () => {
	it('renders section heading', () => {
		render(<LandingSectionNextSteps />);
		expect(screen.getByText('Next steps for learners')).toBeInTheDocument();
	});

	it('renders all three external links with correct hrefs', () => {
		render(<LandingSectionNextSteps />);

		const englishHandwritingLink = screen.getByRole('link', { name: /English Handwriting Online 1500-1700/i });
		expect(englishHandwritingLink).toHaveAttribute('href', 'https://www.english.cam.ac.uk/ceres/ehoc/');

		const beineckeLink = screen.getByRole('link', { name: /Beinecke Library/i });
		expect(beineckeLink).toHaveAttribute('href', 'https://beinecke.library.yale.edu/article/quarantine-reading-learn-read-secretary-hand');

		const scottishLink = screen.getByRole('link', { name: /Scottish Handwriting/i });
		expect(scottishLink).toHaveAttribute('href', 'https://www.scotlandspeople.gov.uk/scottish-handwriting/tutorials');
	});

	it('links have target="_blank" and rel="noopener noreferrer"', () => {
		render(<LandingSectionNextSteps />);

		const links = screen.getAllByRole('link');
		links.forEach(link => {
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		});
	});
});
