import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GameProgress from './GameProgress';
import { GAME_END_MODE } from '@constants/options.js';

describe('GameProgress', () => {
	describe('ON_QUIT mode', () => {
		it('renders empty container', () => {
			const { container } = render(
				<GameProgress
					gameEndMode={GAME_END_MODE.ON_QUIT}
					correctCount={5}
					incorrectCount={2}
					questionCount={25}
				/>
			);
			expect(container.textContent).toBe('');
		});
	});

	describe('SUDDEN_DEATH mode', () => {
		it('renders empty container', () => {
			const { container } = render(
				<GameProgress
					gameEndMode={GAME_END_MODE.SUDDEN_DEATH}
					correctCount={10}
					incorrectCount={0}
					questionCount={25}
				/>
			);
			expect(container.textContent).toBe('');
		});
	});

	describe('FIXED_NUM mode', () => {
		it('shows current question number and total', () => {
			render(
				<GameProgress
					gameEndMode={GAME_END_MODE.FIXED_NUM}
					correctCount={3}
					incorrectCount={2}
					questionCount={25}
				/>
			);
			expect(screen.getByText(/Question 6 of 25/)).toBeInTheDocument();
		});

		it('shows remaining questions', () => {
			render(
				<GameProgress
					gameEndMode={GAME_END_MODE.FIXED_NUM}
					correctCount={3}
					incorrectCount={2}
					questionCount={25}
				/>
			);
			expect(screen.getByText(/20 remaining/)).toBeInTheDocument();
		});

		it('shows Question 1 of N at start', () => {
			render(
				<GameProgress
					gameEndMode={GAME_END_MODE.FIXED_NUM}
					correctCount={0}
					incorrectCount={0}
					questionCount={10}
				/>
			);
			expect(screen.getByText(/Question 1 of 10/)).toBeInTheDocument();
		});

		it('does not show negative remaining when at limit', () => {
			render(
				<GameProgress
					gameEndMode={GAME_END_MODE.FIXED_NUM}
					correctCount={20}
					incorrectCount={5}
					questionCount={25}
				/>
			);
			// Should show Question 26 of 25 (0 remaining)
			expect(screen.queryByText(/remaining/)).not.toBeInTheDocument();
		});
	});

	describe('THREE_LIVES mode', () => {
		it('shows 3 hearts at start', () => {
			render(
				<GameProgress
					gameEndMode={GAME_END_MODE.THREE_LIVES}
					correctCount={5}
					incorrectCount={0}
					questionCount={25}
				/>
			);
			// Should have 3 visible hearts
			const hearts = screen.getAllByText('❤');
			expect(hearts).toHaveLength(3);
		});

		it('shows 2 hearts after 1 wrong answer', () => {
			const { container } = render(
				<GameProgress
					gameEndMode={GAME_END_MODE.THREE_LIVES}
					correctCount={5}
					incorrectCount={1}
					questionCount={25}
				/>
			);
			// Check for accessibility text
			expect(screen.getByText(/2 lives remaining/)).toBeInTheDocument();
		});

		it('shows 1 heart after 2 wrong answers', () => {
			render(
				<GameProgress
					gameEndMode={GAME_END_MODE.THREE_LIVES}
					correctCount={5}
					incorrectCount={2}
					questionCount={25}
				/>
			);
			expect(screen.getByText(/1 life remaining/)).toBeInTheDocument();
		});

		it('shows 0 hearts after 3 wrong answers', () => {
			render(
				<GameProgress
					gameEndMode={GAME_END_MODE.THREE_LIVES}
					correctCount={5}
					incorrectCount={3}
					questionCount={25}
				/>
			);
			expect(screen.getByText(/0 lives remaining/)).toBeInTheDocument();
		});

		it('has accessible text for screen readers', () => {
			render(
				<GameProgress
					gameEndMode={GAME_END_MODE.THREE_LIVES}
					correctCount={0}
					incorrectCount={0}
					questionCount={25}
				/>
			);
			expect(screen.getByText(/3 lives remaining/)).toBeInTheDocument();
		});
	});
});
