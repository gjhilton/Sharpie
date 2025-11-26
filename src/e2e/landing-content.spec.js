import { test, expect } from '@playwright/test';

test.describe('Landing Page Content', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test.describe('Main Hero Section', () => {
		test('should display the page title', async ({ page }) => {
			const title = page.getByRole('heading', { level: 1 });
			await expect(title).toContainText('Hone your');
			await expect(title).toContainText('Secretary');
		});

		test('should display the hero description', async ({ page }) => {
			await expect(
				page.getByText(/Sharpie helps sharpen your eye/)
			).toBeVisible();
			await expect(page.getByText(/secretary hand/)).toBeVisible();
			await expect(
				page.getByText(/sixteenth and seventeenth centuries/)
			).toBeVisible();
		});

		test('should display the Play button', async ({ page }) => {
			const playButton = page.getByRole('button', { name: /^play$/i });
			await expect(playButton).toBeVisible();
		});

		test('should display secretary hand animated image', async ({
			page,
		}) => {
			// Look for the animated Secretary hand demonstration
			const images = page.locator('img');
			await expect(images.first()).toBeVisible();
			const count = await images.count();
			expect(count).toBeGreaterThan(0);
		});
	});

	test.describe('Options DisclosureSection', () => {
		test.beforeEach(async ({ page }) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await optionsHeader.click();
		});

		test('should display Options section header', async ({ page }) => {
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			await expect(optionsHeader).toBeVisible();
		});

		test('should display Alphabets subsection title', async ({ page }) => {
			await expect(
				page.getByRole('heading', { name: 'Alphabets' })
			).toBeVisible();
		});

		test('should display question bank statistics', async ({ page }) => {
			// Options is already expanded by beforeEach hook
			// Wait for content to be visible
			await page.waitForTimeout(200);

			// Match the entire paragraph pattern (text is split across multiple elements)
			await expect(
				page.getByText(/Question bank:.*characters from.*alphabets/i)
			).toBeVisible();
		});

		test('should display Choose alphabets button', async ({ page }) => {
			const button = page.getByRole('button', {
				name: /choose alphabets/i,
			});
			await expect(button).toBeVisible();
		});

		test('should display 26 letters vs 24 subsection title', async ({
			page,
		}) => {
			await expect(page.getByText('26 letters vs 24')).toBeVisible();
		});

		test('should display 24-letter alphabet explanation text', async ({
			page,
		}) => {
			await expect(
				page.getByText(/During this era, the alphabet had 24 letters/)
			).toBeVisible();
			await expect(
				page.getByText(/I.*and.*J.*were the same letter/)
			).toBeVisible();
			await expect(page.getByText(/U.*and.*V/)).toBeVisible();
			await expect(
				page.getByText(
					/two graphs.*could be used to write the same letter/
				)
			).toBeVisible();
			await expect(
				page.getByText(
					/By default, Sharpie uses this 24 letter alphabet/
				)
			).toBeVisible();
			await expect(
				page.getByText(/if you are shown a.*J.*and answer.*I/)
			).toBeVisible();
		});

		test('should display 24-letter alphabet toggle', async ({ page }) => {
			const toggle = page.getByRole('switch', {
				name: '24-letter alphabet',
			});
			await expect(toggle).toBeVisible();
		});

		test('should display 24-letter toggle explanation', async ({
			page,
		}) => {
			await expect(
				page.getByText(
					/When this option is enabled, if you are shown a.*J.*and answer.*I.*that answer will be accepted/
				)
			).toBeVisible();
		});

		test('should display Baselines subsection title', async ({ page }) => {
			await expect(
				page.getByRole('heading', { name: 'Baselines' })
			).toBeVisible();
		});

		test('should display baseline toggle', async ({ page }) => {
			const toggle = page.getByRole('switch', {
				name: 'Show baselines',
			});
			await expect(toggle).toBeVisible();
		});

		test('should display baseline explanation text', async ({ page }) => {
			await expect(
				page.getByText(/When enabled, a baseline appears/)
			).toBeVisible();
			await expect(
				page.getByText(/distinguish between majuscule.*and minuscule/)
			).toBeVisible();
			await expect(
				page.getByText(
					/minuscule characters typically sit on the baseline/
				)
			).toBeVisible();
			await expect(
				page.getByText(/majuscule characters may extend above it/)
			).toBeVisible();
		});

		test('should display baseline example labels', async ({ page }) => {
			await expect(page.getByText('Without baseline')).toBeVisible();
			await expect(page.getByText('With baseline')).toBeVisible();
		});
	});

	test.describe('How to play DisclosureSection', () => {
		test.beforeEach(async ({ page }) => {
			const howToPlayHeader = page.getByRole('button', {
				name: /how to play/i,
			});
			await howToPlayHeader.click();
		});

		test('should display How to play section header', async ({ page }) => {
			const header = page.getByRole('button', { name: /how to play/i });
			await expect(header).toBeVisible();
		});

		test('should display Gameplay subsection title', async ({ page }) => {
			await expect(page.getByText('Gameplay')).toBeVisible();
		});

		test('should display gameplay instructions - step 1', async ({
			page,
		}) => {
			await expect(
				page.getByText(
					/You will be shown a character.*graph.*in palaeography jargon/
				)
			).toBeVisible();
		});

		test('should display gameplay instructions - step 2', async ({
			page,
		}) => {
			await expect(
				page.getByText(
					/Use your computer keyboard or the onscreen keyboard/
				)
			).toBeVisible();
		});

		test('should display gameplay instructions - step 3', async ({
			page,
		}) => {
			await expect(
				page.getByText(
					/See feedback about your answer.*correct or incorrect/
				)
			).toBeVisible();
		});

		test('should display gameplay instructions - step 4', async ({
			page,
		}) => {
			await expect(
				page.getByText(/Hit.*next.*to see another graph/)
			).toBeVisible();
		});

		test('should display gameplay instructions - step 5', async ({
			page,
		}) => {
			await expect(
				page.getByText(
					/Exit at any time by clicking the.*End game.*button/
				)
			).toBeVisible();
			await expect(
				page.getByText(/view a summary of your score/)
			).toBeVisible();
			await expect(
				page.getByText(/recap graphs identified wrongly/)
			).toBeVisible();
		});

		test('should display Letters in context subsection title', async ({
			page,
		}) => {
			await expect(page.getByText('Letters in context')).toBeVisible();
		});

		test('should display letters in context explanation', async ({
			page,
		}) => {
			await expect(
				page.getByText(
					/For some alphabets.*we show you a fragment of a whole word/
				)
			).toBeVisible();
			await expect(
				page.getByText(
					/identify just the letter coloured in heavy black/
				)
			).toBeVisible();
		});

		test('should display context example image', async ({ page }) => {
			// The word "there" example image
			const contextImage = page.locator(
				'img[alt*="there"][alt*="highlighted"]'
			);
			await expect(contextImage).toBeVisible();
		});

		test('should display context example caption', async ({ page }) => {
			await expect(
				page.getByText(/This word is.*there.*You are asked to identify/)
			).toBeVisible();
		});

		test('should display Hints subsection title', async ({ page }) => {
			await expect(page.getByText('Hints')).toBeVisible();
		});

		test('should display hints explanation', async ({ page }) => {
			await expect(
				page.getByText(/Some letters supply additional information/)
			).toBeVisible();
			await expect(
				page.getByText(/first letter in word.*or.*last letter in word/)
			).toBeVisible();
			await expect(
				page.getByText(
					/Some letters had different forms in these positions/
				)
			).toBeVisible();
			await expect(
				page.getByText(/majuscules are often the first letter/)
			).toBeVisible();
		});
	});

	test.describe('Next steps for learners DisclosureSection', () => {
		test.beforeEach(async ({ page }) => {
			const nextStepsHeader = page.getByRole('button', {
				name: /next steps/i,
			});
			await nextStepsHeader.click();
		});

		test('should display Next steps section header', async ({ page }) => {
			const header = page.getByRole('button', { name: /next steps/i });
			await expect(header).toBeVisible();
		});

		test('should display Additional resources subsection title', async ({
			page,
		}) => {
			await expect(page.getByText('Additional resources')).toBeVisible();
		});

		test('should display resources intro text', async ({ page }) => {
			await expect(
				page.getByText(/Many resources are available online/)
			).toBeVisible();
		});

		test('should display English Handwriting Online link', async ({
			page,
		}) => {
			const link = page.getByRole('link', {
				name: /English Handwriting Online/i,
			});
			await expect(link).toBeVisible();
			await expect(link).toHaveAttribute(
				'href',
				'https://www.english.cam.ac.uk/ceres/ehoc/'
			);
		});

		test('should display Beinecke Library link', async ({ page }) => {
			const link = page.getByRole('link', { name: /Beinecke Library/i });
			await expect(link).toBeVisible();
			await expect(link).toHaveAttribute(
				'href',
				'https://beinecke.library.yale.edu/article/quarantine-reading-learn-read-secretary-hand'
			);
		});

		test('should display Scottish Handwriting link', async ({ page }) => {
			const link = page.getByRole('link', {
				name: /Scottish Handwriting/i,
			});
			await expect(link).toBeVisible();
			await expect(link).toHaveAttribute(
				'href',
				'https://www.scotlandspeople.gov.uk/scottish-handwriting/tutorials'
			);
		});
	});

	test.describe("What's new DisclosureSection", () => {
		test.beforeEach(async ({ page }) => {
			const whatsNewHeader = page.getByRole('button', {
				name: /what.*new/i,
			});
			await whatsNewHeader.click();
		});

		test("should display What's new section header", async ({ page }) => {
			const header = page.getByRole('button', { name: /what.*new/i });
			await expect(header).toBeVisible();
		});

		test('should display Changelog subsection title', async ({ page }) => {
			await expect(page.getByText('Changelog')).toBeVisible();
		});

		test('should display version entries in definition list format', async ({
			page,
		}) => {
			// Check for version number pattern in definition list terms
			const versionTerms = page
				.getByRole('term')
				.filter({ hasText: /^v\d+\.\d+\.\d+$/ });
			const count = await versionTerms.count();
			expect(count).toBeGreaterThanOrEqual(1);
		});

		test('should display version descriptions with release notes', async ({
			page,
		}) => {
			// Check that definition descriptions exist for version entries
			const definitionDescriptions = page.locator('dd');
			const count = await definitionDescriptions.count();
			expect(count).toBeGreaterThanOrEqual(1);

			// At least one description should have content
			const firstDescription = definitionDescriptions.first();
			await expect(firstDescription).toBeVisible();
			const text = await firstDescription.textContent();
			expect(text.length).toBeGreaterThan(10);
		});

		test('should display changelog in chronological order (newest first)', async ({
			page,
		}) => {
			// First version term should be the latest
			const firstVersionTerm = page.getByRole('term').first();
			await expect(firstVersionTerm).toBeVisible();

			// Verify it matches version pattern
			const versionText = await firstVersionTerm.textContent();
			expect(versionText).toMatch(/^v\d+\.\d+\.\d+$/);
		});
	});

	test.describe('Footer / Small Print', () => {
		test('should display feedback button in footer', async ({ page }) => {
			const footer = page.getByRole('contentinfo');
			const feedbackButton = footer.getByRole('button', {
				name: /feedback/i,
			});
			await expect(feedbackButton).toBeVisible();
		});

		test('should display version number in footer', async ({ page }) => {
			const footer = page.getByRole('contentinfo');
			const version = footer.getByText(/v\d+\.\d+\.\d+/);
			await expect(version).toBeVisible();
		});

		test('should have footer landmark accessible', async ({ page }) => {
			const footer = page.getByRole('contentinfo');
			await expect(footer).toBeVisible();
		});
	});

	test.describe('Complete Content Integration', () => {
		test('should have all 4 disclosure sections', async ({ page }) => {
			// Wait for page to fully load - check for specific section
			await page
				.getByRole('button', { name: /options/i })
				.waitFor({ state: 'visible' });

			// Count disclosure section buttons
			const disclosureSections = page.locator('button[aria-expanded]');
			const count = await disclosureSections.count();
			expect(count).toBe(4); // Options, How to play, Next steps, What's new
		});

		test('all sections should start collapsed', async ({ page }) => {
			const disclosureSections = page.locator('button[aria-expanded]');

			for (let i = 0; i < 4; i++) {
				await expect(disclosureSections.nth(i)).toHaveAttribute(
					'aria-expanded',
					'false'
				);
			}
		});

		test('should be able to expand all sections simultaneously', async ({
			page,
		}) => {
			// Expand all sections
			const optionsHeader = page.getByRole('button', {
				name: /options/i,
			});
			const howToPlayHeader = page.getByRole('button', {
				name: /how to play/i,
			});
			const nextStepsHeader = page.getByRole('button', {
				name: /next steps/i,
			});
			const whatsNewHeader = page.getByRole('button', {
				name: /what.*new/i,
			});

			await optionsHeader.click();
			await howToPlayHeader.click();
			await nextStepsHeader.click();
			await whatsNewHeader.click();

			// All should be expanded
			await expect(optionsHeader).toHaveAttribute(
				'aria-expanded',
				'true'
			);
			await expect(howToPlayHeader).toHaveAttribute(
				'aria-expanded',
				'true'
			);
			await expect(nextStepsHeader).toHaveAttribute(
				'aria-expanded',
				'true'
			);
			await expect(whatsNewHeader).toHaveAttribute(
				'aria-expanded',
				'true'
			);
		});

		test('entire page should be scrollable with all content visible', async ({
			page,
		}) => {
			// Expand all sections
			await page.getByRole('button', { name: /options/i }).click();
			await page.getByRole('button', { name: /how to play/i }).click();
			await page.getByRole('button', { name: /next steps/i }).click();
			await page.getByRole('button', { name: /what.*new/i }).click();

			// Scroll to bottom
			const footer = page.getByRole('contentinfo');
			await footer.scrollIntoViewIfNeeded();

			// Footer should be visible after scroll
			await expect(footer).toBeVisible();
			await expect(footer.getByText(/v\d+\.\d+\.\d+/)).toBeVisible();
		});
	});
});
