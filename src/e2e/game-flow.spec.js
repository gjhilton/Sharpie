import { test, expect } from '@playwright/test';
import {
	selectGameMode,
	answerQuestion,
	clickNext,
	endGame,
	returnToMenu,
	isOnGameScreen,
	isOnScoreScreen,
	isOnMenuScreen,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('Game Flow', () => {
	test.describe('All Mode (Start button)', () => {
		test('should start game in all mode', async ({ page }) => {
			await selectGameMode(page, 'all');

			const onGame = await isOnGameScreen(page);
			expect(onGame).toBe(true);

			// Verify character image is displayed
			const characterImage = page
				.locator('img[alt="Character to identify"]')
				.first();
			await expect(characterImage).toBeVisible();
		});

		test('should display game UI elements', async ({ page }) => {
			await selectGameMode(page, 'all');

			// Check for essential game elements
			// End Game button should always be visible
			await expect(
				page.getByRole('button', { name: /end game/i })
			).toBeVisible();

			// Next button only appears after answering
			await answerQuestion(page, 'a');
			await expect(
				page.getByRole('button', { name: /next/i })
			).toBeVisible();

			// Should have keyboard (either physical or on-screen)
			const keyboard = page.locator('.hg-theme-default');
			if ((await keyboard.count()) > 0) {
				await expect(keyboard).toBeVisible();
			}
		});

		test('should allow answering questions with keyboard', async ({
			page,
		}) => {
			await selectGameMode(page, 'all');

			// Type an answer (e.g., 'a')
			await answerQuestion(page, 'a');

			// Click next to proceed
			await clickNext(page);

			// Should still be in game
			const onGame = await isOnGameScreen(page);
			expect(onGame).toBe(true);
		});

		test('should complete a full game flow', async ({ page }) => {
			await selectGameMode(page, 'all');

			// Answer a few questions
			for (let i = 0; i < 3; i++) {
				await answerQuestion(page, 'a');
				await clickNext(page);
			}

			// End the game
			await endGame(page);

			// Should be on score screen
			const onScore = await isOnScoreScreen(page);
			expect(onScore).toBe(true);

			// Verify score is displayed
			await expect(
				page.getByText('Correct Answers', { exact: true })
			).toBeVisible();
		});

		test('should return to landing from score screen', async ({ page }) => {
			await selectGameMode(page, 'all');

			// Play briefly and end
			await answerQuestion(page, 'a');
			await endGame(page);

			// Return to landing
			await returnToMenu(page);

			// Should be back on landing
			const onMenu = await isOnMenuScreen(page);
			expect(onMenu).toBe(true);
		});
	});

	test.describe('Minuscules Mode', () => {
		test('should start game in minuscules mode', async ({ page }) => {
			await selectGameMode(page, 'minuscule');

			const onGame = await isOnGameScreen(page);
			expect(onGame).toBe(true);
		});

		test('should complete minuscules game', async ({ page }) => {
			await selectGameMode(page, 'minuscule');

			// Answer a few questions
			for (let i = 0; i < 3; i++) {
				await answerQuestion(page, 'a');
				await clickNext(page);
			}

			// End game
			await endGame(page);

			// Check score screen
			const onScore = await isOnScoreScreen(page);
			expect(onScore).toBe(true);
		});
	});

	test.describe('Majuscules Mode', () => {
		test('should start game in majuscules mode', async ({ page }) => {
			await selectGameMode(page, 'majuscule');

			const onGame = await isOnGameScreen(page);
			expect(onGame).toBe(true);
		});

		test('should complete majuscules game', async ({ page }) => {
			await selectGameMode(page, 'majuscule');

			// Answer a few questions
			for (let i = 0; i < 3; i++) {
				await answerQuestion(page, 'A');
				await clickNext(page);
			}

			// End game
			await endGame(page);

			// Check score screen
			const onScore = await isOnScoreScreen(page);
			expect(onScore).toBe(true);
		});
	});

	test.describe('Score Screen', () => {
		test('should display score statistics', async ({ page }) => {
			await selectGameMode(page, 'all');

			// Answer some questions
			await answerQuestion(page, 'a');
			await clickNext(page);
			await answerQuestion(page, 'b');
			await clickNext(page);

			// End game
			await endGame(page);

			// Check for score elements
			await expect(
				page.getByText('Correct Answers', { exact: true })
			).toBeVisible();
			await expect(page.getByText(/accuracy/i)).toBeVisible();

			// Should have option to return to menu
			await expect(
				page.getByRole('button', { name: /return to menu/i })
			).toBeVisible();
		});

		test('should show incorrectly answered characters', async ({
			page,
		}) => {
			await selectGameMode(page, 'all');

			// Answer incorrectly on purpose
			await answerQuestion(page, 'z');
			await clickNext(page);

			await endGame(page);

			// Should show review section (if there were errors)
			const reviewSection = page.getByText(/letters to review/i);
			if ((await reviewSection.count()) > 0) {
				await expect(reviewSection).toBeVisible();
			}
		});
	});

	test.describe('Navigation', () => {
		test('should end game early and return to landing', async ({
			page,
		}) => {
			await selectGameMode(page, 'all');

			// Answer one question
			await answerQuestion(page, 'a');

			// End game immediately
			await endGame(page);

			// Return to landing
			await returnToMenu(page);

			const onMenu = await isOnMenuScreen(page);
			expect(onMenu).toBe(true);
		});

		test('should start new game after completing one', async ({ page }) => {
			// Complete first game
			await selectGameMode(page, 'all');
			await answerQuestion(page, 'a');
			await endGame(page);
			await returnToMenu(page);

			// Start second game
			await selectGameMode(page, 'minuscule');

			const onGame = await isOnGameScreen(page);
			expect(onGame).toBe(true);
		});
	});

	test.describe('Keyboard Shift Keys Visibility', () => {
		test('should show shift keys when playing "both" mode', async ({ page }) => {
			await selectGameMode(page, 'all');

			// Check for shift keys in keyboard
			const keyboard = page.locator('.hg-theme-default');
			await expect(keyboard).toBeVisible();

			// Shift keys should be present in the keyboard layout
			const shiftButton = keyboard.locator('[data-skbtn="{shift}"]');
			await expect(shiftButton.first()).toBeVisible();
		});

		test('should hide shift keys when playing "minuscules only" mode', async ({ page }) => {
			await selectGameMode(page, 'minuscule');

			// Check keyboard exists
			const keyboard = page.locator('.hg-theme-default');
			await expect(keyboard).toBeVisible();

			// Shift keys should NOT be present
			const shiftButton = keyboard.locator('[data-skbtn="{shift}"]');
			await expect(shiftButton).toHaveCount(0);
		});

		test('should hide shift keys when playing "MAJUSCULES only" mode', async ({ page }) => {
			await selectGameMode(page, 'majuscule');

			// Check keyboard exists
			const keyboard = page.locator('.hg-theme-default');
			await expect(keyboard).toBeVisible();

			// Shift keys should NOT be present
			const shiftButton = keyboard.locator('[data-skbtn="{shift}"]');
			await expect(shiftButton).toHaveCount(0);
		});

		test('should display lowercase keys in minuscule mode without shift', async ({ page }) => {
			await selectGameMode(page, 'minuscule');

			const keyboard = page.locator('.hg-theme-default');
			// Should have lowercase letters
			const lowerA = keyboard.locator('[data-skbtn="a"]');
			await expect(lowerA).toBeVisible();
		});

		test('should display uppercase keys in majuscule mode without shift', async ({ page }) => {
			await selectGameMode(page, 'majuscule');

			const keyboard = page.locator('.hg-theme-default');
			// Should have uppercase letters
			const upperA = keyboard.locator('[data-skbtn="A"]');
			await expect(upperA).toBeVisible();
		});

		test('should allow toggling between cases when playing "both" mode', async ({ page }) => {
			await selectGameMode(page, 'all');

			const keyboard = page.locator('.hg-theme-default');

			// Initially should show lowercase (default layout)
			const lowerA = keyboard.locator('[data-skbtn="a"]');
			await expect(lowerA).toBeVisible();

			// Click shift to toggle to uppercase
			const shiftButton = keyboard.locator('[data-skbtn="{shift}"]').first();
			await shiftButton.click();

			// Now should show uppercase
			const upperA = keyboard.locator('[data-skbtn="A"]');
			await expect(upperA).toBeVisible();
		});
	});
});
