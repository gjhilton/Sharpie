import { test, expect } from '@playwright/test';
import {
	isOnMenuScreen,
	navigateToCatalogue,
	navigateToFeedback,
} from '../../config/playwright/helpers/test-helpers.js';

test.describe('Menu Screen', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should load the menu screen', async ({ page }) => {
		await expect(page).toHaveTitle(/Sharpie/i);
		await expect(
			page.getByRole('heading', { name: /hone your/i }),
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

	test('should have a Start button', async ({ page }) => {
		const startButton = page.getByRole('button', { name: /^start$/i });
		await expect(startButton).toBeVisible();
		await expect(startButton).toBeEnabled();
	});

	test('should have minuscules and MAJUSCULES buttons', async ({ page }) => {
		const minusculesButton = page.getByRole('button', {
			name: /minuscules/i,
		});
		const majusculesButton = page.getByRole('button', {
			name: /MAJUSCULES/i,
		});

		await expect(minusculesButton).toBeVisible();
		await expect(majusculesButton).toBeVisible();
	});

	test('should have a link to view all characters', async ({ page }) => {
		const catalogueLink = page.getByRole('link', {
			name: /view all characters/i,
		});
		await expect(catalogueLink).toBeVisible();
	});

	test('should navigate to catalogue when clicking view all characters', async ({
		page,
	}) => {
		await navigateToCatalogue(page);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});

	test('should have external links to learning resources', async ({
		page,
	}) => {
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

	test('should display how to use instructions', async ({ page }) => {
		const instructions = page.getByRole('list').first();
		await expect(instructions).toBeVisible();

		// Check for key instruction text
		await expect(page.getByText(/use your computer keyboard/i)).toBeVisible();
	});

	test('should have feedback link in small print', async ({ page }) => {
		const feedbackLink = page.getByRole('link', { name: /feedback/i });
		await expect(feedbackLink).toBeVisible();
	});

	test('should navigate to feedback form', async ({ page }) => {
		await navigateToFeedback(page);
		await expect(page.getByRole('heading', { name: /send feedback/i })).toBeVisible();
	});

	test('should be on menu screen after initial load', async ({ page }) => {
		const onMenu = await isOnMenuScreen(page);
		expect(onMenu).toBe(true);
	});
});
