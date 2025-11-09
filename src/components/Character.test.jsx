import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Character, { CHARACTER_STATE } from './Character';

// Mock the child components
vi.mock('./CharacterImage.jsx', () => ({
	default: ({ imagePath }) => (
		<div data-testid="character-image">{imagePath}</div>
	),
}));

vi.mock('./CharacterImageSlideshow.jsx', () => ({
	default: ({ imagePaths }) => (
		<div data-testid="character-slideshow">{imagePaths.join(',')}</div>
	),
}));

vi.mock('./Icon.jsx', () => ({
	default: ({ icon }) => <span data-testid="icon">{icon}</span>,
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
		sourceLink: 'https://example.com',
		sourceTitle: 'Test Source',
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

	it('should show source link in CORRECT_ANSWER state', () => {
		render(
			<Character
				{...defaultProps}
				state={CHARACTER_STATE.CORRECT_ANSWER}
			/>
		);
		expect(screen.getByText(/Test Source/)).toBeInTheDocument();
		const link = screen.getByRole('link', { name: /source/ });
		expect(link).toHaveAttribute('href', 'https://example.com');
		expect(link).toHaveAttribute('target', '_blank');
	});

	it('should not show source in AWAIT_ANSWER state', () => {
		render(
			<Character {...defaultProps} state={CHARACTER_STATE.AWAIT_ANSWER} />
		);
		expect(screen.queryByText(/Test Source/)).not.toBeInTheDocument();
		expect(
			screen.queryByRole('link', { name: /source/ })
		).not.toBeInTheDocument();
	});

	it('should not show source in INCORRECT_ANSWER state', () => {
		render(
			<Character
				{...defaultProps}
				state={CHARACTER_STATE.INCORRECT_ANSWER}
			/>
		);
		expect(screen.queryByText(/Test Source/)).not.toBeInTheDocument();
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
});
