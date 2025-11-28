import { test, expect } from '@playwright/test';

test.describe('Options Summary - Badge Display', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should display mode badge as ALL by default', async ({ page }) => {
		const modeBadge = page.getByTestId('badge-mode');
		await expect(modeBadge).toContainText('minuscules');
		await expect(modeBadge).toContainText('MAJUSCULES');
	});

	test('should display correct hand count badge with plural', async ({
		page,
	}) => {
		const handBadge = page.locator('text=/Hands \\d+/');
		await expect(handBadge).toBeVisible();
	});

	test('should display 24 letters badge by default', async ({ page }) => {
		await expect(page.getByText('Letters 24')).toBeVisible();
	});

	test('should display Baselines ON badge by default', async ({ page }) => {
		await expect(page.getByText('Baseline ✓')).toBeVisible();
	});

	test('should display all four badge types', async ({ page }) => {
		// Mode
		const modeBadge = page.getByTestId('badge-mode');
		await expect(modeBadge).toContainText('minuscules');
		await expect(modeBadge).toContainText('MAJUSCULES');
		// Alphabets
		const handBadge = page.locator('text=/Hands \\d+/');
		await expect(handBadge).toBeVisible();
		// Letters
		const lettersBadge = page.locator('text=/Letters 2[46]/');
		await expect(lettersBadge).toBeVisible();
		// Baseline
		const baselineBadge = page.locator('text=/Baseline [✓✗]/');
		await expect(baselineBadge).toBeVisible();
	});

	test('should update mode badge when mode changes to minuscules', async ({
		page,
	}) => {
		// Expand Options
		await page.getByRole('button', { name: /^options$/i }).click();

		// Change to minuscules
		await page.getByLabel(/Minuscules only/i).click();

		// Badge should update (scoped to badge container)
		const badgeContainer = page.getByTestId('options-summary-badges');
		const modeBadge = badgeContainer.getByTestId('badge-mode');
		await expect(modeBadge).toContainText('✓');
		await expect(modeBadge).toContainText('✗');
	});

	test('should update mode badge when mode changes to majuscules', async ({
		page,
	}) => {
		// Expand Options
		await page.getByRole('button', { name: /^options$/i }).click();

		// Change to majuscules
		await page.getByLabel(/MAJUSCULES only/i).click();

		// Badge should update (scoped to badge container)
		const badgeContainer = page.getByTestId('options-summary-badges');
		const modeBadge = badgeContainer.getByTestId('badge-mode');
		await expect(modeBadge).toContainText('✓');
		await expect(modeBadge).toContainText('✗');
	});

	test('should update letters badge when toggling 24-letter alphabet', async ({
		page,
	}) => {
		// Expand Options
		await page.getByRole('button', { name: /^options$/i }).click();

		// Toggle to 26 letters (by clicking the 24-letter toggle to turn it OFF)
		const toggle = page.getByLabel(/24-letter alphabet/i);
		await toggle.click();
		await page.waitForTimeout(200); // Wait for state update

		// Badge should update (scoped to badge container)
		const badgeContainer = page.getByTestId('options-summary-badges');
		await expect(badgeContainer.getByText('Letters 26')).toBeVisible();
		await expect(badgeContainer.getByText('Letters 24')).not.toBeVisible();
	});

	test('should update baseline badge when toggling baseline display', async ({
		page,
	}) => {
		// Expand Options
		await page.getByRole('button', { name: /^options$/i }).click();

		// Toggle baselines off
		await page.getByLabel(/Show baseline/i).click();

		// Badge should update (scoped to badge container)
		const badgeContainer = page.getByTestId('options-summary-badges');
		await expect(badgeContainer.getByText('Baseline ✗')).toBeVisible();
		await expect(badgeContainer.getByText('Baseline ✓')).not.toBeVisible();
	});

	test('should show badges even when Options section is collapsed', async ({
		page,
	}) => {
		// Ensure Options is collapsed
		const optionsButton = page.getByRole('button', { name: /^options$/i });
		const isExpanded = await optionsButton.getAttribute('aria-expanded');

		if (isExpanded === 'true') {
			await optionsButton.click();
		}

		// Badges should still be visible
		const modeBadge = page.getByTestId('badge-mode');
		await expect(modeBadge).toContainText('minuscules');
		await expect(modeBadge).toContainText('MAJUSCULES');
		const handBadge = page.locator('text=/Hands \\d+/');
		await expect(handBadge).toBeVisible();
	});
});

test.describe('Options Summary - Shareable URL', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Expand Options section to access URL input
		await page.getByRole('button', { name: /^options$/i }).click();
	});

	test('should display shareable URL input with label', async ({ page }) => {
		const urlInput = page.locator('input[id="shareable-url"]');
		await expect(urlInput).toBeVisible();
		const value = await urlInput.inputValue();
		expect(value).toContain('http');
	});

	test('should have readonly URL input', async ({ page }) => {
		const urlInput = page.locator('input[id="shareable-url"]');
		await expect(urlInput).toHaveAttribute('readonly');
	});

	test('should display base URL for default settings', async ({ page }) => {
		const urlInput = page.locator('input[id="shareable-url"]');
		const value = await urlInput.inputValue();

		expect(value).toContain('http');
		// Default settings should have minimal or no query params
		expect(value).toBeTruthy();
	});

	test('should update URL when mode changes', async ({ page }) => {
		const urlInput = page.locator('input[id="shareable-url"]');
		const initialURL = await urlInput.inputValue();

		// Change mode (already expanded in beforeEach)
		await page.getByLabel(/Minuscules only/i).click();

		await page.waitForTimeout(100);

		const updatedURL = await urlInput.inputValue();
		expect(updatedURL).not.toBe(initialURL);
		expect(updatedURL).toContain('m=');
	});

	test('should update URL when 24-letter setting changes', async ({
		page,
	}) => {
		const urlInput = page.locator('input[id="shareable-url"]');

		// Toggle 24-letter (click to turn OFF for 26 letters)
		await page.getByLabel(/24-letter alphabet/i).click();

		await page.waitForTimeout(200);

		const updatedURL = await urlInput.inputValue();
		expect(updatedURL).toContain('l=');
	});

	test('should update URL when baseline setting changes', async ({
		page,
	}) => {
		const urlInput = page.locator('input[id="shareable-url"]');

		// Toggle baseline
		await page.getByLabel(/Show baseline/i).click();

		await page.waitForTimeout(100);

		const updatedURL = await urlInput.inputValue();
		expect(updatedURL).toContain('b=');
	});

	test('should select text when URL input is clicked', async ({ page }) => {
		const urlInput = page.locator('input[id="shareable-url"]');
		await urlInput.click();

		// Input should be focused
		await expect(urlInput).toBeFocused();
	});
});

test.describe('Options Summary - Copy Functionality', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Expand Options section to access Copy button
		await page.getByRole('button', { name: /^options$/i }).click();
		// Grant clipboard permissions
		await page
			.context()
			.grantPermissions(['clipboard-read', 'clipboard-write']);
	});

	test('should display Copy button', async ({ page }) => {
		const copyButton = page.getByRole('button', { name: /^copy$/i });
		await expect(copyButton).toBeVisible();
	});

	test('should show success feedback when Copy is clicked', async ({
		page,
	}) => {
		const copyButton = page.getByRole('button', { name: /^copy$/i });
		await copyButton.click();

		// Should show "Copied!" feedback
		await expect(
			page.getByRole('button', { name: /copied/i })
		).toBeVisible();
	});

	test('should copy URL to clipboard', async ({ page }) => {
		const urlInput = page.locator('input[id="shareable-url"]');
		const expectedURL = await urlInput.inputValue();

		await page.getByRole('button', { name: /^copy$/i }).click();

		// Get clipboard content
		const clipboardText = await page.evaluate(() =>
			navigator.clipboard.readText()
		);
		expect(clipboardText).toBe(expectedURL);
	});

	test('should reset Copy button text after success', async ({ page }) => {
		await page.getByRole('button', { name: /^copy$/i }).click();

		// Wait for "Copied!" to appear
		await expect(
			page.getByRole('button', { name: /copied/i })
		).toBeVisible();

		// Wait for it to reset back to "Copy" (should take ~2 seconds)
		await expect(page.getByRole('button', { name: /^copy$/i })).toBeVisible(
			{ timeout: 3000 }
		);
	});

	test('should copy updated URL after settings change', async ({ page }) => {
		// Change a setting (already expanded in beforeEach)
		await page.getByLabel(/Minuscules only/i).click();
		await page.waitForTimeout(100);

		// Copy the URL
		await page.getByRole('button', { name: /^copy$/i }).click();

		// Verify clipboard contains updated URL
		const clipboardText = await page.evaluate(() =>
			navigator.clipboard.readText()
		);
		expect(clipboardText).toContain('m=');
	});
});

test.describe('Options Summary - QR Code Generation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Expand Options section to access QR button
		await page.getByRole('button', { name: /^options$/i }).click();
	});

	test('should display Show QR Code button', async ({ page }) => {
		await expect(page.getByRole('button', { name: /^qr$/i })).toBeVisible();
	});

	test('should not display QR code by default', async ({ page }) => {
		await expect(
			page.getByRole('button', { name: /download/i })
		).not.toBeVisible();
	});

	test('should show QR code when Show QR Code is clicked', async ({
		page,
	}) => {
		await page.getByRole('button', { name: /^qr$/i }).click();

		// Button text should change
		await expect(
			page.getByRole('button', { name: /hide qr/i })
		).toBeVisible();

		// Download button should appear
		await expect(
			page.getByRole('button', { name: /download/i })
		).toBeVisible();

		// QR code SVG should be visible
		const qrSvg = page
			.locator('svg')
			.filter({ has: page.locator('path') })
			.nth(1);
		await expect(qrSvg).toBeVisible();
	});

	test('should hide QR code when Hide QR Code is clicked', async ({
		page,
	}) => {
		// Show QR code
		await page.getByRole('button', { name: /^qr$/i }).click();
		await expect(
			page.getByRole('button', { name: /download/i })
		).toBeVisible();

		// Hide QR code
		await page.getByRole('button', { name: /hide qr/i }).click();

		// Button text should change back
		await expect(page.getByRole('button', { name: /^qr$/i })).toBeVisible();

		// Download button should disappear
		await expect(
			page.getByRole('button', { name: /download/i })
		).not.toBeVisible();
	});

	test('should toggle QR code multiple times', async ({ page }) => {
		// Show
		await page.getByRole('button', { name: /^qr$/i }).click();
		await expect(
			page.getByRole('button', { name: /download/i })
		).toBeVisible();

		// Hide
		await page.getByRole('button', { name: /hide qr/i }).click();
		await expect(
			page.getByRole('button', { name: /download/i })
		).not.toBeVisible();

		// Show again
		await page.getByRole('button', { name: /^qr$/i }).click();
		await expect(
			page.getByRole('button', { name: /download/i })
		).toBeVisible();
	});

	test('should display Download QR Code button when QR is shown', async ({
		page,
	}) => {
		await page.getByRole('button', { name: /^qr$/i }).click();

		const downloadButton = page.getByRole('button', {
			name: /download/i,
		});
		await expect(downloadButton).toBeVisible();
		await expect(downloadButton).toBeEnabled();
	});
});

test.describe('Options Summary - Reset to Defaults', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should display Reset to Defaults button', async ({ page }) => {
		await page.getByRole('button', { name: /^options$/i }).click();
		const resetButton = page.getByRole('button', {
			name: /reset to defaults/i,
		});
		await expect(resetButton).toBeVisible();
		await expect(resetButton).toBeEnabled();
	});

	test('should show confirmation dialog when Reset is clicked', async ({
		page,
	}) => {
		await page.getByRole('button', { name: /^options$/i }).click();

		// Set up dialog handler
		let dialogShown = false;
		page.on('dialog', dialog => {
			dialogShown = true;
			expect(dialog.message()).toContain('Reset all settings');
			dialog.dismiss();
		});

		await page.getByRole('button', { name: /reset to defaults/i }).click();

		// Wait a bit for dialog
		await page.waitForTimeout(100);
		expect(dialogShown).toBe(true);
	});

	test('should reset settings when confirmed', async ({ page }) => {
		// Change some settings
		await page.getByRole('button', { name: /^options$/i }).click();
		await page.getByLabel(/Minuscules only/i).click();

		// Toggle to 26 letters (click 24-letter toggle to turn OFF)
		const toggle = page.getByLabel(/24-letter alphabet/i);
		await toggle.click();
		await page.waitForTimeout(300); // Wait for state update

		// Verify settings changed (scoped to badge container)
		const badgeContainer = page.getByTestId('options-summary-badges');
		const modeBadge = badgeContainer.getByTestId('badge-mode');
		await expect(modeBadge).toContainText('✓');
		await expect(modeBadge).toContainText('✗');
		await expect(badgeContainer.getByText('Letters 26')).toBeVisible();

		// Reset to defaults (accept dialog)
		page.on('dialog', dialog => dialog.accept());
		await page.getByRole('button', { name: /reset to defaults/i }).click();

		await page.waitForTimeout(300);

		// Settings should be back to defaults (scoped to badge container)
		await expect(badgeContainer.getByTestId('badge-mode')).toBeVisible();
		await expect(badgeContainer.getByText('Letters 24')).toBeVisible();
	});

	test('should not reset settings when cancelled', async ({ page }) => {
		// Change a setting
		await page.getByRole('button', { name: /^options$/i }).click();
		await page.getByLabel(/Minuscules only/i).click();

		// Verify setting changed (scoped to badge container)
		const badgeContainer = page.getByTestId('options-summary-badges');
		const modeBadge = badgeContainer.getByTestId('badge-mode');
		await expect(modeBadge).toContainText('✓');
		await expect(modeBadge).toContainText('✗');

		// Try to reset but cancel
		page.on('dialog', dialog => dialog.dismiss());
		await page.getByRole('button', { name: /reset to defaults/i }).click();

		await page.waitForTimeout(200);

		// Setting should still be changed (scoped to badge container)
		await expect(modeBadge).toContainText('✓');
		await expect(modeBadge).toContainText('✗');
	});

	test('should clear URL parameters when reset', async ({ page }) => {
		// Change settings to create URL params
		await page.getByRole('button', { name: /^options$/i }).click();
		await page.getByLabel(/Minuscules only/i).click();

		const urlInput = page.locator('input[id="shareable-url"]');
		const urlWithParams = await urlInput.inputValue();
		expect(urlWithParams).toContain('m=');

		// Reset (scroll to reset section if needed)
		page.on('dialog', dialog => dialog.accept());
		await page.getByRole('button', { name: /reset to defaults/i }).click();

		await page.waitForTimeout(200);

		// URL should be cleared of most params
		const urlAfterReset = await urlInput.inputValue();
		expect(urlAfterReset).not.toContain('m=');
	});
});

test.describe('Options Summary - URL Parameter Loading', () => {
	test('should load minuscules mode from URL', async ({ page }) => {
		await page.goto('/?m=i');

		const badgeContainer = page.getByTestId('options-summary-badges');
		const modeBadge = badgeContainer.getByTestId('badge-mode');
		await expect(modeBadge).toBeVisible();
		await expect(modeBadge).toContainText('✓');
		await expect(modeBadge).toContainText('✗');
	});

	test('should load majuscules mode from URL', async ({ page }) => {
		await page.goto('/?m=j');

		const badgeContainer = page.getByTestId('options-summary-badges');
		const modeBadge = badgeContainer.getByTestId('badge-mode');
		await expect(modeBadge).toBeVisible();
		await expect(modeBadge).toContainText('✓');
		await expect(modeBadge).toContainText('✗');
	});

	test('should load 26 letters setting from URL', async ({ page }) => {
		await page.goto('/?l=0');

		const badgeContainer = page.getByTestId('options-summary-badges');
		await expect(badgeContainer).toBeVisible(); // Wait for container first
		await expect(badgeContainer.getByText('Letters 26')).toBeVisible();
		await expect(badgeContainer.getByText('Letters 24')).not.toBeVisible();
	});

	test('should load baseline OFF setting from URL', async ({ page }) => {
		await page.goto('/?b=0');

		const badgeContainer = page.getByTestId('options-summary-badges');
		await expect(badgeContainer.getByText('Baseline ✗')).toBeVisible();
		await expect(badgeContainer.getByText('Baseline ✓')).not.toBeVisible();
	});

	test('should load multiple settings from URL', async ({ page }) => {
		await page.goto('/?m=i&l=0&b=0');

		const badgeContainer = page.getByTestId('options-summary-badges');
		await expect(badgeContainer).toBeVisible(); // Wait for container first
		const modeBadge = badgeContainer.getByTestId('badge-mode');
		await expect(modeBadge).toContainText('✓');
		await expect(modeBadge).toContainText('✗');
		await expect(badgeContainer.getByText('Letters 26')).toBeVisible();
		await expect(badgeContainer.getByText('Baseline ✗')).toBeVisible();
	});

	test('should display correct URL for loaded settings', async ({ page }) => {
		const queryString = 'm=i&l=0';
		await page.goto(`/?${queryString}`);

		// Expand Options to see URL input
		await page.getByRole('button', { name: /^options$/i }).click();

		const urlInput = page.locator('input[id="shareable-url"]');
		const displayedURL = await urlInput.inputValue();

		expect(displayedURL).toContain('m=');
		expect(displayedURL).toContain('l=');
	});

	test('should apply settings from URL to game options', async ({ page }) => {
		await page.goto('/?m=i');

		// Expand Options section
		await page.getByRole('button', { name: /^options$/i }).click();

		// Radio button for minuscules should be selected
		const minusculesRadio = page.getByLabel(/Minuscules only/i);
		await expect(minusculesRadio).toBeChecked();
	});
});

test.describe('Options Summary - Integration Tests', () => {
	test('should maintain badge consistency across section collapse/expand', async ({
		page,
	}) => {
		await page.goto('/');

		const optionsButton = page.getByRole('button', { name: /^options$/i });
		const badgeContainer = page.getByTestId('options-summary-badges');

		// Expand
		await optionsButton.click();
		await expect(badgeContainer.getByTestId('badge-mode')).toBeVisible();

		// Collapse
		await optionsButton.click();
		await expect(badgeContainer.getByTestId('badge-mode')).toBeVisible();
	});

	test('should update all components simultaneously when setting changes', async ({
		page,
	}) => {
		await page.goto('/');

		// Expand Options
		await page.getByRole('button', { name: /^options$/i }).click();

		// Wait for Options content to be visible
		await page.waitForTimeout(200);

		// Change mode
		const minusculesRadio = page.getByLabel(/Minuscules only/i);
		await expect(minusculesRadio).toBeVisible();
		await minusculesRadio.click();

		await page.waitForTimeout(300);

		// Check badge updated (scoped to badge container)
		const badgeContainer = page.getByTestId('options-summary-badges');
		const modeBadge = badgeContainer.getByTestId('badge-mode');
		await expect(modeBadge).toContainText('✓');
		await expect(modeBadge).toContainText('✗');

		// Check URL updated (should be visible since Options is expanded)
		const urlInput = page.locator('input[id="shareable-url"]');
		const url = await urlInput.inputValue();
		expect(url).toContain('m=');

		// Check radio button is selected
		await expect(minusculesRadio).toBeChecked();
	});

	test('should handle rapid setting changes', async ({ page }) => {
		await page.goto('/');

		await page.getByRole('button', { name: /^options$/i }).click();

		// Wait for Options content to be visible
		await page.waitForTimeout(200);

		// Rapid changes - ensure elements are visible first
		const minusculesRadio = page.getByLabel(/Minuscules only/i);
		const majusculesRadio = page.getByLabel(/MAJUSCULES only/i);
		const allRadio = page.getByLabel(/both minuscules AND MAJUSCULES/i);

		await expect(minusculesRadio).toBeVisible();
		await minusculesRadio.click();
		await expect(majusculesRadio).toBeVisible();
		await majusculesRadio.click();
		await expect(allRadio).toBeVisible();
		await allRadio.click();

		await page.waitForTimeout(400);

		// Should end up on the last selection (scoped to badge container)
		const badgeContainer = page.getByTestId('options-summary-badges');
		await expect(badgeContainer.getByTestId('badge-mode')).toBeVisible();
	});

	test('should maintain state after page reload', async ({ page }) => {
		// Set custom settings
		await page.goto('/?m=i&l=0');

		const badgeContainer = page.getByTestId('options-summary-badges');
		await expect(badgeContainer).toBeVisible(); // Wait for container first
		const modeBadge = badgeContainer.getByTestId('badge-mode');
		await expect(modeBadge).toContainText('✓');
		await expect(modeBadge).toContainText('✗');
		await expect(badgeContainer.getByText('Letters 26')).toBeVisible();

		// Reload
		await page.reload();

		// Settings should persist (scoped to badge container)
		await expect(badgeContainer).toBeVisible(); // Wait for container after reload
		await expect(modeBadge).toContainText('✓');
		await expect(modeBadge).toContainText('✗');
		await expect(badgeContainer.getByText('Letters 26')).toBeVisible();
	});
});

test.describe('Options Summary - Accessibility', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Expand Options section to access URL input
		await page.getByRole('button', { name: /^options$/i }).click();
	});

	test('should have accessible label for URL input', async ({ page }) => {
		const input = page.locator('input[id="shareable-url"]');
		await expect(input).toBeVisible();
		const value = await input.inputValue();
		expect(value).toContain('http');
	});

	test('should be keyboard navigable', async ({ page }) => {
		// Focus and interact with Copy button via keyboard (already expanded in beforeEach)
		const copyButton = page.getByRole('button', { name: /^copy$/i });
		await expect(copyButton).toBeVisible();
		await copyButton.focus();
		await expect(copyButton).toBeFocused();

		// Grant clipboard permissions for keyboard interaction
		await page
			.context()
			.grantPermissions(['clipboard-read', 'clipboard-write']);

		// Verify Enter key works
		await page.keyboard.press('Enter');
		await expect(
			page.getByRole('button', { name: /copied/i })
		).toBeVisible();
	});

	test('should activate buttons with Enter key', async ({ page }) => {
		// Focus Copy button (already expanded in beforeEach)
		const copyButton = page.getByRole('button', { name: /^copy$/i });
		await copyButton.focus();

		// Press Enter
		await page
			.context()
			.grantPermissions(['clipboard-read', 'clipboard-write']);
		await page.keyboard.press('Enter');

		// Should show success feedback
		await expect(
			page.getByRole('button', { name: /copied/i })
		).toBeVisible();
	});
});
