import { test, expect } from '@playwright/test';
import { selectGameMode } from '../config/playwright/helpers/test-helpers.js';

test.describe('Baseline Display Feature', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test.describe('Landing Screen - Options Section', () => {
		test('should display baseline toggle in Options', async ({ page }) => {
			// Expand Options section
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Check for toggle label
			const toggleLabel = page.getByText('Show baselines');
			await expect(toggleLabel).toBeVisible();
		});

		test('toggle should be ON by default', async ({ page }) => {
			// Expand Options section
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const toggle = page.getByRole('switch', {
				name: 'Show baselines',
			});
			await expect(toggle).toHaveAttribute('aria-checked', 'true');
		});

		test('toggle should switch from ON to OFF when clicked', async ({
			page,
		}) => {
			// Expand Options section
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const toggle = page.getByRole('switch', {
				name: 'Show baselines',
			});

			// Initially ON
			await expect(toggle).toHaveAttribute('aria-checked', 'true');

			// Click to turn OFF
			await toggle.click();
			await expect(toggle).toHaveAttribute('aria-checked', 'false');
		});

		test('toggle should switch from OFF to ON when clicked twice', async ({
			page,
		}) => {
			// Expand Options section
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const toggle = page.getByRole('switch', {
				name: 'Show baselines',
			});

			// Turn OFF
			await toggle.click();
			await expect(toggle).toHaveAttribute('aria-checked', 'false');

			// Turn ON
			await toggle.click();
			await expect(toggle).toHaveAttribute('aria-checked', 'true');
		});

		test('toggle should be keyboard accessible with Enter key', async ({
			page,
		}) => {
			// Expand Options section
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const toggle = page.getByRole('switch', {
				name: 'Show baselines',
			});

			// Focus the toggle
			await toggle.focus();

			// Initially ON
			await expect(toggle).toHaveAttribute('aria-checked', 'true');

			// Press Enter to toggle
			await page.keyboard.press('Enter');
			await expect(toggle).toHaveAttribute('aria-checked', 'false');
		});

		test('should display baseline examples in Options section', async ({
			page,
		}) => {
			// Expand Options section
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Check for example labels
			await expect(page.getByText('Without baseline')).toBeVisible();
			await expect(page.getByText('With baseline')).toBeVisible();
		});
	});

	test.describe('Gameplay with Baselines ON (default)', () => {
		test('should show baseline on character images during game', async ({
			page,
		}) => {
			// Baseline is ON by default, start game directly
			await page.getByRole('button', { name: /^play$/i }).click();

			// Wait for game screen
			await page.waitForSelector('img[alt="Character to identify"]', {
				state: 'visible',
			});

			// Check for baseline element (horizontal line at bottom of image container)
			const baseline = page.locator('.character-image-baseline');
			await expect(baseline.first()).toBeVisible();
		});

		test('should show baseline in correct answer feedback', async ({
			page,
		}) => {
			await page.getByRole('button', { name: /^play$/i }).click();

			// Wait for keyboard to be visible
			await page.waitForSelector('.simple-keyboard', {
				state: 'visible',
			});

			// Answer with some key
			await page.keyboard.press('a');
			await page.waitForTimeout(200);

			// Check if there's a baseline shown in the answer images
			const baselines = page.locator('.character-image-baseline');
			// At least the original image should show baseline
			const count = await baselines.count();
			expect(count).toBeGreaterThan(0);
		});
	});

	test.describe('Gameplay with Baselines OFF', () => {
		test('should NOT show baseline on character images when disabled', async ({
			page,
		}) => {
			// Expand Options and turn OFF baseline display
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const toggle = page.getByRole('switch', {
				name: 'Show baselines',
			});
			await toggle.click();
			await expect(toggle).toHaveAttribute('aria-checked', 'false');

			// Start game
			await page.getByRole('button', { name: /^play$/i }).click();

			// Wait for game screen
			await page.waitForSelector('img[alt="Character to identify"]', {
				state: 'visible',
			});

			// Baseline element should NOT be visible
			const baseline = page.locator('.character-image-baseline');
			await expect(baseline).toHaveCount(0);
		});

		test('should NOT show baseline in answer feedback when disabled', async ({
			page,
		}) => {
			// Expand Options and turn OFF baseline display
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const toggle = page.getByRole('switch', {
				name: 'Show baselines',
			});
			await toggle.click();

			// Start game
			await page.getByRole('button', { name: /^play$/i }).click();

			// Wait for keyboard to be visible
			await page.waitForSelector('.simple-keyboard', {
				state: 'visible',
			});

			// Answer with some key
			await page.keyboard.press('a');
			await page.waitForTimeout(200);

			// Baselines should NOT be present anywhere
			const baselines = page.locator('.character-image-baseline');
			await expect(baselines).toHaveCount(0);
		});
	});

	test.describe('Mode Persistence', () => {
		test('mode should persist across page reload', async ({ page }) => {
			// Expand Options section
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const toggle = page.getByRole('switch', {
				name: 'Show baselines',
			});

			// Turn OFF
			await toggle.click();
			await expect(toggle).toHaveAttribute('aria-checked', 'false');

			// Reload page
			await page.reload();

			// Expand Options section again
			const optionsHeaderAfterReload = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeaderAfterReload.click();

			// Should still be OFF (persisted in URL)
			const toggleAfterReload = page.getByRole('switch', {
				name: 'Show baselines',
			});
			await expect(toggleAfterReload).toHaveAttribute(
				'aria-checked',
				'false'
			);
		});

		test('baseline setting should persist through game session', async ({
			page,
		}) => {
			// Turn OFF baselines
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const toggle = page.getByRole('switch', {
				name: 'Show baselines',
			});
			await toggle.click();

			// Start game
			await page.getByRole('button', { name: /^play$/i }).click();

			// Play a few rounds
			for (let i = 0; i < 2; i++) {
				await page.waitForSelector('.simple-keyboard', {
					state: 'visible',
				});
				await page.keyboard.press('a');
				await page.waitForTimeout(100);
				const nextButton = page.getByRole('button', { name: 'Next' });
				await nextButton.waitFor({ state: 'visible' });
				await nextButton.click();
			}

			// Baselines should still be OFF
			const baselines = page.locator('.character-image-baseline');
			await expect(baselines).toHaveCount(0);
		});
	});

	test.describe('Integration with Game Modes', () => {
		test('baselines should work with minuscules game', async ({ page }) => {
			await selectGameMode(page, 'minuscule');

			// Baseline should be visible (it's ON by default)
			const baseline = page.locator('.character-image-baseline');
			await expect(baseline.first()).toBeVisible();
		});

		test('baselines should work with MAJUSCULES game', async ({ page }) => {
			await selectGameMode(page, 'majuscule');

			// Baseline should be visible (it's ON by default)
			const baseline = page.locator('.character-image-baseline');
			await expect(baseline.first()).toBeVisible();
		});

		test('baselines should work with both mode game', async ({ page }) => {
			await selectGameMode(page, 'all');

			// Baseline should be visible (it's ON by default)
			const baseline = page.locator('.character-image-baseline');
			await expect(baseline.first()).toBeVisible();
		});

		test('baseline can be turned off for any game mode', async ({
			page,
		}) => {
			// Turn OFF baselines first
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const toggle = page.getByRole('switch', {
				name: 'Show baselines',
			});
			await toggle.click();

			// Select majuscules mode
			await page.getByRole('radio', { name: /MAJUSCULES only/i }).click();

			await page.getByRole('button', { name: /^play$/i }).click();

			// Wait for game screen
			await page.waitForSelector('img[alt="Character to identify"]', {
				state: 'visible',
			});

			// Baselines should NOT be visible
			const baselines = page.locator('.character-image-baseline');
			await expect(baselines).toHaveCount(0);
		});
	});

	test.describe('Score Screen with Baselines', () => {
		test('should show baselines on mistake review when enabled', async ({
			page,
		}) => {
			// Baseline is ON by default
			await page.getByRole('button', { name: /^play$/i }).click();

			// Answer incorrectly
			await page.waitForSelector('.simple-keyboard', {
				state: 'visible',
			});
			await page.keyboard.press('z');
			await page.waitForTimeout(100);

			// End game
			await page.getByRole('button', { name: /end game/i }).click();

			// Wait for score screen
			await page.waitForSelector('text=Correct Answers', {
				timeout: 10000,
			});

			// If there are mistakes to review, baselines should be visible
			const reviewSection = page.getByText(/letters to review/i);
			if ((await reviewSection.count()) > 0) {
				const baselines = page.locator('.character-image-baseline');
				const count = await baselines.count();
				// Baselines should be shown on mistake images
				expect(count).toBeGreaterThan(0);
			}
		});

		test('should NOT show baselines on mistake review when disabled', async ({
			page,
		}) => {
			// Turn OFF baselines
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const toggle = page.getByRole('switch', {
				name: 'Show baselines',
			});
			await toggle.click();

			// Start game
			await page.getByRole('button', { name: /^play$/i }).click();

			// Answer incorrectly
			await page.waitForSelector('.simple-keyboard', {
				state: 'visible',
			});
			await page.keyboard.press('z');
			await page.waitForTimeout(100);

			// End game
			await page.getByRole('button', { name: /end game/i }).click();

			// Wait for score screen
			await page.waitForSelector('text=Correct Answers', {
				timeout: 10000,
			});

			// Baselines should NOT be visible anywhere
			const baselines = page.locator('.character-image-baseline');
			await expect(baselines).toHaveCount(0);
		});
	});

	test.describe('Combined Options', () => {
		test('baselines and 24-letter alphabet can be used together', async ({
			page,
		}) => {
			// Expand Options section
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Verify baseline is still ON
			const baselineToggle = page.getByRole('switch', {
				name: 'Show baselines',
			});
			await expect(baselineToggle).toHaveAttribute(
				'aria-checked',
				'true'
			);

			// Start game
			await page.getByRole('button', { name: /^play$/i }).click();

			// Wait for game screen
			await page.waitForSelector('img[alt="Character to identify"]', {
				state: 'visible',
			});

			// Both features should work: baselines visible AND combined keyboard letters
			const baseline = page.locator('.character-image-baseline');
			await expect(baseline.first()).toBeVisible();

			const keyboardText = await page
				.locator('.simple-keyboard')
				.textContent();
			// Should have combined letters (i/j or u/v)
			const hasCombinedLetters =
				keyboardText.includes('/') &&
				(keyboardText.match(/[iI]\/[jJ]/) ||
					keyboardText.match(/[uU]\/[vV]/));
			expect(hasCombinedLetters).toBeTruthy();
		});

		test('baselines OFF with 24-letter alphabet ON', async ({ page }) => {
			// Expand Options section
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Turn OFF baselines
			const baselineToggle = page.getByRole('switch', {
				name: 'Show baselines',
			});
			await baselineToggle.click();

			// Start game
			await page.getByRole('button', { name: /^play$/i }).click();

			// Wait for game screen
			await page.waitForSelector('img[alt="Character to identify"]', {
				state: 'visible',
			});

			// Baselines should NOT be visible
			const baselines = page.locator('.character-image-baseline');
			await expect(baselines).toHaveCount(0);

			// But combined keyboard letters should still be there
			const keyboardText = await page
				.locator('.simple-keyboard')
				.textContent();
			const hasCombinedLetters =
				keyboardText.includes('/') &&
				(keyboardText.match(/[iI]\/[jJ]/) ||
					keyboardText.match(/[uU]\/[vV]/));
			expect(hasCombinedLetters).toBeTruthy();
		});
	});
});
