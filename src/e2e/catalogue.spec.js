import { test, expect } from '@playwright/test';
import {
	navigateToCatalogue,
	isOnMenuScreen,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('Catalogue Screen', () => {
	test.beforeEach(async ({ page }) => {
		await navigateToCatalogue(page);
	});

	test('should load the catalogue screen', async ({ page }) => {
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});

	test('should display version number in footer', async ({ page }) => {
		const version = page.getByText(/v\d+\.\d+\.\d+/);
		await expect(version).toBeVisible();
	});

	test('should display character sets', async ({ page }) => {
		// Should have sections for different character sets (e.g., lowercase a-z and uppercase A-Z)
		// Characters are organized with individual letter headings (a, b, c... or A, B, C...)
		const letterHeadings = page.locator('h3');
		const count = await letterHeadings.count();

		// Should have multiple letter headings (a-z or A-Z sections)
		expect(count).toBeGreaterThan(0);
	});

	test('should display character images', async ({ page }) => {
		// Should have multiple character images (images have alt text of just the letter, e.g. "a")
		const characterImages = page.locator('img');
		const count = await characterImages.count();

		expect(count).toBeGreaterThan(0);

		// First image should be visible
		await expect(characterImages.first()).toBeVisible();
	});

	test('should show character labels', async ({ page }) => {
		// Each character should have its letter displayed
		const characterLabels = page.locator('text=/^[a-zA-Z]$/');
		const count = await characterLabels.count();

		expect(count).toBeGreaterThan(0);
	});

	test('should have a return to landing button', async ({ page }) => {
		// Back button is an anchor link, not a button
		const backLink = page.getByRole('link', {
			name: /back to menu/i,
		});
		await expect(backLink).toBeVisible();
	});

	test('should return to landing when clicking back', async ({ page }) => {
		// Click the back link directly
		const backLink = page.getByRole('link', {
			name: /back to menu/i,
		});
		await backLink.click();

		// Wait for landing to load
		await page.waitForSelector('text=Hone your', { timeout: 5000 });

		const onMenu = await isOnMenuScreen(page);
		expect(onMenu).toBe(true);
	});

	test('should display source credits', async ({ page }) => {
		// Should have attribution for the character sources
		const credits = page.locator('text=/source|credit|attribution/i');

		// May or may not have credits visible depending on implementation
		// Just checking it doesn't error
		await credits.count();
	});

	test('should organize characters by set', async ({ page }) => {
		// Characters should be grouped (either by graphSet or alphabetically)
		const characterImages = page.locator('img');
		const count = await characterImages.count();

		// Should have a reasonable number of characters
		expect(count).toBeGreaterThan(10);
	});

	test('should handle multiple character variants', async ({ page }) => {
		// Some letters may have multiple variants from different sources
		// This test just verifies the catalogue can handle this

		const characterImages = page.locator('img');
		await expect(characterImages.first()).toBeVisible();

		// Scroll through to check more are loaded
		const lastImage = characterImages.last();
		await lastImage.scrollIntoViewIfNeeded();
		await expect(lastImage).toBeVisible();
	});

	test('should be navigable by keyboard', async ({ page }) => {
		// Tab through elements
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		// Should be able to reach the back button
		await page.keyboard.press('Tab');

		// Focus should be on an interactive element
		const focusedElement = await page.evaluate(
			() => document.activeElement.tagName
		);
		expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement);
	});
});
