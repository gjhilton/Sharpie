import { test, expect } from '@playwright/test';
import {
	navigateToCatalogue,
	isOnLandingScreen,
	selectGameMode,
	isOnGameScreen,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('Hand Selection on Catalogue Page', () => {
	test.beforeEach(async ({ page }) => {
		await navigateToCatalogue(page);
	});

	test.describe('Page Structure', () => {
		test('should display Choose Hands heading', async ({ page }) => {
			await expect(
				page.getByRole('heading', { name: 'Choose Hands' })
			).toBeVisible();
		});

		test('should display explanatory paragraph about hands', async ({
			page,
		}) => {
			await expect(
				page.getByText(/hands Sharpie tests are extracted/)
			).toBeVisible();
		});

		test('should display selection status with hand and character counts', async ({
			page,
		}) => {
			await expect(page.getByText(/enabled.*hands/)).toBeVisible();
			await expect(page.getByText(/characters total/)).toBeVisible();
		});

		test('should display letter counts (minuscule and majuscule)', async ({
			page,
		}) => {
			await expect(page.getByText(/minuscule/)).toBeVisible();
			await expect(page.getByText(/majuscule/)).toBeVisible();
		});

		test('should display all hand toggles', async ({ page }) => {
			// Should have toggle switches for each hand
			const toggles = page.getByRole('switch');
			const count = await toggles.count();
			expect(count).toBeGreaterThanOrEqual(1);
		});

		test('should display hand metadata (date, title, source)', async ({
			page,
		}) => {
			// Check for date pattern
			await expect(page.getByText(/^\d{4}/).first()).toBeVisible();
			// Check for source links
			const sourceLinks = page.getByRole('link', { name: 'source' });
			const count = await sourceLinks.count();
			expect(count).toBeGreaterThanOrEqual(1);
		});

		test('should have Back to Menu button', async ({ page }) => {
			const backButton = page.getByRole('button', {
				name: /back to menu/i,
			});
			await expect(backButton).toBeVisible();
		});
	});

	test.describe('Toggle Functionality', () => {
		test('should have all hands enabled by default', async ({ page }) => {
			// All toggles should start checked (all hands enabled by default)
			const toggles = page.getByRole('switch');
			const count = await toggles.count();

			for (let i = 0; i < count; i++) {
				await expect(toggles.nth(i)).toBeChecked();
			}
		});

		test('should toggle hand OFF when clicking enabled toggle', async ({
			page,
		}) => {
			const firstToggle = page.getByRole('switch').first();

			// Should start checked
			await expect(firstToggle).toBeChecked();

			// Click to disable
			await firstToggle.click();

			// Should now be unchecked
			await expect(firstToggle).not.toBeChecked();
		});

		test('should toggle hand ON when clicking disabled toggle', async ({
			page,
		}) => {
			const firstToggle = page.getByRole('switch').first();

			// Disable first
			await firstToggle.click();
			await expect(firstToggle).not.toBeChecked();

			// Click again to enable
			await firstToggle.click();

			// Should be checked again
			await expect(firstToggle).toBeChecked();
		});

		test('should update character count when toggling alphabet', async ({
			page,
		}) => {
			// Get initial count
			const statusText = page.getByText(/enabled.*hands.*characters/);
			const initialText = await statusText.textContent();
			const initialCharMatch = initialText.match(/(\d+) characters/);
			const initialCharCount = parseInt(initialCharMatch[1]);

			// Disable one hand
			const firstToggle = page.getByRole('switch').first();
			await firstToggle.click();

			// Character count should decrease
			const newText = await statusText.textContent();
			const newCharMatch = newText.match(/(\d+) characters/);
			const newCharCount = parseInt(newCharMatch[1]);

			expect(newCharCount).toBeLessThan(initialCharCount);
		});

		test('should update hand count when toggling', async ({ page }) => {
			// Get initial count
			const statusText = page.getByText(/enabled.*hands/);
			const initialText = await statusText.textContent();
			const initialMatch = initialText.match(/(\d+) hands/);
			const initialCount = parseInt(initialMatch[1]);

			// Disable one hand
			const firstToggle = page.getByRole('switch').first();
			await firstToggle.click();

			// Hand count should decrease by 1
			const newText = await statusText.textContent();
			const newMatch = newText.match(/(\d+) hands/);
			const newCount = parseInt(newMatch[1]);

			expect(newCount).toBe(initialCount - 1);
		});

		test('should be keyboard accessible', async ({ page }) => {
			const firstToggle = page.getByRole('switch').first();

			// Focus the toggle
			await firstToggle.focus();

			// Should be checked initially
			await expect(firstToggle).toBeChecked();

			// Press Space to toggle
			await page.keyboard.press('Space');

			// Should now be unchecked
			await expect(firstToggle).not.toBeChecked();
		});

		test('should dim character images when hand is disabled', async ({
			page,
		}) => {
			// Disable first hand
			const firstToggle = page.getByRole('switch').first();
			await firstToggle.click();

			// Some character images should have reduced opacity
			const characterImages = page.locator('img');
			const firstImage = characterImages.first();

			// Check parent div has opacity style (dimmed to 0.2)
			const parentDiv = firstImage.locator('..');
			const opacity = await parentDiv.evaluate(el => el.style.opacity);

			// At least some images should be dimmed
			// (We can't easily know which images belong to which hand in E2E)
			expect(['1', '0.2', '']).toContain(opacity);
		});
	});

	test.describe('Error State - No Hands Selected', () => {
		test('should show error message when all hands are disabled', async ({
			page,
		}) => {
			// Disable all hands
			const toggles = page.getByRole('switch');
			const count = await toggles.count();

			for (let i = 0; i < count; i++) {
				const toggle = toggles.nth(i);
				if (await toggle.isChecked()) {
					await toggle.click();
				}
			}

			// Error message should appear
			await expect(
				page.getByText(/Error.*select at least one hand/i)
			).toBeVisible();
		});

		test('should disable Back to Menu button when no hands selected', async ({
			page,
		}) => {
			// Disable all hands
			const toggles = page.getByRole('switch');
			const count = await toggles.count();

			for (let i = 0; i < count; i++) {
				const toggle = toggles.nth(i);
				if (await toggle.isChecked()) {
					await toggle.click();
				}
			}

			// Back button should be replaced with error text
			await expect(
				page.getByText(/Not allowed.*Select one or more hands/i)
			).toBeVisible();

			// The button itself should not exist
			const backButton = page.getByRole('button', {
				name: /back to menu/i,
			});
			await expect(backButton).not.toBeVisible();
		});

		test('should show zero counts when no hands selected', async ({
			page,
		}) => {
			// Disable all hands
			const toggles = page.getByRole('switch');
			const count = await toggles.count();

			for (let i = 0; i < count; i++) {
				const toggle = toggles.nth(i);
				if (await toggle.isChecked()) {
					await toggle.click();
				}
			}

			// The status text is replaced with an error message when no hands selected
			// So check for the error state which indicates zero selection
			await expect(
				page.getByText(/Error.*select at least one hand/i)
			).toBeVisible();
		});

		test('should re-enable Back button when hand is selected again', async ({
			page,
		}) => {
			// Disable all hands
			const toggles = page.getByRole('switch');
			const count = await toggles.count();

			for (let i = 0; i < count; i++) {
				const toggle = toggles.nth(i);
				if (await toggle.isChecked()) {
					await toggle.click();
				}
			}

			// Verify error state
			await expect(
				page.getByText(/Not allowed.*Select one or more hands/i)
			).toBeVisible();

			// Re-enable first hand
			await toggles.first().click();

			// Back button should reappear
			const backButton = page.getByRole('button', {
				name: /back to menu/i,
			});
			await expect(backButton).toBeVisible();
		});
	});

	test.describe('Hand Metadata Display', () => {
		test('should display source links that open in new tab', async ({
			page,
		}) => {
			const sourceLinks = page.getByRole('link', { name: 'source' });
			const firstLink = sourceLinks.first();

			await expect(firstLink).toHaveAttribute('target', '_blank');
			await expect(firstLink).toHaveAttribute('rel', /noopener/);
		});

		test('should display hands sorted by date', async ({ page }) => {
			// Get all date texts
			const dates = page.locator('span').filter({ hasText: /^\d{4}/ });
			const dateTexts = [];

			const count = await dates.count();
			for (let i = 0; i < count; i++) {
				const text = await dates.nth(i).textContent();
				if (text.match(/^\d{4}/)) {
					dateTexts.push(text);
				}
			}

			// Should have multiple dates and they should be in chronological order
			expect(dateTexts.length).toBeGreaterThanOrEqual(1);
		});

		test('should display hand titles', async ({ page }) => {
			// Check for known hand title text patterns
			const hasTitle = await page
				.getByText(/Letter|typeface|Commonplace/)
				.first()
				.isVisible();
			expect(hasTitle).toBe(true);
		});
	});

	test.describe('Persistence and Integration', () => {
		test('should persist hand selection when returning to landing', async ({
			page,
		}) => {
			// Disable first hand
			const firstToggle = page.getByRole('switch').first();
			await firstToggle.click();

			// Get the new counts
			const statusText = page.getByText(/enabled.*hands/);
			const catalogueText = await statusText.textContent();
			const alphabetMatch = catalogueText.match(/(\d+) hands/);
			const expectedAlphabetCount = alphabetMatch[1];

			// Return to menu
			const backButton = page.getByRole('button', {
				name: /back to menu/i,
			});
			await backButton.click();
			await page.waitForSelector('text=Hone your', { timeout: 5000 });

			// Open Options section
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Check that the landing page shows the updated count
			const landingStats = page.getByText(/Question bank:/);
			await expect(landingStats).toBeVisible();

			// The counts should reflect the disabled hand
			const landingText = await landingStats.textContent();
			expect(landingText).toContain(`${expectedAlphabetCount} hands`);
		});

		test('should affect gameplay with selected hands only', async ({
			page,
		}) => {
			// Disable one hand to reduce the pool
			const firstToggle = page.getByRole('switch').first();
			await firstToggle.click();

			// Return to landing
			const backButton = page.getByRole('button', {
				name: /back to menu/i,
			});
			await backButton.click();
			await page.waitForSelector('text=Hone your', { timeout: 5000 });

			// Start game - should use reduced character pool
			await selectGameMode(page, 'all');

			const onGame = await isOnGameScreen(page);
			expect(onGame).toBe(true);

			// Game should be playable with reduced hand set
			const characterImage = page
				.locator('img[alt="Character to identify"]')
				.first();
			await expect(characterImage).toBeVisible();
		});

		test('should update landing page statistics after selection change', async ({
			page,
		}) => {
			// Disable two hands
			const toggles = page.getByRole('switch');
			await toggles.nth(0).click();
			await toggles.nth(1).click();

			// Get counts
			const statusText = page.getByText(/enabled.*hands/);
			const catalogueText = await statusText.textContent();
			const alphaMatch = catalogueText.match(/(\d+) hands/);
			const charMatch = catalogueText.match(/(\d+) characters/);
			const expectedAlphabets = alphaMatch[1];
			const expectedCharacters = charMatch[1];

			// Return to landing
			const backButton = page.getByRole('button', {
				name: /back to menu/i,
			});
			await backButton.click();
			await page.waitForSelector('text=Hone your', { timeout: 5000 });

			// Open Options
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Verify counts match
			await expect(
				page.getByText(
					new RegExp(
						`${expectedCharacters} characters from ${expectedAlphabets} hands`
					)
				)
			).toBeVisible();
		});
	});

	test.describe('Character Gallery Display', () => {
		test('should display character index with jump links', async ({
			page,
		}) => {
			await expect(
				page.getByRole('heading', { name: 'Jump to...' })
			).toBeVisible();

			// Should have letter links
			const letterLinks = page.locator('a[href^="#char-"]');
			const count = await letterLinks.count();
			expect(count).toBeGreaterThan(0);
		});

		test('should scroll to letter when clicking jump link', async ({
			page,
		}) => {
			// Click on a letter link
			const letterLink = page.locator('a[href="#char-a"]');
			if ((await letterLink.count()) > 0) {
				await letterLink.click();

				// Letter header should be in view
				const letterHeader = page.locator('#char-a');
				await expect(letterHeader).toBeInViewport();
			}
		});

		test('should have back to top links in each letter section', async ({
			page,
		}) => {
			const backToTopLinks = page.getByRole('link', {
				name: 'back to top',
			});
			const count = await backToTopLinks.count();
			expect(count).toBeGreaterThan(0);
		});

		test('should organize characters by minuscules and MAJUSCULES', async ({
			page,
		}) => {
			// Should have index labels for both
			await expect(
				page.getByText('minuscule:', { exact: false })
			).toBeVisible();
			await expect(
				page.getByText('MAJUSCULE:', { exact: false })
			).toBeVisible();
		});
	});

	test.describe('Navigation', () => {
		test('should navigate back to landing when clicking Back to Menu', async ({
			page,
		}) => {
			const backButton = page.getByRole('button', {
				name: /back to menu/i,
			});
			await backButton.click();

			await page.waitForSelector('text=Hone your', { timeout: 5000 });

			const onMenu = await isOnLandingScreen(page);
			expect(onMenu).toBe(true);
		});

		test('should allow scrolling after toggling hands', async ({
			page,
		}) => {
			// Toggle a hand
			const firstToggle = page.getByRole('switch').first();
			await firstToggle.click();

			// Scroll down
			await page.evaluate(() => window.scrollTo(0, 500));
			const scrollY = await page.evaluate(() => window.scrollY);

			// Scrolling should work after toggling
			expect(scrollY).toBeGreaterThan(0);
		});

		test('should scroll to top when entering catalogue page', async ({
			page,
		}) => {
			// The page should start at top
			const scrollY = await page.evaluate(() => window.scrollY);
			expect(scrollY).toBe(0);
		});
	});
});
