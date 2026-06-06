import { test, expect } from '@playwright/test';

test('has mood checkin button on dashboard', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome back!' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Check in/i })).toBeVisible();
});

test('navigates to mood page and renders selectors', async ({ page }) => {
  await page.goto('/mood');
  await expect(page.getByRole('heading', { name: 'Daily Check-in' })).toBeVisible();
  
  // Checks if the emoji buttons are present
  await expect(page.getByRole('button', { name: /Mood: Excellent/i })).toBeVisible();
  
  // Submit button should be disabled initially
  const submitBtn = page.getByTestId('submit-mood');
  await expect(submitBtn).toBeDisabled();
});
