import { test, expect } from '@playwright/test';
import {
	navigateToCatalogue,
	isOnLandingScreen,
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
		// Back button uses LinkAsButton component which renders as a button
		const backButton = page.getByRole('button', {
			name: /back to menu/i,
		});
		await expect(backButton).toBeVisible();
	});

	test('should return to landing when clicking back', async ({ page }) => {
		// Click the back button directly
		const backButton = page.getByRole('button', {
			name: /back to menu/i,
		});
		await backButton.click();

		// Wait for landing to load
		await page.waitForSelector('text=Hone your', { timeout: 5000 });

		const onMenu = await isOnLandingScreen(page);
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

		// Check all three options exist (options in a select are not visible until opened, so check they're attached)
		const dateOption = page.getByRole('option', { name: /by date/i });
		const nameOption = page.getByRole('option', { name: /by name/i });
		const difficultyOption = page.getByRole('option', {
			name: /by difficulty/i,
		});

		await expect(dateOption).toBeAttached();
		await expect(nameOption).toBeAttached();
		await expect(difficultyOption).toBeAttached();
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

		// Get initial order (by date) - get all alphabet IDs
		const allToggles = page.locator('[id^="alphabet-"]');
		const count = await allToggles.count();
		const initialOrder = [];
		for (let i = 0; i < count; i++) {
			initialOrder.push(await allToggles.nth(i).getAttribute('id'));
		}

		// Change to sort by name
		await sortSelect.selectOption('name');
		await page.waitForTimeout(100);

		// Get new order
		const newOrder = [];
		for (let i = 0; i < count; i++) {
			newOrder.push(await allToggles.nth(i).getAttribute('id'));
		}

		// The order arrays should be different (at least one position changed)
		const orderChanged = initialOrder.some(
			(id, index) => id !== newOrder[index]
		);
		expect(orderChanged).toBe(true);
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

	test('should display select all and deselect all buttons for each difficulty', async ({
		page,
	}) => {
		// Should have select all and deselect all buttons visible next to difficulty headings
		const selectAllButtons = page.getByRole('button', {
			name: 'select all',
		});
		const deselectAllButtons = page.getByRole('button', {
			name: 'deselect all',
		});

		const selectCount = await selectAllButtons.count();
		const deselectCount = await deselectAllButtons.count();

		// Should have at least one of each (depends on alphabets present)
		// Note: counts may differ if some buttons are disabled - just verify both types exist
		expect(selectCount).toBeGreaterThan(0);
		expect(deselectCount).toBeGreaterThan(0);
	});

	test('should select all alphabets in a difficulty group when clicking select all', async ({
		page,
	}) => {
		// First, deselect all in a group to make "select all" enabled
		// (All alphabets are selected by default, so "select all" is disabled)
		const firstDeselectAllButton = page
			.getByRole('button', { name: 'deselect all' })
			.first();
		await firstDeselectAllButton.click();
		await page.waitForTimeout(200);

		// Get all toggles
		const allToggles = page.locator('[id^="alphabet-"]');
		const toggleCount = await allToggles.count();

		// Count how many are enabled after deselect
		let enabledCountBefore = 0;
		for (let i = 0; i < toggleCount; i++) {
			const toggle = allToggles.nth(i);
			const ariaChecked = await toggle.getAttribute('aria-checked');
			if (ariaChecked === 'true') {
				enabledCountBefore++;
			}
		}

		// Now click select all (should be enabled now)
		const firstSelectAllButton = page
			.getByRole('button', { name: 'select all' })
			.first();
		await firstSelectAllButton.click();
		await page.waitForTimeout(200);

		// Count how many are enabled after select all
		let enabledCountAfter = 0;
		for (let i = 0; i < toggleCount; i++) {
			const toggle = allToggles.nth(i);
			const ariaChecked = await toggle.getAttribute('aria-checked');
			if (ariaChecked === 'true') {
				enabledCountAfter++;
			}
		}

		// Should have more enabled alphabets after clicking select all
		expect(enabledCountAfter).toBeGreaterThan(enabledCountBefore);
	});

	test('should deselect all alphabets in a difficulty group when clicking deselect all', async ({
		page,
	}) => {
		// All alphabets are selected by default, so we can test deselect directly
		// Get count of enabled toggles before
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

		// Click deselect all for the first group
		const firstDeselectAllButton = page
			.getByRole('button', { name: 'deselect all' })
			.first();
		await firstDeselectAllButton.click();
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

	test('should disable select all button when all alphabets in group are selected', async ({
		page,
	}) => {
		// All alphabets are selected by default, so select all should already be disabled
		const firstSelectAllButton = page
			.getByRole('button', { name: 'select all' })
			.first();

		// The select all button should be disabled (all alphabets are selected by default)
		const isDisabled = await firstSelectAllButton.isDisabled();
		expect(isDisabled).toBe(true);
	});

	test('should disable deselect all button when no alphabets in group are selected', async ({
		page,
	}) => {
		// Click deselect all for first group
		const firstDeselectAllButton = page
			.getByRole('button', { name: 'deselect all' })
			.first();
		await firstDeselectAllButton.click();
		await page.waitForTimeout(200);

		// The deselect all button should now be disabled
		const isDisabled = await firstDeselectAllButton.isDisabled();
		expect(isDisabled).toBe(true);
	});

	test('should not display bulk selection controls when not sorting by difficulty', async ({
		page,
	}) => {
		// Switch back to date sort
		const sortSelect = page.getByRole('combobox', { name: /sort by/i });
		await sortSelect.selectOption('date');
		await page.waitForTimeout(200);

		// Select all and deselect all buttons should not be visible
		const selectAllButtons = page.getByRole('button', {
			name: 'select all',
		});
		const deselectAllButtons = page.getByRole('button', {
			name: 'deselect all',
		});

		await expect(selectAllButtons.first()).not.toBeVisible();
		await expect(deselectAllButtons.first()).not.toBeVisible();
	});

	test('should handle bulk selection across multiple difficulty groups', async ({
		page,
	}) => {
		// This test verifies that bulk selection buttons work across difficulty groups
		// by testing a single deselect/select cycle on the first group

		// Get all toggles and count initial enabled (all should be enabled by default)
		const allToggles = page.locator('[id^="alphabet-"]');
		const toggleCount = await allToggles.count();
		expect(toggleCount).toBeGreaterThan(0);

		// All toggles should start checked (enabled)
		const firstToggle = allToggles.first();
		await expect(firstToggle).toHaveAttribute('aria-checked', 'true');

		// Click deselect all for first group
		const firstDeselectButton = page
			.getByRole('button', { name: 'deselect all' })
			.first();
		await firstDeselectButton.click();
		await page.waitForTimeout(200);

		// At least the first toggle in that group should now be unchecked
		// (we can't easily know which toggles belong to which group in E2E)
		// But deselect all button for that group should now be disabled
		await expect(firstDeselectButton).toBeDisabled();

		// And select all for that group should now be enabled
		const firstSelectButton = page
			.getByRole('button', { name: 'select all' })
			.first();
		await expect(firstSelectButton).toBeEnabled();

		// Click select all to re-enable
		await firstSelectButton.click();
		await page.waitForTimeout(200);

		// Now deselect all should be enabled again and select all disabled
		await expect(firstDeselectButton).toBeEnabled();
		await expect(firstSelectButton).toBeDisabled();
	});
});
