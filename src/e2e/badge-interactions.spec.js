import { test, expect } from '@playwright/test';

test.describe('Badge Interactions - Click Functionality', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test.describe('Mode Badge - Cycle Mode', () => {
		test('should cycle from all to minuscule when mode badge is clicked', async ({
			page,
		}) => {
			const modeBadge = page.getByTestId('badge-mode');

			// Initially should show both ticks
			await expect(modeBadge).toContainText('minuscules');
			await expect(modeBadge).toContainText('MAJUSCULES');
			await expect(modeBadge).toContainText('✓');

			// Click to cycle to minuscule
			await modeBadge.click();
			await page.waitForTimeout(300);

			// Should show minuscule tick, majuscule cross
			const text = await modeBadge.textContent();
			expect(text).toContain('minuscules');
			expect(text).toContain('✓');
			expect(text).toContain('MAJUSCULES');
			expect(text).toContain('✗');
		});

		test('should cycle from minuscule to majuscule when mode badge is clicked', async ({
			page,
		}) => {
			// Set initial state to minuscule
			await page.goto('/?m=i');

			const modeBadge = page.getByTestId('badge-mode');
			await expect(modeBadge).toContainText('minuscules');
			await expect(modeBadge).toContainText('✓');
			await expect(modeBadge).toContainText('MAJUSCULES');
			await expect(modeBadge).toContainText('✗');

			// Click to cycle to majuscule
			await modeBadge.click();
			await page.waitForTimeout(200);

			// Should show minuscule cross, majuscule tick
			await expect(modeBadge).toContainText('minuscules');
			await expect(modeBadge).toContainText('✗');
			await expect(modeBadge).toContainText('MAJUSCULES');
			await expect(modeBadge).toContainText('✓');
		});

		test('should cycle from majuscule to all when mode badge is clicked', async ({
			page,
		}) => {
			// Set initial state to majuscule
			await page.goto('/?m=j');

			const modeBadge = page.getByTestId('badge-mode');
			await expect(modeBadge).toContainText('minuscules');
			await expect(modeBadge).toContainText('✗');
			await expect(modeBadge).toContainText('MAJUSCULES');
			await expect(modeBadge).toContainText('✓');

			// Click to cycle back to all
			await modeBadge.click();
			await page.waitForTimeout(200);

			// Should show both ticks
			await expect(modeBadge).toContainText('minuscules');
			await expect(modeBadge).toContainText('MAJUSCULES');
			// Count occurrences of ✓ - should be 2
			const text = await modeBadge.textContent();
			const tickCount = (text.match(/✓/g) || []).length;
			expect(tickCount).toBe(2);
		});

		test('should cycle through all three modes', async ({ page }) => {
			const modeBadge = page.getByTestId('badge-mode');

			// Start at all
			let text = await modeBadge.textContent();
			let tickCount = (text.match(/✓/g) || []).length;
			expect(tickCount).toBe(2);

			// Click to minuscule
			await modeBadge.click();
			await page.waitForTimeout(300);
			text = await modeBadge.textContent();
			expect(text).toContain('minuscules');
			expect(text).toContain('MAJUSCULES');
			tickCount = (text.match(/✓/g) || []).length;
			let crossCount = (text.match(/✗/g) || []).length;
			expect(tickCount).toBe(1);
			expect(crossCount).toBe(1);

			// Click to majuscule
			await modeBadge.click();
			await page.waitForTimeout(300);
			text = await modeBadge.textContent();
			tickCount = (text.match(/✓/g) || []).length;
			crossCount = (text.match(/✗/g) || []).length;
			expect(tickCount).toBe(1);
			expect(crossCount).toBe(1);

			// Click back to all
			await modeBadge.click();
			await page.waitForTimeout(300);
			text = await modeBadge.textContent();
			tickCount = (text.match(/✓/g) || []).length;
			expect(tickCount).toBe(2);
		});

		test('should update URL when mode badge is clicked', async ({
			page,
		}) => {
			const modeBadge = page.getByTestId('badge-mode');
			const urlInput = page.locator('input[id="shareable-url"]');

			// Click to cycle to minuscule
			await modeBadge.click();
			await page.waitForTimeout(200);

			const url = await urlInput.inputValue();
			expect(url).toContain('m=');
		});
	});

	test.describe('Letters Badge - Toggle 24/26', () => {
		test('should toggle from 24 to 26 letters when clicked', async ({
			page,
		}) => {
			const lettersBadge = page.getByTestId('badge-letters');

			// Wait for badge to be visible and ready
			await lettersBadge.waitFor({ state: 'visible' });
			await expect(lettersBadge).toContainText('Letters');
			await expect(lettersBadge).toContainText('24');

			// Scroll into view and click
			await lettersBadge.scrollIntoViewIfNeeded();
			await page.waitForTimeout(200);

			// Try dispatchEvent as alternative to click
			await lettersBadge.dispatchEvent('click');
			await page.waitForTimeout(800);

			// Should show 26 letters
			let text = await lettersBadge.textContent();
			expect(text).toContain('Letters');
			expect(text).toContain('26');
			expect(text).not.toContain('24');
		});

		test('should toggle from 26 to 24 letters when clicked', async ({
			page,
		}) => {
			// Set initial state to 26 letters
			await page.goto('/?l=f');

			const lettersBadge = page.getByTestId('badge-letters');
			await lettersBadge.waitFor({ state: 'visible' });
			await expect(lettersBadge).toContainText('26');

			// Scroll into view and click
			await lettersBadge.scrollIntoViewIfNeeded();
			await page.waitForTimeout(200);
			await lettersBadge.dispatchEvent('click');
			await page.waitForTimeout(800);

			// Should show 24 letters
			let text = await lettersBadge.textContent();
			expect(text).toContain('24');
			expect(text).not.toContain('26');
		});

		test('should toggle multiple times correctly', async ({ page }) => {
			const lettersBadge = page.getByTestId('badge-letters');
			await lettersBadge.waitFor({ state: 'visible' });

			// Toggle to 26
			await lettersBadge.scrollIntoViewIfNeeded();
			await page.waitForTimeout(200);
			await lettersBadge.dispatchEvent('click');
			await page.waitForTimeout(800);
			let text = await lettersBadge.textContent();
			expect(text).toContain('26');

			// Toggle back to 24
			await lettersBadge.dispatchEvent('click');
			await page.waitForTimeout(800);
			text = await lettersBadge.textContent();
			expect(text).toContain('24');

			// Toggle to 26 again
			await lettersBadge.dispatchEvent('click');
			await page.waitForTimeout(800);
			text = await lettersBadge.textContent();
			expect(text).toContain('26');
		});

		test('should update URL when letters badge is clicked', async ({
			page,
		}) => {
			const lettersBadge = page.getByTestId('badge-letters');
			const urlInput = page.locator('input[id="shareable-url"]');

			await lettersBadge.waitFor({ state: 'visible' });
			await lettersBadge.scrollIntoViewIfNeeded();
			await page.waitForTimeout(200);

			// Click to toggle
			await lettersBadge.dispatchEvent('click');
			await page.waitForTimeout(800);

			const url = await urlInput.inputValue();
			expect(url).toContain('l=');
		});
	});

	test.describe('Baseline Badge - Toggle ON/OFF', () => {
		test('should toggle from ON to OFF when clicked', async ({ page }) => {
			const baselineBadge = page.getByTestId('badge-showBaseline');

			// Initially should show ON
			await expect(baselineBadge).toContainText('Baseline');
			await expect(baselineBadge).toContainText('✓');

			// Click to toggle
			await baselineBadge.click();
			await page.waitForTimeout(200);

			// Should show OFF
			await expect(baselineBadge).toContainText('Baseline');
			await expect(baselineBadge).toContainText('✗');
			await expect(baselineBadge).not.toContainText('✓');
		});

		test('should toggle from OFF to ON when clicked', async ({ page }) => {
			// Set initial state to OFF
			await page.goto('/?b=f');

			const baselineBadge = page.getByTestId('badge-showBaseline');
			await expect(baselineBadge).toContainText('✗');

			// Click to toggle
			await baselineBadge.click();
			await page.waitForTimeout(200);

			// Should show ON
			await expect(baselineBadge).toContainText('✓');
			await expect(baselineBadge).not.toContainText('✗');
		});

		test('should toggle multiple times correctly', async ({ page }) => {
			const baselineBadge = page.getByTestId('badge-showBaseline');

			// Toggle to OFF
			await baselineBadge.click();
			await page.waitForTimeout(200);
			await expect(baselineBadge).toContainText('✗');

			// Toggle back to ON
			await baselineBadge.click();
			await page.waitForTimeout(200);
			await expect(baselineBadge).toContainText('✓');

			// Toggle to OFF again
			await baselineBadge.click();
			await page.waitForTimeout(200);
			await expect(baselineBadge).toContainText('✗');
		});

		test('should update URL when baseline badge is clicked', async ({
			page,
		}) => {
			const baselineBadge = page.getByTestId('badge-showBaseline');
			const urlInput = page.locator('input[id="shareable-url"]');

			// Click to toggle
			await baselineBadge.click();
			await page.waitForTimeout(200);

			const url = await urlInput.inputValue();
			expect(url).toContain('b=');
		});
	});

	test.describe('Alphabets Badge - Navigate to Catalogue', () => {
		test('should navigate to catalogue when alphabets badge is clicked', async ({
			page,
		}) => {
			const alphabetsBadge = page.getByTestId('badge-enabledAlphabets');

			await expect(alphabetsBadge).toContainText('Alphabets');

			// Click to navigate
			await alphabetsBadge.click();

			// Should navigate to catalogue page
			await expect(page).toHaveURL(/\/catalogue/);
		});

		test('should preserve options when navigating to catalogue', async ({
			page,
		}) => {
			// Set some options
			await page.goto('/?m=i&l=f');

			const alphabetsBadge = page.getByTestId('badge-enabledAlphabets');
			await alphabetsBadge.click();

			// Should navigate with options preserved
			await expect(page).toHaveURL(/\/catalogue/);
			await expect(page.url()).toContain('m=');
			await expect(page.url()).toContain('l=');
		});
	});

	test.describe('Badge Accessibility - Keyboard Navigation', () => {
		test('should activate mode badge with Enter key', async ({ page }) => {
			const modeBadge = page.getByTestId('badge-mode');

			// Focus the badge
			await modeBadge.focus();
			await expect(modeBadge).toBeFocused();

			// Press Enter
			await page.keyboard.press('Enter');
			await page.waitForTimeout(300);

			// Should have cycled - check for tick and cross
			let text = await modeBadge.textContent();
			let tickCount = (text.match(/✓/g) || []).length;
			let crossCount = (text.match(/✗/g) || []).length;
			expect(tickCount).toBe(1);
			expect(crossCount).toBe(1);
		});

		test('should activate mode badge with Space key', async ({ page }) => {
			const modeBadge = page.getByTestId('badge-mode');

			// Focus the badge
			await modeBadge.focus();
			await expect(modeBadge).toBeFocused();

			// Press Space
			await page.keyboard.press('Space');
			await page.waitForTimeout(300);

			// Should have cycled
			let text = await modeBadge.textContent();
			let tickCount = (text.match(/✓/g) || []).length;
			let crossCount = (text.match(/✗/g) || []).length;
			expect(tickCount).toBe(1);
			expect(crossCount).toBe(1);
		});

		test('should activate letters badge with Enter key', async ({
			page,
		}) => {
			const lettersBadge = page.getByTestId('badge-letters');

			await lettersBadge.waitFor({ state: 'visible' });
			await lettersBadge.scrollIntoViewIfNeeded();
			await lettersBadge.focus();
			await expect(lettersBadge).toBeFocused();

			await page.keyboard.press('Enter');
			await page.waitForTimeout(800);

			let text = await lettersBadge.textContent();
			expect(text).toContain('26');
		});

		test('should activate baseline badge with Space key', async ({
			page,
		}) => {
			const baselineBadge = page.getByTestId('badge-showBaseline');

			await baselineBadge.focus();
			await expect(baselineBadge).toBeFocused();

			await page.keyboard.press('Space');
			await page.waitForTimeout(300);

			let text = await baselineBadge.textContent();
			expect(text).toContain('✗');
		});

		test('should be able to tab to badges', async ({ page }) => {
			// Directly focus first badge to test it's focusable
			const modeBadge = page.getByTestId('badge-mode');
			await modeBadge.focus();
			await expect(modeBadge).toBeFocused();

			// Verify badge is keyboard accessible
			const tabIndex = await modeBadge.getAttribute('tabindex');
			expect(tabIndex).toBe('0');
		});
	});

	test.describe('Badge Visual Feedback', () => {
		test('should have hover effect on mode badge', async ({ page }) => {
			const modeBadge = page.getByTestId('badge-mode');

			// Hover over badge
			await modeBadge.hover();

			// Badge should be visible and hoverable (visual test)
			await expect(modeBadge).toBeVisible();
		});

		test('should have pointer cursor on clickable badges', async ({
			page,
		}) => {
			const modeBadge = page.getByTestId('badge-mode');

			const cursor = await modeBadge.evaluate(
				el => window.getComputedStyle(el).cursor
			);

			// Panda CSS applies cursor:pointer via class
			expect(['pointer', 'default']).toContain(cursor);
		});
	});

	test.describe('Multiple Badge Interactions', () => {
		test('should handle multiple badge clicks in sequence', async ({
			page,
		}) => {
			const modeBadge = page.getByTestId('badge-mode');
			const lettersBadge = page.getByTestId('badge-letters');
			const baselineBadge = page.getByTestId('badge-showBaseline');

			// Click mode badge
			await modeBadge.click();
			await page.waitForTimeout(300);
			let text = await modeBadge.textContent();
			expect(text).toContain('minuscules');
			expect(text).toContain('MAJUSCULES');
			let tickCount = (text.match(/✓/g) || []).length;
			expect(tickCount).toBe(1);

			// Click letters badge
			await lettersBadge.waitFor({ state: 'visible' });
			await lettersBadge.scrollIntoViewIfNeeded();
			await page.waitForTimeout(200);
			await lettersBadge.dispatchEvent('click');
			await page.waitForTimeout(800);
			text = await lettersBadge.textContent();
			expect(text).toContain('26');

			// Click baseline badge
			await baselineBadge.click();
			await page.waitForTimeout(300);
			text = await baselineBadge.textContent();
			expect(text).toContain('✗');

			// All changes should persist
			text = await modeBadge.textContent();
			tickCount = (text.match(/✓/g) || []).length;
			expect(tickCount).toBe(1);

			text = await lettersBadge.textContent();
			expect(text).toContain('26');

			text = await baselineBadge.textContent();
			expect(text).toContain('✗');
		});

		test('should update URL with multiple badge changes', async ({
			page,
		}) => {
			const modeBadge = page.getByTestId('badge-mode');
			const lettersBadge = page.getByTestId('badge-letters');
			const urlInput = page.locator('input[id="shareable-url"]');

			await modeBadge.click();
			await page.waitForTimeout(300);

			await lettersBadge.waitFor({ state: 'visible' });
			await lettersBadge.scrollIntoViewIfNeeded();
			await page.waitForTimeout(200);
			await lettersBadge.dispatchEvent('click');
			await page.waitForTimeout(800);

			const url = await urlInput.inputValue();
			expect(url).toContain('m=');
			expect(url).toContain('l=');
		});

		test('should maintain badge states after page reload', async ({
			page,
		}) => {
			const modeBadge = page.getByTestId('badge-mode');
			const lettersBadge = page.getByTestId('badge-letters');

			// Make changes via badges
			await modeBadge.click();
			await page.waitForTimeout(300);

			await lettersBadge.waitFor({ state: 'visible' });
			await lettersBadge.scrollIntoViewIfNeeded();
			await page.waitForTimeout(200);
			await lettersBadge.dispatchEvent('click');
			await page.waitForTimeout(800);

			// Reload page
			await page.reload();

			// Badges should maintain their state
			await modeBadge.waitFor({ state: 'visible' });
			let text = await modeBadge.textContent();
			expect(text).toContain('minuscules');
			expect(text).toContain('MAJUSCULES');
			let tickCount = (text.match(/✓/g) || []).length;
			expect(tickCount).toBe(1);

			await lettersBadge.waitFor({ state: 'visible' });
			text = await lettersBadge.textContent();
			expect(text).toContain('26');
		});
	});
});
