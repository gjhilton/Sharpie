/**
 * Test helper functions for Playwright E2E tests
 */

/**
 * Navigate to a specific game mode
 * @param {import('@playwright/test').Page} page
 * @param {'all' | 'minuscule' | 'majuscule'} mode
 */
export async function selectGameMode(page, mode) {
	await page.goto('/');

	switch (mode) {
		case 'all':
			await page.getByRole('button', { name: /start/i }).click();
			break;
		case 'minuscule':
			await page.getByRole('button', { name: /minuscules/i }).click();
			break;
		case 'majuscule':
			await page.getByRole('button', { name: /MAJUSCULES/i }).click();
			break;
		default:
			throw new Error(`Unknown mode: ${mode}`);
	}

	// Wait for game screen to load
	await page.waitForSelector('img[alt="Character to identify"]', { timeout: 10000 });
}

/**
 * Answer a question in the game
 * @param {import('@playwright/test').Page} page
 * @param {string} answer - The key to press
 */
export async function answerQuestion(page, answer) {
	// Type the answer
	await page.keyboard.type(answer);

	// Wait a moment for the answer to be processed
	await page.waitForTimeout(500);
}

/**
 * Click the Next button to move to the next question
 * @param {import('@playwright/test').Page} page
 */
export async function clickNext(page) {
	// Wait for Next button to appear (it only shows after answering)
	const nextButton = page.getByRole('button', { name: /next/i });
	await nextButton.waitFor({ state: 'visible', timeout: 10000 });
	await nextButton.click();

	// Wait for the new character image to load and Next button to disappear
	await nextButton.waitFor({ state: 'hidden', timeout: 5000 });
}

/**
 * End the current game
 * @param {import('@playwright/test').Page} page
 */
export async function endGame(page) {
	await page.getByRole('button', { name: /end game/i }).click();

	// Wait for score screen to appear (check for stats)
	await page.waitForSelector('text=Correct Answers', { timeout: 10000 });
}

/**
 * Return to menu from any screen
 * @param {import('@playwright/test').Page} page
 */
export async function returnToMenu(page) {
	// Try different button variations across screens
	const returnButton = page.getByRole('button', { name: /return to menu/i });
	const backButton = page.getByRole('button', { name: /back to menu/i });
	const cancelButton = page.getByRole('button', { name: /cancel/i });

	if (await returnButton.isVisible()) {
		await returnButton.click();
	} else if (await backButton.isVisible()) {
		await backButton.click();
	} else if (await cancelButton.isVisible()) {
		await cancelButton.click();
	}

	// Wait for menu to load
	await page.waitForSelector('text=Hone your', { timeout: 5000 });
}

/**
 * Navigate to the catalogue screen
 * @param {import('@playwright/test').Page} page
 */
export async function navigateToCatalogue(page) {
	await page.goto('/');
	await page.getByRole('link', { name: /view all characters/i }).click();

	// Wait for catalogue to load
	await page.waitForSelector('h1', { timeout: 5000 });
}

/**
 * Navigate to the feedback screen
 * @param {import('@playwright/test').Page} page
 */
export async function navigateToFeedback(page) {
	await page.goto('/');

	// Look for feedback link in small print
	await page.getByRole('link', { name: /feedback/i }).click();

	// Wait for form to load
	await page.waitForSelector('form', { timeout: 5000 });
}

/**
 * Get the currently displayed character image alt text
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string>}
 */
export async function getCurrentCharacter(page) {
	const img = page.locator('img[alt="Character to identify"]').first();
	return await img.getAttribute('alt');
}

/**
 * Check if we're on the game screen
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<boolean>}
 */
export async function isOnGameScreen(page) {
	const gameImage = page.locator('img[alt="Character to identify"]');
	const endGameButton = page.getByRole('button', { name: /end game/i });

	return (
		(await gameImage.count()) > 0 && (await endGameButton.count()) > 0
	);
}

/**
 * Check if we're on the score screen
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<boolean>}
 */
export async function isOnScoreScreen(page) {
	const scoreText = page.getByText(/correct answers/i);
	return (await scoreText.count()) > 0;
}

/**
 * Check if we're on the menu screen
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<boolean>}
 */
export async function isOnMenuScreen(page) {
	const heading = page.getByText(/hone your/i);
	return (await heading.count()) > 0;
}
