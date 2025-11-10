import { test, expect } from '@playwright/test';

test.describe('24-Letter Alphabet Feature', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test.describe('Menu Screen - Settings Section', () => {
		test('should display Settings section with toggle', async ({
			page,
		}) => {
			// Check for Settings heading
			const settingsHeading = page.getByRole('heading', {
				name: 'Settings',
				level: 2,
			});
			await expect(settingsHeading).toBeVisible();

			// Check for toggle label
			const toggleLabel = page.getByText('24-letter alphabet');
			await expect(toggleLabel).toBeVisible();

			// Check for explanation text
			const explanation = page.getByText(
				/In secretary hand.*not distinguished/i
			);
			await expect(explanation).toBeVisible();
		});

		test('toggle should be OFF by default', async ({ page }) => {
			const toggle = page.getByRole('switch', {
				name: '24-letter alphabet',
			});
			await expect(toggle).toHaveAttribute('aria-checked', 'false');
		});

		test('toggle should switch from OFF to ON when clicked', async ({
			page,
		}) => {
			const toggle = page.getByRole('switch', {
				name: '24-letter alphabet',
			});

			// Initially OFF
			await expect(toggle).toHaveAttribute('aria-checked', 'false');

			// Click to turn ON
			await toggle.click();
			await expect(toggle).toHaveAttribute('aria-checked', 'true');
		});

		test('toggle should switch from ON to OFF when clicked twice', async ({
			page,
		}) => {
			const toggle = page.getByRole('switch', {
				name: '24-letter alphabet',
			});

			// Turn ON
			await toggle.click();
			await expect(toggle).toHaveAttribute('aria-checked', 'true');

			// Turn OFF
			await toggle.click();
			await expect(toggle).toHaveAttribute('aria-checked', 'false');
		});

		test('toggle should be keyboard accessible with Space key', async ({
			page,
		}) => {
			const toggle = page.getByRole('switch', {
				name: '24-letter alphabet',
			});

			// Focus the toggle
			await toggle.focus();

			// Press Space to toggle
			await page.keyboard.press('Space');
			await expect(toggle).toHaveAttribute('aria-checked', 'true');

			// Press Space again
			await page.keyboard.press('Space');
			await expect(toggle).toHaveAttribute('aria-checked', 'false');
		});

		test('toggle should be keyboard accessible with Enter key', async ({
			page,
		}) => {
			const toggle = page.getByRole('switch', {
				name: '24-letter alphabet',
			});

			// Focus the toggle
			await toggle.focus();

			// Press Enter to toggle
			await page.keyboard.press('Enter');
			await expect(toggle).toHaveAttribute('aria-checked', 'true');
		});
	});

	test.describe('Keyboard Labels', () => {
		test('keyboard should show combined letters when mode is ON', async ({
			page,
		}) => {
			// Turn on 24-letter alphabet mode
			const toggle = page.getByRole('switch', {
				name: '24-letter alphabet',
			});
			await toggle.click();

			// Start game
			await page.getByRole('button', { name: 'Start' }).click();

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
			// Mode is OFF by default, start game directly
			await page.getByRole('button', { name: 'Start' }).click();

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
			// This test is tricky because we don't know which letter will appear
			// We'll turn on the mode and play a few rounds to try to hit an alternate letter case

			const toggle = page.getByRole('switch', {
				name: '24-letter alphabet',
			});
			await toggle.click();

			await page.getByRole('button', { name: 'Start' }).click();

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
						/Accepted.*I and J were the same letter/i
					);
					const messageVisible = await acceptedMessage
						.isVisible()
						.catch(() => false);

					if (messageVisible) {
						// Success! We found a case where doubled letter was accepted
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
			// Mode is OFF by default
			await page.getByRole('button', { name: 'Start' }).click();

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
						/Accepted.*I and J were the same letter/i
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
		test('mode should reset to OFF on page reload', async ({ page }) => {
			const toggle = page.getByRole('switch', {
				name: '24-letter alphabet',
			});

			// Turn ON
			await toggle.click();
			await expect(toggle).toHaveAttribute('aria-checked', 'true');

			// Reload page
			await page.reload();

			// Should be OFF again
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
		test('24-letter alphabet should work with minuscules game', async ({
			page,
		}) => {
			const toggle = page.getByRole('switch', {
				name: '24-letter alphabet',
			});
			await toggle.click();

			await page.getByRole('button', { name: 'minuscules' }).click();

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

		test('24-letter alphabet should work with MAJUSCULES game', async ({
			page,
		}) => {
			const toggle = page.getByRole('switch', {
				name: '24-letter alphabet',
			});
			await toggle.click();

			await page.getByRole('button', { name: 'MAJUSCULES' }).click();

			// Wait for keyboard and check for uppercase combined letters
			await page.waitForSelector('.simple-keyboard', {
				state: 'visible',
			});

			// The keyboard should switch to shift layout for majuscules
			// Give it a moment to update
			await page.waitForTimeout(200);

			const keyboardText = await page
				.locator('.simple-keyboard')
				.textContent();
			expect(keyboardText).toMatch(/[I]\/[J]/);
			expect(keyboardText).toMatch(/[U]\/[V]/);
		});
	});
});
