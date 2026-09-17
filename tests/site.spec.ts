import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('renders the core page and navigation', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Sales Team IO/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('sales team')
  await expect(page.getByRole('heading', { name: /Less busywork/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /easier to run/i })).toBeVisible()

  await page.getByRole('link', { name: 'See what we build' }).click()
  await expect(page.locator('#services')).toBeInViewport()
})

test('mobile menu exposes the primary links', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only behavior')
  await page.goto('/')

  const menu = page.getByRole('button', { name: 'Toggle navigation' })
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Services' })).toBeVisible()
})

test('contact form validates required fields', async ({ page }) => {
  await page.goto('/#contact')

  await page.getByRole('button', { name: 'Request a systems audit' }).click()
  await expect(page.locator('input[name="name"]')).toHaveJSProperty('validity.valueMissing', true)
})

test('has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
