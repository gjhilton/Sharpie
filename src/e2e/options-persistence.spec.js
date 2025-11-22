import { test, expect } from '@playwright/test';

test.describe('Options Persistence and Permalink', () => {
	test.beforeEach(async ({ page }) => {
		// Clear localStorage before each test
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
		await page.reload();
	});

	test.describe('Options Summary Display', () => {
		test('should show options summary when Options section is expanded', async ({
			page,
		}) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Check for options summary elements
			await expect(page.getByText(/both cases/i)).toBeVisible();
			await expect(page.getByText(/alphabets/i).first()).toBeVisible();
		});

		test('should show "Using default settings" source when no options loaded', async ({
			page,
		}) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			await expect(
				page.getByText(/Using default settings/i)
			).toBeVisible();
		});

		test('should have Reset to defaults link', async ({ page }) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			await expect(page.getByText('Reset to defaults')).toBeVisible();
		});

		test('should have Copy link to share button', async ({ page }) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			await expect(page.getByText('Copy link to share')).toBeVisible();
		});
	});

	test.describe('LocalStorage Persistence', () => {
		test('should persist game mode selection to localStorage', async ({
			page,
		}) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Change game mode to minuscules
			const minusculesRadio = page.getByRole('radio', {
				name: /minuscules only/i,
			});
			await minusculesRadio.click();

			// Reload the page
			await page.reload();

			// Expand options again and verify the selection persisted
			await optionsHeader.click();
			await expect(minusculesRadio).toBeChecked();
		});

		test('should persist 24-letter alphabet toggle to localStorage', async ({
			page,
		}) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const alphabetToggle = page.getByRole('switch', {
				name: /24-letter alphabet/i,
			});

			// Toggle on (default is off)
			await alphabetToggle.click();
			await expect(alphabetToggle).toBeChecked();

			// Reload the page
			await page.reload();

			// Expand options again and verify the toggle persisted
			await optionsHeader.click();
			await expect(alphabetToggle).toBeChecked();
		});

		test('should persist baseline toggle to localStorage', async ({
			page,
		}) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const baselineToggle = page.getByRole('switch', {
				name: /show baselines/i,
			});

			// Toggle off (default is on)
			await expect(baselineToggle).toBeChecked();
			await baselineToggle.click();
			await expect(baselineToggle).not.toBeChecked();

			// Reload the page
			await page.reload();

			// Expand options again and verify the toggle persisted
			await optionsHeader.click();
			await expect(baselineToggle).not.toBeChecked();
		});

		test('should show "Restored from previous session" after reloading with saved options', async ({
			page,
		}) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Make a change to save to localStorage
			const minusculesRadio = page.getByRole('radio', {
				name: /minuscules only/i,
			});
			await minusculesRadio.click();

			// Reload the page
			await page.reload();

			// Expand options and check for source indicator
			await optionsHeader.click();
			await expect(
				page.getByText(/Restored from previous session/i)
			).toBeVisible();
		});
	});

	test.describe('Query String Loading', () => {
		test('should load game mode from query string', async ({ page }) => {
			await page.goto('/?mode=m');

			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const minusculesRadio = page.getByRole('radio', {
				name: /minuscules only/i,
			});
			await expect(minusculesRadio).toBeChecked();
		});

		test('should load majuscule mode from query string', async ({
			page,
		}) => {
			await page.goto('/?mode=M');

			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const majusculesRadio = page.getByRole('radio', {
				name: /MAJUSCULES only/i,
			});
			await expect(majusculesRadio).toBeChecked();
		});

		test('should load all modes from query string', async ({ page }) => {
			await page.goto('/?mode=a');

			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const bothRadio = page.getByRole('radio', {
				name: /both minuscules AND MAJUSCULES/i,
			});
			await expect(bothRadio).toBeChecked();
		});

		test('should load 24-letter alphabet from query string', async ({
			page,
		}) => {
			await page.goto('/?24=1');

			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const alphabetToggle = page.getByRole('switch', {
				name: /24-letter alphabet/i,
			});
			await expect(alphabetToggle).toBeChecked();
		});

		test('should load baselines off from query string', async ({
			page,
		}) => {
			await page.goto('/?base=0');

			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const baselineToggle = page.getByRole('switch', {
				name: /show baselines/i,
			});
			await expect(baselineToggle).not.toBeChecked();
		});

		test('should load specific alphabets from query string', async ({
			page,
		}) => {
			// Load with only alphabet IDs 1 and 3
			await page.goto('/?alph=1,3');

			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Source indicator should show this was loaded from a shared link
			await expect(
				page.getByText(/Loaded from shared link/i)
			).toBeVisible();
		});

		test('should show "Loaded from shared link" when using query string', async ({
			page,
		}) => {
			await page.goto('/?mode=m');

			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			await expect(
				page.getByText(/Loaded from shared link/i)
			).toBeVisible();
		});

		test('should prioritize query string over localStorage', async ({
			page,
		}) => {
			// First, set some options in localStorage
			await page.goto('/');
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const minusculesRadio = page.getByRole('radio', {
				name: /minuscules only/i,
			});
			await minusculesRadio.click();

			// Now navigate with a query string that specifies majuscule mode
			await page.goto('/?mode=M');
			await optionsHeader.click();

			const majusculesRadio = page.getByRole('radio', {
				name: /MAJUSCULES only/i,
			});
			await expect(majusculesRadio).toBeChecked();
		});
	});

	test.describe('Reset to Defaults', () => {
		test('should reset all options when Reset to defaults is clicked', async ({
			page,
		}) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Change some settings
			const minusculesRadio = page.getByRole('radio', {
				name: /minuscules only/i,
			});
			await minusculesRadio.click();

			const alphabetToggle = page.getByRole('switch', {
				name: /24-letter alphabet/i,
			});
			await alphabetToggle.click();

			// Click reset
			const resetLink = page.getByText('Reset to defaults');
			await resetLink.click();

			// Verify defaults are restored
			const bothRadio = page.getByRole('radio', {
				name: /both minuscules AND MAJUSCULES/i,
			});
			await expect(bothRadio).toBeChecked();
			await expect(alphabetToggle).not.toBeChecked();
		});

		test('should show "Using default settings" after reset', async ({
			page,
		}) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Change a setting
			const minusculesRadio = page.getByRole('radio', {
				name: /minuscules only/i,
			});
			await minusculesRadio.click();

			// Click reset
			const resetLink = page.getByText('Reset to defaults');
			await resetLink.click();

			await expect(
				page.getByText(/Using default settings/i)
			).toBeVisible();
		});
	});

	test.describe('Copy Link Functionality', () => {
		test('should show "Link copied!" feedback when copy button is clicked', async ({
			page,
			context,
		}) => {
			// Grant clipboard permissions
			await context.grantPermissions([
				'clipboard-read',
				'clipboard-write',
			]);

			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const copyButton = page.getByText('Copy link to share');
			await copyButton.click();

			await expect(page.getByText('Link copied!')).toBeVisible();
		});
	});

	test.describe('Complex Query String Combinations', () => {
		test('should load multiple options from query string', async ({
			page,
		}) => {
			await page.goto('/?mode=m&24=1&base=0');

			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Verify all options loaded correctly
			const minusculesRadio = page.getByRole('radio', {
				name: /minuscules only/i,
			});
			await expect(minusculesRadio).toBeChecked();

			const alphabetToggle = page.getByRole('switch', {
				name: /24-letter alphabet/i,
			});
			await expect(alphabetToggle).toBeChecked();

			const baselineToggle = page.getByRole('switch', {
				name: /show baselines/i,
			});
			await expect(baselineToggle).not.toBeChecked();
		});
	});

	test.describe('Options Summary Updates', () => {
		test('should update summary when game mode changes', async ({
			page,
		}) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Initially shows "both cases"
			await expect(page.getByText(/both cases/i)).toBeVisible();

			// Change to minuscules
			const minusculesRadio = page.getByRole('radio', {
				name: /minuscules only/i,
			});
			await minusculesRadio.click();

			// Summary should update to "minuscules only"
			await expect(
				page.getByText(/minuscules only/i).first()
			).toBeVisible();
		});

		test('should update summary when 24-letter toggle changes', async ({
			page,
		}) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Initially shows "26 letters" in the summary
			const summaryText = page.locator('[class*="mb_0.75rem"]').first();
			await expect(summaryText).toContainText(/26 letters/i);

			// Toggle 24-letter
			const alphabetToggle = page.getByRole('switch', {
				name: /24-letter alphabet/i,
			});
			await alphabetToggle.click();

			// Summary should update to "24 letters"
			await expect(summaryText).toContainText(/24 letters/i);
		});

		test('should update summary when baseline toggle changes', async ({
			page,
		}) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Initially shows "baselines on"
			await expect(page.getByText(/baselines on/i)).toBeVisible();

			// Toggle off
			const baselineToggle = page.getByRole('switch', {
				name: /show baselines/i,
			});
			await baselineToggle.click();

			// Summary should update to "baselines off"
			await expect(page.getByText(/baselines off/i)).toBeVisible();
		});
	});
});
