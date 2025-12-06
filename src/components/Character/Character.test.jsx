import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Character, CHARACTER_STATE } from './Character';

// Mock the child components
vi.mock('@components/CharacterImage/CharacterImage.jsx', () => ({
	CharacterImage: ({ imagePath }) => (
		<div data-testid="character-image">{imagePath}</div>
	),
}));

vi.mock(
	'@components/CharacterImageSlideshow/CharacterImageSlideshow.jsx',
	() => ({
		CharacterImageSlideshow: ({ imagePaths }) => (
			<div data-testid="character-slideshow">{imagePaths.join(',')}</div>
		),
	})
);

vi.mock('@components/Icon/Icon.jsx', () => ({
	Icon: ({ icon }) => <span data-testid="icon">{icon}</span>,
	ICON_TYPE: {
		TICK: 'tick',
		CROSS: 'cross',
	},
}));

describe('Character', () => {
	const defaultProps = {
		state: CHARACTER_STATE.AWAIT_ANSWER,
		imagePath: '/test-image.png',
		character: 'A',
		alphabetLink: 'https://example.com',
		alphabetTitle: 'Test Alphabet',
		alphabetDate: '1579/80',
	};

	it('should render with image path', () => {
		render(<Character {...defaultProps} />);
		const image = screen.getByTestId('character-image');
		expect(image).toBeInTheDocument();
		expect(image).toHaveTextContent('/test-image.png');
	});

	it('should render slideshow when imagePaths provided', () => {
		const props = {
			...defaultProps,
			imagePath: undefined,
			imagePaths: ['/img1.png', '/img2.png', '/img3.png'],
		};
		render(<Character {...props} />);
		const slideshow = screen.getByTestId('character-slideshow');
		expect(slideshow).toBeInTheDocument();
		expect(slideshow).toHaveTextContent('/img1.png,/img2.png,/img3.png');
	});

	it('should not show character label in AWAIT_ANSWER state', () => {
		render(
			<Character {...defaultProps} state={CHARACTER_STATE.AWAIT_ANSWER} />
		);
		expect(screen.queryByText('A')).not.toBeInTheDocument();
	});

	it('should show character label with tick icon in CORRECT_ANSWER state', () => {
		render(
			<Character
				{...defaultProps}
				state={CHARACTER_STATE.CORRECT_ANSWER}
			/>
		);
		expect(screen.getByText('A')).toBeInTheDocument();
		expect(screen.getByTestId('icon')).toHaveTextContent('tick');
	});

	it('should show character label with cross icon in INCORRECT_ANSWER state', () => {
		render(
			<Character
				{...defaultProps}
				state={CHARACTER_STATE.INCORRECT_ANSWER}
			/>
		);
		expect(screen.getByText('A')).toBeInTheDocument();
		expect(screen.getByTestId('icon')).toHaveTextContent('cross');
	});

	it('should show red overlay in INCORRECT_ANSWER state', () => {
		render(
			<Character
				{...defaultProps}
				state={CHARACTER_STATE.INCORRECT_ANSWER}
			/>
		);
		const overlay = screen.getByLabelText('Incorrect answer');
		expect(overlay).toBeInTheDocument();
	});

	it('should not show red overlay in CORRECT_ANSWER state', () => {
		render(
			<Character
				{...defaultProps}
				state={CHARACTER_STATE.CORRECT_ANSWER}
			/>
		);
		expect(
			screen.queryByLabelText('Incorrect answer')
		).not.toBeInTheDocument();
	});

	it('should show hand info with date in CORRECT_ANSWER state', () => {
		render(
			<Character
				{...defaultProps}
				state={CHARACTER_STATE.CORRECT_ANSWER}
			/>
		);
		expect(screen.getByText(/Test Alphabet/)).toBeInTheDocument();
		expect(screen.getByText('[1579/80]')).toBeInTheDocument();
		const link = screen.getByRole('link', { name: /source/ });
		expect(link).toHaveAttribute('href', 'https://example.com');
		expect(link).toHaveAttribute('target', '_blank');
	});

	it('should not show hand info in AWAIT_ANSWER state', () => {
		render(
			<Character {...defaultProps} state={CHARACTER_STATE.AWAIT_ANSWER} />
		);
		expect(screen.queryByText(/Test Alphabet/)).not.toBeInTheDocument();
		expect(
			screen.queryByRole('link', { name: /source/ })
		).not.toBeInTheDocument();
	});

	it('should not show hand info in INCORRECT_ANSWER state', () => {
		render(
			<Character
				{...defaultProps}
				state={CHARACTER_STATE.INCORRECT_ANSWER}
			/>
		);
		expect(screen.queryByText(/Test Alphabet/)).not.toBeInTheDocument();
	});

	it('should have accessible label for correct answer', () => {
		render(
			<Character
				{...defaultProps}
				state={CHARACTER_STATE.CORRECT_ANSWER}
				character="B"
			/>
		);
		expect(
			screen.getByLabelText('Character B: correct answer')
		).toBeInTheDocument();
	});

	it('should have accessible label for incorrect answer', () => {
		render(
			<Character
				{...defaultProps}
				state={CHARACTER_STATE.INCORRECT_ANSWER}
				character="C"
			/>
		);
		expect(
			screen.getByLabelText('Character C: incorrect answer')
		).toBeInTheDocument();
	});

	describe('note display', () => {
		it('should display note in AWAIT_ANSWER state', () => {
			render(
				<Character
					{...defaultProps}
					state={CHARACTER_STATE.AWAIT_ANSWER}
					note="First letter of word"
				/>
			);
			expect(
				screen.getByText('First letter of word')
			).toBeInTheDocument();
		});

		it('should display note in CORRECT_ANSWER state', () => {
			render(
				<Character
					{...defaultProps}
					state={CHARACTER_STATE.CORRECT_ANSWER}
					note="First letter of word"
				/>
			);
			expect(
				screen.getByText('First letter of word')
			).toBeInTheDocument();
		});

		it('should display note in INCORRECT_ANSWER state', () => {
			render(
				<Character
					{...defaultProps}
					state={CHARACTER_STATE.INCORRECT_ANSWER}
					note="First letter of word"
				/>
			);
			expect(
				screen.getByText('First letter of word')
			).toBeInTheDocument();
		});

		it('should not display note when not provided', () => {
			render(
				<Character
					{...defaultProps}
					state={CHARACTER_STATE.AWAIT_ANSWER}
				/>
			);
			// No note text should be present
			expect(screen.queryByText(/First letter/)).not.toBeInTheDocument();
		});

		it('should render note in span element', () => {
			render(
				<Character
					{...defaultProps}
					state={CHARACTER_STATE.AWAIT_ANSWER}
					note="Test note"
				/>
			);
			const noteElement = screen.getByText('Test note');
			expect(noteElement.tagName).toBe('SPAN');
		});

		it('should display both note and hand info in CORRECT_ANSWER state', () => {
			render(
				<Character
					{...defaultProps}
					state={CHARACTER_STATE.CORRECT_ANSWER}
					note="Test note"
				/>
			);
			expect(screen.getByText('Test note')).toBeInTheDocument();
			expect(screen.getByText(/Test Alphabet/)).toBeInTheDocument();
			expect(screen.getByText('[1579/80]')).toBeInTheDocument();
		});

		it('should display character label with icon AND note in CORRECT_ANSWER state', () => {
			render(
				<Character
					{...defaultProps}
					state={CHARACTER_STATE.CORRECT_ANSWER}
					note="Important note"
				/>
			);
			// Character label and icon
			expect(screen.getByText('A')).toBeInTheDocument();
			expect(screen.getByTestId('icon')).toHaveTextContent('tick');
			// Note
			expect(screen.getByText('Important note')).toBeInTheDocument();
			// Alphabet info
			expect(screen.getByText(/Test Alphabet/)).toBeInTheDocument();
		});

		it('should display character label with icon AND note in INCORRECT_ANSWER state', () => {
			render(
				<Character
					{...defaultProps}
					state={CHARACTER_STATE.INCORRECT_ANSWER}
					note="Important note"
				/>
			);
			// Character label and icon
			expect(screen.getByText('A')).toBeInTheDocument();
			expect(screen.getByTestId('icon')).toHaveTextContent('cross');
			// Note
			expect(screen.getByText('Important note')).toBeInTheDocument();
			// Red overlay
			expect(
				screen.getByLabelText('Incorrect answer')
			).toBeInTheDocument();
		});
	});
});
