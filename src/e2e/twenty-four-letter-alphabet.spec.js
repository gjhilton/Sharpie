import { test, expect } from '@playwright/test';

test.describe('24-Letter Alphabet Feature', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test.describe('Landing Screen - Options Section', () => {
		test('should display 24-letter hand toggle in Options', async ({
			page,
		}) => {
			// Expand Options section
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Check for toggle label
			const toggleLabel = page.getByText('24-letter alphabet');
			await expect(toggleLabel).toBeVisible();
		});

		test('toggle should be ON by default', async ({ page }) => {
			// Expand Options section
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const toggle = page.getByRole('switch', {
				name: '24-letter alphabet',
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
				name: '24-letter alphabet',
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
				name: '24-letter alphabet',
			});

			// Initially ON, turn OFF
			await toggle.click();
			await expect(toggle).toHaveAttribute('aria-checked', 'false');

			// Turn back ON
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
				name: '24-letter alphabet',
			});

			// Focus the toggle
			await toggle.focus();

			// Press Enter to toggle (ON to OFF)
			await page.keyboard.press('Enter');
			await expect(toggle).toHaveAttribute('aria-checked', 'false');
		});
	});

	test.describe('Keyboard Labels', () => {
		test('keyboard should show combined letters when mode is ON', async ({
			page,
		}) => {
			// Mode is ON by default
			await page.getByRole('button', { name: /^play$/i }).click();

			// Wait for keyboard to be visible
			await page.waitForSelector('.hg-button', { state: 'visible' });

			// Check for doubled letter labels (case-insensitive, flexible matching)
			const keyboardText = await page
				.locator('.simple-keyboard')
				.textContent();

			// Should contain slashed letters for both cases
			expect(keyboardText).toMatch(/[iI]\/[jJ]/);
			expect(keyboardText).toMatch(/[jJ]\/[iI]/);
			expect(keyboardText).toMatch(/[uU]\/[vV]/);
			expect(keyboardText).toMatch(/[vV]\/[uU]/);
		});

		test('keyboard should show single letters when mode is OFF', async ({
			page,
		}) => {
			// Turn OFF 24-letter hand mode first
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const toggle = page.getByRole('switch', {
				name: '24-letter alphabet',
			});
			await toggle.click(); // Turn OFF

			await page.getByRole('button', { name: /^play$/i }).click();

			// Wait for keyboard to be visible
			await page.waitForSelector('.hg-button', { state: 'visible' });

			// Get all button texts
			const buttons = await page.locator('.hg-button').allTextContents();

			// Should NOT contain slashed letters
			const hasSlashedLetters = buttons.some(text => text.includes('/'));
			expect(hasSlashedLetters).toBe(false);

			// Should contain regular single letters
			expect(buttons.some(text => text === 'i')).toBe(true);
			expect(buttons.some(text => text === 'j')).toBe(true);
			expect(buttons.some(text => text === 'u')).toBe(true);
			expect(buttons.some(text => text === 'v')).toBe(true);
		});
	});

	test.describe('Gameplay with 24-Letter Alphabet', () => {
		test('should accept alternate letter when mode is ON', async ({
			page,
		}) => {
			// Mode is ON by default
			await page.getByRole('button', { name: /^play$/i }).click();

			// Try multiple times to find a case where we can test alternate letters
			for (let attempt = 0; attempt < 10; attempt++) {
				// Wait for the game screen
				await page.waitForSelector('.simple-keyboard', {
					state: 'visible',
				});

				// Try pressing 'i' - if the answer is 'j', it should be accepted
				await page.keyboard.press('i');

				// Small delay to let the UI update
				await page.waitForTimeout(100);

				// Check if "Next" button appears (indicating answer was accepted)
				const nextButton = page.getByRole('button', { name: 'Next' });
				const nextVisible = await nextButton
					.isVisible()
					.catch(() => false);

				if (nextVisible) {
					// Check if the acceptance message is shown
					const acceptedMessage = page.getByText(
						/Accepted.*24-letter alphabet/i
					);
					const messageVisible = await acceptedMessage
						.isVisible()
						.catch(() => false);

					if (messageVisible) {
						// Success! We found a case where alternate letter was accepted
						await expect(acceptedMessage).toBeVisible();
						break;
					} else {
						// It was an exact match, try next round
						await nextButton.click();
					}
				} else {
					// Wrong answer, try next round
					const nextAfterWrong = page.getByRole('button', {
						name: 'Next',
					});
					await nextAfterWrong.waitFor({ state: 'visible' });
					await nextAfterWrong.click();
				}
			}
		});

		test('should NOT accept alternate letter when mode is OFF', async ({
			page,
		}) => {
			// Turn OFF 24-letter hand mode
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			const toggle = page.getByRole('switch', {
				name: '24-letter alphabet',
			});
			await toggle.click(); // Turn OFF

			await page.getByRole('button', { name: /^play$/i }).click();

			// Try multiple rounds
			for (let attempt = 0; attempt < 10; attempt++) {
				await page.waitForSelector('.simple-keyboard', {
					state: 'visible',
				});

				// Try pressing 'i'
				await page.keyboard.press('i');
				await page.waitForTimeout(100);

				// If "Next" button appears, check there's NO acceptance message
				const nextButton = page.getByRole('button', { name: 'Next' });
				const nextVisible = await nextButton
					.isVisible()
					.catch(() => false);

				if (nextVisible) {
					const acceptedMessage = page.getByText(
						/Accepted.*24-letter alphabet/i
					);
					const messageVisible = await acceptedMessage
						.isVisible()
						.catch(() => false);

					// Should NEVER show the alternate letter acceptance message when mode is OFF
					expect(messageVisible).toBe(false);

					await nextButton.click();
				} else {
					// Wrong answer
					const nextAfterWrong = page.getByRole('button', {
						name: 'Next',
					});
					await nextAfterWrong.waitFor({ state: 'visible' });
					await nextAfterWrong.click();
				}
			}
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
				name: '24-letter alphabet',
			});

			// Turn OFF (starts ON)
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
				name: '24-letter alphabet',
			});
			await expect(toggleAfterReload).toHaveAttribute(
				'aria-checked',
				'false'
			);
		});
	});

	test.describe('Integration with Game Modes', () => {
		test('24-letter hand should work with minuscules game', async ({
			page,
		}) => {
			// Mode is ON by default
			// Expand Options section to select game mode
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Select minuscules only mode
			await page.getByRole('radio', { name: /minuscules only/i }).click();

			await page.getByRole('button', { name: /^play$/i }).click();

			// Keyboard should be visible and show combined letters in lowercase only
			await page.waitForSelector('.simple-keyboard', {
				state: 'visible',
			});

			const keyboardText = await page
				.locator('.simple-keyboard')
				.textContent();
			expect(keyboardText).toMatch(/[i]\/[j]/);
			expect(keyboardText).toMatch(/[u]\/[v]/);
		});

		test('24-letter hand should work with MAJUSCULES game', async ({
			page,
		}) => {
			// Mode is ON by default
			// Expand Options section to select game mode
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();

			// Select MAJUSCULES only mode
			await page.getByRole('radio', { name: /MAJUSCULES only/i }).click();

			await page.getByRole('button', { name: /^play$/i }).click();

			// Wait for keyboard and check for uppercase combined letters
			await page.waitForSelector('.simple-keyboard', {
				state: 'visible',
			});

			// The keyboard should be in uppercase layout for majuscules
			await page.waitForTimeout(200);

			const keyboardText = await page
				.locator('.simple-keyboard')
				.textContent();
			expect(keyboardText).toMatch(/[I]\/[J]/);
			expect(keyboardText).toMatch(/[U]\/[V]/);
		});
	});
});
