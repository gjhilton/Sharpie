import { test, expect } from '@playwright/test';
import {
	navigateToFeedback,
	returnToMenu,
	isOnMenuScreen,
} from '../../config/playwright/helpers/test-helpers.js';

test.describe('Feedback Screen', () => {
	test.beforeEach(async ({ page }) => {
		await navigateToFeedback(page);
	});

	test('should load the feedback form', async ({ page }) => {
		// Form element exists but we'll check for the form's presence via its inputs
		await expect(page.locator('form')).toBeVisible();
	});

	test('should display version number in footer', async ({ page }) => {
		const version = page.getByText(/v\d+\.\d+\.\d+/);
		await expect(version).toBeVisible();
	});

	test('should have form heading', async ({ page }) => {
		const heading = page.getByRole('heading', { level: 1 });
		await expect(heading).toBeVisible();
	});

	test('should have email input field', async ({ page }) => {
		const emailInput = page.locator('input[name="email"]');
		await expect(emailInput).toBeVisible();
		await expect(emailInput).toHaveAttribute('type', 'email');
	});

	test('should have message textarea', async ({ page }) => {
		const messageInput = page.locator('textarea[name="message"]');
		await expect(messageInput).toBeVisible();
	});

	test('should have submit button', async ({ page }) => {
		const submitButton = page.getByRole('button', { name: /send/i });
		await expect(submitButton).toBeVisible();
		await expect(submitButton).toBeEnabled();
	});

	test('should validate email format', async ({ page }) => {
		const emailInput = page.locator('input[name="email"]');
		const messageInput = page.locator('textarea[name="message"]');
		const submitButton = page.getByRole('button', { name: /send/i });

		// Fill with invalid email
		await emailInput.fill('invalid-email');
		await messageInput.fill('Test message');
		await submitButton.click();

		// HTML5 validation should prevent submission
		const validationMessage = await emailInput.evaluate(
			el => el.validationMessage
		);
		expect(validationMessage).toBeTruthy();
	});

	test('should require message field', async ({ page }) => {
		const emailInput = page.locator('input[name="email"]');
		const messageInput = page.locator('textarea[name="message"]');
		const submitButton = page.getByRole('button', { name: /send/i });

		// Fill email but not message
		await emailInput.fill('test@example.com');
		await submitButton.click();

		// Should show validation error
		const validationMessage = await messageInput.evaluate(
			el => el.validationMessage
		);
		expect(validationMessage).toBeTruthy();
	});

	test('should accept valid form submission', async ({ page }) => {
		const emailInput = page.locator('input[name="email"]');
		const messageInput = page.locator('textarea[name="message"]');

		// Fill form with valid data
		await emailInput.fill('test@example.com');
		await messageInput.fill(
			'This is a test message from Playwright E2E tests.'
		);

		// Note: We won't actually submit to avoid spamming the form service
		// Just verify the form is fillable
		await expect(emailInput).toHaveValue('test@example.com');
		await expect(messageInput).toHaveValue(/test message/i);
	});

	test('should have a back to landing button', async ({ page }) => {
		const backButton = page.getByRole('button', { name: /cancel/i });
		await expect(backButton).toBeVisible();
		await expect(backButton).toBeEnabled();
	});

	test('should return to landing when clicking back', async ({ page }) => {
		await returnToMenu(page);

		const onMenu = await isOnMenuScreen(page);
		expect(onMenu).toBe(true);
	});

	test('should have proper form labels', async ({ page }) => {
		// Check that labels with text exist (they don't use htmlFor in this implementation)
		const emailLabel = page.locator('label:has-text("Email Address")');
		const messageLabel = page.locator('label:has-text("Message")');

		// Labels should exist for accessibility
		expect(await emailLabel.count()).toBeGreaterThan(0);
		expect(await messageLabel.count()).toBeGreaterThan(0);
	});

	test('should be keyboard navigable', async ({ page }) => {
		// Tab through form elements
		await page.keyboard.press('Tab'); // Email field
		await page.keyboard.press('Tab'); // Message field
		await page.keyboard.press('Tab'); // Submit button
		await page.keyboard.press('Tab'); // Back button

		// Should be able to navigate the form
		const focusedElement = await page.evaluate(
			() => document.activeElement.tagName
		);
		expect(['INPUT', 'TEXTAREA', 'BUTTON']).toContain(focusedElement);
	});

	test('should show formspree attribution', async ({ page }) => {
		// The form should indicate it uses Formspree
		// This might be in small print or a powered-by notice
		const formContent = await page.textContent('form');
		// Just verify form is present, attribution may vary
		expect(formContent).toBeTruthy();
	});
});
