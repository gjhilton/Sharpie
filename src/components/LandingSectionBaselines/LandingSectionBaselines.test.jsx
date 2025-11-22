import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingSectionBaselines from './LandingSectionBaselines';

// Mock the markdown import
vi.mock('@data/baselines.md?raw', () => ({
	default: `First paragraph about *baseline* feature.

{{BASELINE_TOGGLE}}

Second paragraph about *distinguishing* characters.

{{BASELINE_EXAMPLES}}

*Example: Test caption*`,
}));

describe('LandingSectionBaselines', () => {
	const mockSetShowBaseline = vi.fn();

	beforeEach(() => {
		mockSetShowBaseline.mockClear();
	});

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
		expect(screen.getByLabelText('Show baselines')).toHaveAttribute(
			'aria-checked',
			'false'
		);

		rerender(
			<LandingSectionBaselines
				showBaseline={true}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		expect(screen.getByLabelText('Show baselines')).toHaveAttribute(
			'aria-checked',
			'true'
		);
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

	it('renders first paragraph from markdown with emphasis', () => {
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		expect(screen.getByText(/First paragraph/i)).toBeInTheDocument();
		const emphasisElement = screen.getByText('baseline');
		expect(emphasisElement.tagName).toBe('EM');
	});

	it('renders second paragraph from markdown', () => {
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		expect(screen.getByText(/Second paragraph/i)).toBeInTheDocument();
		const emphasisElement = screen.getByText('distinguishing');
		expect(emphasisElement.tagName).toBe('EM');
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

	it('renders third paragraph from markdown as caption', () => {
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		expect(screen.getByText(/Example: Test caption/i)).toBeInTheDocument();
	});

	it('renders images with correct source path', () => {
		render(
			<LandingSectionBaselines
				showBaseline={false}
				setShowBaseline={mockSetShowBaseline}
			/>
		);
		const image1 = screen.getByAltText('Joscelyn majuscule S');
		const image2 = screen.getByAltText(
			'Joscelyn majuscule S with baseline'
		);
		// Path should now use data/ prefix with BASE_URL
		expect(image1.src).toContain(
			'data/Joscelyn/joscelyn-majuscule-assets/S.png'
		);
		expect(image2.src).toContain(
			'data/Joscelyn/joscelyn-majuscule-assets/S.png'
		);
	});
});
