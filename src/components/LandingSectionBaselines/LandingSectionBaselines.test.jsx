import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingSectionBaselines from './LandingSectionBaselines';

describe('LandingSectionBaselines', () => {
	const mockSetShowBaseline = vi.fn();

	it('renders section heading', () => {
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		expect(screen.getByText('Baselines')).toBeInTheDocument();
	});

	it('renders toggle with correct label', () => {
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		expect(screen.getByLabelText('Show baselines')).toBeInTheDocument();
	});

	it('toggle reflects checked state', () => {
		const { rerender } = render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		const toggle = screen.getByLabelText('Show baselines');
		expect(toggle).toHaveAttribute('aria-checked', 'false');

		rerender(
			<LandingSectionBaselines
				showBaseline={true}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		expect(toggle).toHaveAttribute('aria-checked', 'true');
	});

	it('toggle calls onChange', async () => {
		const user = userEvent.setup();
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);

		await user.click(screen.getByLabelText('Show baselines'));
		expect(mockSetShowBaseline).toHaveBeenCalledWith(true);
	});

	it('renders introductory paragraph', () => {
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		expect(
			screen.getByText(/Show the approximate baseline of the characters/i)
		).toBeInTheDocument();
	});

	it('renders explanation paragraph', () => {
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		expect(
			screen.getByText(/When enabled, a baseline appears across each character image/i)
		).toBeInTheDocument();
	});

	it('renders "Without baseline" label', () => {
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		expect(screen.getByText('Without baseline')).toBeInTheDocument();
	});

	it('renders "With baseline" label', () => {
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		expect(screen.getByText('With baseline')).toBeInTheDocument();
	});

	it('renders both example images', () => {
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		const images = screen.getAllByRole('img');
		expect(images).toHaveLength(2);
	});

	it('renders example caption', () => {
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		expect(screen.getByText(/Example: Joscelyn majuscule S/i)).toBeInTheDocument();
	});

	it('renders images with correct source path', () => {
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		const image1 = screen.getByAltText('Joscelyn majuscule S');
		const image2 = screen.getByAltText('Joscelyn majuscule S with baseline');
		// Path should now use data/ prefix with BASE_URL
		expect(image1.src).toContain('data/Joscelyn/joscelyn-majuscule-assets/S.png');
		expect(image2.src).toContain('data/Joscelyn/joscelyn-majuscule-assets/S.png');
	});

	it('explains the purpose of baselines', () => {
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		expect(
			screen.getByText(/can help distinguish between majuscule.*and minuscule/i)
		).toBeInTheDocument();
	});
});
