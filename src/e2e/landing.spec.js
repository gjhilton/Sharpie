import { test, expect } from '@playwright/test';
import {
	isOnLandingScreen,
	navigateToCatalogue,
	navigateToFeedback,
} from '../config/playwright/helpers/test-helpers.js';

test.describe('Landing Screen', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should load the landing screen', async ({ page }) => {
		await expect(page).toHaveTitle(/Sharpie/i);
		await expect(
			page.getByRole('heading', { name: /hone your/i })
		).toBeVisible();
	});

	test('should display the logo', async ({ page }) => {
		// Logo is an SVG element, check for the animated path with class 'red'
		const logo = page.locator('svg path.red');
		await expect(logo).toBeVisible();
	});

	test('should display the secretary hand animated GIF', async ({ page }) => {
		const gif = page.getByAltText(/Secretary Hand/i);
		await expect(gif).toBeVisible();
	});

	test('should have a Play button', async ({ page }) => {
		const playButton = page.getByRole('button', { name: /^play$/i });
		await expect(playButton).toBeVisible();
		await expect(playButton).toBeEnabled();
	});

	test('should have collapsible Options section', async ({ page }) => {
		const optionsHeader = page.getByRole('button', { name: /options/i });
		await expect(optionsHeader).toBeVisible();

		// Options should start collapsed
		await expect(optionsHeader).toHaveAttribute('aria-expanded', 'false');

		// Click to expand
		await optionsHeader.click();
		await expect(optionsHeader).toHaveAttribute('aria-expanded', 'true');
	});

	test('should have game mode radio buttons in Options', async ({ page }) => {
		// Expand Options section first
		const optionsHeader = page.getByRole('button', { name: /options/i });
		await optionsHeader.click();

		const minusculesRadio = page.getByRole('radio', {
			name: /minuscules only/i,
		});
		const majusculesRadio = page.getByRole('radio', {
			name: /MAJUSCULES only/i,
		});
		const bothRadio = page.getByRole('radio', {
			name: /both minuscules AND MAJUSCULES/i,
		});

		await expect(minusculesRadio).toBeVisible();
		await expect(majusculesRadio).toBeVisible();
		await expect(bothRadio).toBeVisible();

		// "both" should be selected by default
		await expect(bothRadio).toBeChecked();
	});

	test('should have Choose alphabets button in Options', async ({ page }) => {
		// Expand Options section first
		const optionsHeader = page.getByRole('button', { name: /options/i });
		await optionsHeader.click();

		const chooseAlphabetsButton = page.getByRole('button', {
			name: /choose alphabets/i,
		});
		await expect(chooseAlphabetsButton).toBeVisible();
	});

	test('should display question bank statistics in Options', async ({
		page,
	}) => {
		// Expand Options section first
		const optionsHeader = page.getByRole('button', { name: /options/i });
		await optionsHeader.click();

		// Check for the question bank text pattern
		await expect(
			page.getByText(/Question bank:.*characters from.*alphabets/i)
		).toBeVisible();
	});

	test('should have 24-letter alphabet toggle in Options', async ({
		page,
	}) => {
		// Expand Options section first
		const optionsHeader = page.getByRole('button', { name: /options/i });
		await optionsHeader.click();

		const alphabetToggle = page.getByRole('switch', {
			name: /24-letter alphabet/i,
		});
		await expect(alphabetToggle).toBeVisible();
	});

	test('should have baseline toggle in Options', async ({ page }) => {
		// Expand Options section first
		const optionsHeader = page.getByRole('button', { name: /options/i });
		await optionsHeader.click();

		const baselineToggle = page.getByRole('switch', {
			name: /show baselines/i,
		});
		await expect(baselineToggle).toBeVisible();
		// Baselines should be on by default
		await expect(baselineToggle).toBeChecked();
	});

	test('should navigate to catalogue when clicking Choose alphabets', async ({
		page,
	}) => {
		// Expand Options section first
		const optionsHeader = page.getByRole('button', { name: /options/i });
		await optionsHeader.click();

		await navigateToCatalogue(page);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});

	test('should have collapsible How to play section', async ({ page }) => {
		const howToPlayHeader = page.getByRole('button', {
			name: /how to play/i,
		});
		await expect(howToPlayHeader).toBeVisible();
		await expect(howToPlayHeader).toHaveAttribute('aria-expanded', 'false');
	});

	test('should display gameplay instructions when How to play is expanded', async ({
		page,
	}) => {
		const howToPlayHeader = page.getByRole('button', {
			name: /how to play/i,
		});
		await howToPlayHeader.click();

		// Check for key instruction text
		await expect(
			page.getByText(/use your computer keyboard/i)
		).toBeVisible();
	});

	test('should have collapsible Next steps for learners section', async ({
		page,
	}) => {
		const nextStepsHeader = page.getByRole('button', {
			name: /next steps for learners/i,
		});
		await expect(nextStepsHeader).toBeVisible();
		await expect(nextStepsHeader).toHaveAttribute('aria-expanded', 'false');
	});

	test('should have external links to learning resources when Next steps is expanded', async ({
		page,
	}) => {
		const nextStepsHeader = page.getByRole('button', {
			name: /next steps for learners/i,
		});
		await nextStepsHeader.click();

		const ehocLink = page.getByRole('link', {
			name: /English Handwriting Online/i,
		});
		const beineckeLink = page.getByRole('link', {
			name: /Beinecke Library/i,
		});
		const scottishLink = page.getByRole('link', {
			name: /Scottish Handwriting/i,
		});

		await expect(ehocLink).toBeVisible();
		await expect(beineckeLink).toBeVisible();
		await expect(scottishLink).toBeVisible();

		// Check they open in new tab
		await expect(ehocLink).toHaveAttribute('target', '_blank');
		await expect(beineckeLink).toHaveAttribute('target', '_blank');
		await expect(scottishLink).toHaveAttribute('target', '_blank');
	});

	test("should have collapsible What's new section", async ({ page }) => {
		const whatsNewHeader = page.getByRole('button', { name: /what.*new/i });
		await expect(whatsNewHeader).toBeVisible();
		await expect(whatsNewHeader).toHaveAttribute('aria-expanded', 'false');
	});

	test("should display changelog when What's new is expanded", async ({
		page,
	}) => {
		const whatsNewHeader = page.getByRole('button', { name: /what.*new/i });
		await whatsNewHeader.click();

		// Check for version numbers in changelog (use first() since there may be multiple versions)
		await expect(page.getByText(/v\d+\.\d+\.\d+/).first()).toBeVisible();
	});

	test('should have feedback link in small print', async ({ page }) => {
		const feedbackLink = page.getByRole('link', { name: /feedback/i });
		await expect(feedbackLink).toBeVisible();
	});

	test('should display version number in footer', async ({ page }) => {
		const footer = page.getByRole('contentinfo');
		const version = footer.getByText(/v\d+\.\d+\.\d+/);
		await expect(version).toBeVisible();
	});

	test('should navigate to feedback form', async ({ page }) => {
		await navigateToFeedback(page);
		await expect(
			page.getByRole('heading', { name: /send feedback/i })
		).toBeVisible();
	});

	test('should be on landing screen after initial load', async ({ page }) => {
		const onLanding = await isOnLandingScreen(page);
		expect(onLanding).toBe(true);
	});

	test('should toggle disclosure sections by clicking anywhere on header', async ({
		page,
	}) => {
		// Test that clicking the header button toggles the section
		const optionsButton = page.getByRole('button', { name: /options/i });

		// Initially collapsed
		await expect(optionsButton).toHaveAttribute('aria-expanded', 'false');

		// Click to expand
		await optionsButton.click();

		// Should now be expanded
		await expect(optionsButton).toHaveAttribute('aria-expanded', 'true');

		// Click again to collapse
		await optionsButton.click();
		await expect(optionsButton).toHaveAttribute('aria-expanded', 'false');
	});
});
