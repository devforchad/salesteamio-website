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

async function fillContact(page: import('@playwright/test').Page) {
  await page.goto('/#contact')
  await page.locator('[name="name"]').fill('Test Visitor')
  await page.locator('[name="email"]').fill('visitor@example.org')
  await page.locator('[name="company"]').fill('Example Co')
  await page.locator('[name="message"]').fill('Our handoffs need attention.')
}

test('successful submission posts to the n8n endpoint and replaces the form', async ({ page }) => {
  let requests = 0
  await page.route('https://n8n.salesteamio.com/webhook/website-contact', async route => {
    requests++
    expect(route.request().postDataJSON()).toMatchObject({ email: 'visitor@example.org', name: 'Test Visitor', message: 'Our handoffs need attention.' })
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: 'Sent' }), headers: { 'access-control-allow-origin': '*' } })
  })
  await fillContact(page)
  await page.getByRole('button', { name: 'Request a systems audit' }).click()
  await expect(page.getByRole('heading', { name: 'Thanks for reaching out.' })).toBeVisible()
  await expect(page.locator('#contact form')).toHaveCount(0)
  expect(requests).toBe(1)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('failed submission retains the form and exposes email fallback', async ({ page }) => {
  await page.route('https://n8n.salesteamio.com/webhook/website-contact', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'Rejected' }), headers: { 'access-control-allow-origin': '*' } }))
  await fillContact(page)
  await page.getByRole('button', { name: 'Request a systems audit' }).click()
  await expect(page.getByRole('alert')).toContainText('wasn’t sent')
  await expect(page.getByRole('alert').getByRole('link', { name: 'chad@salesteamio.com' })).toHaveAttribute('href', 'mailto:chad@salesteamio.com')
  await expect(page.getByRole('button', { name: 'Request a systems audit' })).toBeEnabled()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('submitting prevents double submit', async ({ page }) => {
  let requests = 0
  let release!: () => void
  const pending = new Promise<void>(resolve => { release = resolve })
  await page.route('https://n8n.salesteamio.com/webhook/website-contact', async route => {
    requests++
    await pending
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }), headers: { 'access-control-allow-origin': '*' } })
  })
  await fillContact(page)
  await page.getByRole('button', { name: 'Request a systems audit' }).click()
  const button = page.getByRole('button', { name: /Sending your request/ })
  await expect(button).toBeDisabled()
  await page.locator('#contact form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })))
  expect(requests).toBe(1)
  release()
  await expect(page.getByRole('heading', { name: 'Thanks for reaching out.' })).toBeVisible()
  expect(requests).toBe(1)
})

test('honeypot discards without a network request', async ({ page }) => {
  let requests = 0
  await page.route('https://n8n.salesteamio.com/webhook/website-contact', route => { requests++; return route.abort() })
  await fillContact(page)
  await page.locator('[name="website"]').evaluate(input => { (input as HTMLInputElement).value = 'spam.example' })
  await page.getByRole('button', { name: 'Request a systems audit' }).click()
  await expect(page.getByRole('heading', { name: 'Thanks for reaching out.' })).toBeVisible()
  expect(requests).toBe(0)
})

test('has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
