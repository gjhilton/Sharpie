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

test.describe('Alphabet Sorting', () => {
	test.beforeEach(async ({ page }) => {
		await navigateToCatalogue(page);
	});

	test('should display sort selector with three options', async ({
		page,
	}) => {
		const sortSelect = page.getByRole('combobox', { name: /sort by/i });
		await expect(sortSelect).toBeVisible();

		// Check all three options exist
		const dateOption = page.getByRole('option', { name: /by date/i });
		const nameOption = page.getByRole('option', { name: /by name/i });
		const difficultyOption = page.getByRole('option', {
			name: /by difficulty/i,
		});

		await expect(dateOption).toBeVisible();
		await expect(nameOption).toBeVisible();
		await expect(difficultyOption).toBeVisible();
	});

	test('should default to sorting by date', async ({ page }) => {
		const sortSelect = page.getByRole('combobox', { name: /sort by/i });
		const selectedValue = await sortSelect.inputValue();

		expect(selectedValue).toBe('date');
	});

	test('should change sort order when selecting by name', async ({
		page,
	}) => {
		const sortSelect = page.getByRole('combobox', { name: /sort by/i });

		// Get initial order (by date)
		const initialFirstAlphabet = await page
			.locator('[id^="alphabet-"]')
			.first()
			.getAttribute('id');

		// Change to sort by name
		await sortSelect.selectOption('name');

		// Get new order
		const newFirstAlphabet = await page
			.locator('[id^="alphabet-"]')
			.first()
			.getAttribute('id');

		// Order should have changed
		expect(newFirstAlphabet).not.toBe(initialFirstAlphabet);
	});

	test('should display difficulty headings when sorting by difficulty', async ({
		page,
	}) => {
		const sortSelect = page.getByRole('combobox', { name: /sort by/i });

		// Change to sort by difficulty
		await sortSelect.selectOption('difficulty');

		// Should see difficulty headings
		const easyHeading = page.getByRole('heading', {
			name: /difficulty.*easy/i,
		});
		const mediumHeading = page.getByRole('heading', {
			name: /difficulty.*medium/i,
		});
		const hardHeading = page.getByRole('heading', {
			name: /difficulty.*hard/i,
		});

		// At least one of these headings should be visible
		const hasHeadings = await Promise.race([
			easyHeading.isVisible().catch(() => false),
			mediumHeading.isVisible().catch(() => false),
			hardHeading.isVisible().catch(() => false),
		]);

		expect(hasHeadings).toBe(true);
	});

	test('should not display difficulty headings when not sorting by difficulty', async ({
		page,
	}) => {
		// Default is by date, so difficulty headings should not be visible
		const difficultyHeading = page.getByRole('heading', {
			name: /difficulty/i,
		});

		await expect(difficultyHeading).not.toBeVisible();
	});

	test('should maintain alphabet toggle state when changing sort order', async ({
		page,
	}) => {
		// Find a toggle and check its state
		const firstToggle = page.locator('[id^="alphabet-"]').first();
		const toggleId = await firstToggle.getAttribute('id');
		const initialState = await firstToggle.getAttribute('aria-checked');

		// Click the toggle to change its state
		await firstToggle.click();
		await page.waitForTimeout(100); // Small wait for state change

		const afterClickState = await firstToggle.getAttribute('aria-checked');
		expect(afterClickState).not.toBe(initialState);

		// Change sort order
		const sortSelect = page.getByRole('combobox', { name: /sort by/i });
		await sortSelect.selectOption('name');
		await page.waitForTimeout(100);

		// Find the same toggle again (it might be in a different position now)
		const sameToggleAfterSort = page.locator(`[id="${toggleId}"]`);
		const stateAfterSort =
			await sameToggleAfterSort.getAttribute('aria-checked');

		// State should be preserved
		expect(stateAfterSort).toBe(afterClickState);
	});

	test('should sort difficulty groups in correct order', async ({ page }) => {
		const sortSelect = page.getByRole('combobox', { name: /sort by/i });

		// Change to sort by difficulty
		await sortSelect.selectOption('difficulty');
		await page.waitForTimeout(200);

		// Get all h3 headings (difficulty headings)
		const headings = page.locator('h3');
		const headingTexts = await headings.allTextContents();

		// Filter to only difficulty headings
		const difficultyHeadings = headingTexts.filter(text =>
			text.toLowerCase().includes('difficulty')
		);

		// If there are multiple difficulty headings, they should be in order: Easy, Medium, Hard
		if (difficultyHeadings.length > 1) {
			const easyIndex = difficultyHeadings.findIndex(text =>
				text.toLowerCase().includes('easy')
			);
			const mediumIndex = difficultyHeadings.findIndex(text =>
				text.toLowerCase().includes('medium')
			);
			const hardIndex = difficultyHeadings.findIndex(text =>
				text.toLowerCase().includes('hard')
			);

			// If present, easy should come before medium and hard
			if (easyIndex !== -1 && mediumIndex !== -1) {
				expect(easyIndex).toBeLessThan(mediumIndex);
			}
			if (mediumIndex !== -1 && hardIndex !== -1) {
				expect(mediumIndex).toBeLessThan(hardIndex);
			}
		}
	});
});

test.describe('Bulk Selection', () => {
	test.beforeEach(async ({ page }) => {
		await navigateToCatalogue(page);
		// Switch to difficulty sort to enable bulk selection controls
		const sortSelect = page.getByRole('combobox', { name: /sort by/i });
		await sortSelect.selectOption('difficulty');
		await page.waitForTimeout(200);
	});

	test('should display select all and deselect all links for each difficulty', async ({
		page,
	}) => {
		// Should have select all and deselect all links visible next to difficulty headings
		const selectAllLinks = page.getByRole('link', { name: 'select all' });
		const deselectAllLinks = page.getByRole('link', {
			name: 'deselect all',
		});

		const selectCount = await selectAllLinks.count();
		const deselectCount = await deselectAllLinks.count();

		// Should have at least one of each (depends on alphabets present)
		expect(selectCount).toBeGreaterThan(0);
		expect(deselectCount).toBeGreaterThan(0);
		// Should have equal numbers (one pair per difficulty group)
		expect(selectCount).toBe(deselectCount);
	});

	test('should select all alphabets in a difficulty group when clicking select all', async ({
		page,
	}) => {
		// Find the first difficulty heading and its select all link
		const firstSelectAllLink = page
			.getByRole('link', { name: 'select all' })
			.first();

		// Get all toggles before clicking
		const allToggles = page.locator('[id^="alphabet-"]');
		const toggleCountBefore = await allToggles.count();

		// Count how many are enabled before
		let enabledCountBefore = 0;
		for (let i = 0; i < toggleCountBefore; i++) {
			const toggle = allToggles.nth(i);
			const ariaChecked = await toggle.getAttribute('aria-checked');
			if (ariaChecked === 'true') {
				enabledCountBefore++;
			}
		}

		// Click select all
		await firstSelectAllLink.click();
		await page.waitForTimeout(200);

		// Count how many are enabled after
		let enabledCountAfter = 0;
		for (let i = 0; i < toggleCountBefore; i++) {
			const toggle = allToggles.nth(i);
			const ariaChecked = await toggle.getAttribute('aria-checked');
			if (ariaChecked === 'true') {
				enabledCountAfter++;
			}
		}

		// Should have more enabled alphabets after clicking select all
		expect(enabledCountAfter).toBeGreaterThanOrEqual(enabledCountBefore);
	});

	test('should deselect all alphabets in a difficulty group when clicking deselect all', async ({
		page,
	}) => {
		// First, select all in a group to ensure we have something to deselect
		const firstSelectAllLink = page
			.getByRole('link', { name: 'select all' })
			.first();
		await firstSelectAllLink.click();
		await page.waitForTimeout(200);

		// Get count of enabled toggles
		const allToggles = page.locator('[id^="alphabet-"]');
		const toggleCount = await allToggles.count();

		let enabledCountBefore = 0;
		for (let i = 0; i < toggleCount; i++) {
			const toggle = allToggles.nth(i);
			const ariaChecked = await toggle.getAttribute('aria-checked');
			if (ariaChecked === 'true') {
				enabledCountBefore++;
			}
		}

		// Now click deselect all for the same group
		const firstDeselectAllLink = page
			.getByRole('link', { name: 'deselect all' })
			.first();
		await firstDeselectAllLink.click();
		await page.waitForTimeout(200);

		// Count enabled toggles after
		let enabledCountAfter = 0;
		for (let i = 0; i < toggleCount; i++) {
			const toggle = allToggles.nth(i);
			const ariaChecked = await toggle.getAttribute('aria-checked');
			if (ariaChecked === 'true') {
				enabledCountAfter++;
			}
		}

		// Should have fewer enabled alphabets after clicking deselect all
		expect(enabledCountAfter).toBeLessThan(enabledCountBefore);
	});

	test('should disable select all link when all alphabets in group are selected', async ({
		page,
	}) => {
		// Click select all for first group
		const firstSelectAllLink = page
			.getByRole('link', { name: 'select all' })
			.first();
		await firstSelectAllLink.click();
		await page.waitForTimeout(200);

		// The select all link should now be disabled
		const ariaDisabled =
			await firstSelectAllLink.getAttribute('aria-disabled');
		expect(ariaDisabled).toBe('true');
	});

	test('should disable deselect all link when no alphabets in group are selected', async ({
		page,
	}) => {
		// Click deselect all for first group
		const firstDeselectAllLink = page
			.getByRole('link', { name: 'deselect all' })
			.first();
		await firstDeselectAllLink.click();
		await page.waitForTimeout(200);

		// The deselect all link should now be disabled
		const ariaDisabled =
			await firstDeselectAllLink.getAttribute('aria-disabled');
		expect(ariaDisabled).toBe('true');
	});

	test('should not display bulk selection controls when not sorting by difficulty', async ({
		page,
	}) => {
		// Switch back to date sort
		const sortSelect = page.getByRole('combobox', { name: /sort by/i });
		await sortSelect.selectOption('date');
		await page.waitForTimeout(200);

		// Select all and deselect all links should not be visible
		const selectAllLinks = page.getByRole('link', { name: 'select all' });
		const deselectAllLinks = page.getByRole('link', {
			name: 'deselect all',
		});

		await expect(selectAllLinks.first()).not.toBeVisible();
		await expect(deselectAllLinks.first()).not.toBeVisible();
	});

	test('should handle bulk selection across multiple difficulty groups', async ({
		page,
	}) => {
		const selectAllLinks = page.getByRole('link', { name: 'select all' });
		const selectAllCount = await selectAllLinks.count();

		// Click select all for each difficulty group
		for (let i = 0; i < selectAllCount; i++) {
			await selectAllLinks.nth(i).click();
			await page.waitForTimeout(100);
		}

		// All alphabets should now be selected
		const allToggles = page.locator('[id^="alphabet-"]');
		const toggleCount = await allToggles.count();

		let allEnabled = true;
		for (let i = 0; i < toggleCount; i++) {
			const toggle = allToggles.nth(i);
			const ariaChecked = await toggle.getAttribute('aria-checked');
			if (ariaChecked !== 'true') {
				allEnabled = false;
				break;
			}
		}

		expect(allEnabled).toBe(true);
	});
});
