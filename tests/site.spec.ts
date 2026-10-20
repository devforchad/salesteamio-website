import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const ENDPOINT = 'https://n8n.salesteamio.com/webhook/website-contact'
const CORS = { 'access-control-allow-origin': '*' }
const ok = { status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: 'Sent' }), headers: CORS }
const rejected = { status: 200, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'Rejected' }), headers: CORS }

async function fillContact(page: Page) {
  await page.goto('/#contact')
  const form = page.locator('#contact form')
  await form.locator('[name="name"]').fill('Test Visitor')
  await form.locator('[name="email"]').fill('visitor@example.org')
  await form.locator('[name="company"]').fill('Example Co')
  await form.locator('[name="message"]').fill('Our handoffs need attention.')
}

const submitContact = (page: Page) => page.locator('#contact').getByRole('button', { name: /Send to Chad|Sending/ })

test('renders the binder cover and every chapter', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Sales Team IO/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('under a minute')
  await expect(page.locator('.lede')).toHaveText(/sales teams of up to 50 reps\.$/)
  for (const name of ['Scope of work', 'Case files', 'How a project runs', "Who you'd work with", "Tell me what's breaking"]) {
    await expect(page.getByRole('heading', { name })).toBeVisible()
  }
  await expect(page.locator('#primary-navigation a', { hasText: 'For creators' })).toHaveAttribute('href', '/client-engine/')
  await expect(page.locator('.colophon').getByRole('link', { name: 'Client Engine' })).toHaveAttribute('href', '/client-engine/')
})

test('divider tabs navigate and mark the current section', async ({ page }) => {
  await page.goto('/')

  const tabs = page.locator('nav[aria-label="Sections"] a')
  await expect(tabs).toHaveCount(6)
  await expect(tabs.first()).toHaveAttribute('aria-current', 'location')

  await tabs.filter({ hasText: 'Work' }).click()
  await expect(page.locator('#work')).toBeInViewport()
  await expect(tabs.filter({ hasText: 'Work' })).toHaveAttribute('aria-current', 'location')
})

test('contact form validates required fields', async ({ page }) => {
  await page.goto('/#contact')

  await submitContact(page).click()
  await expect(page.locator('#contact input[name="name"]')).toHaveJSProperty('validity.valueMissing', true)
})

test('successful contact submission posts to the n8n endpoint and replaces the form', async ({ page }) => {
  let requests = 0
  await page.route(ENDPOINT, async route => {
    requests++
    expect(route.request().postDataJSON()).toMatchObject({
      name: 'Test Visitor', email: 'visitor@example.org', company: 'Example Co', message: 'Our handoffs need attention.',
    })
    await route.fulfill(ok)
  })
  await fillContact(page)
  await submitContact(page).click()
  await expect(page.locator('#contact').getByRole('heading', { name: 'Thanks for reaching out.' })).toBeVisible()
  await expect(page.locator('#contact form')).toHaveCount(0)
  expect(requests).toBe(1)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('failed contact submission retains the form and exposes the email fallback', async ({ page }) => {
  await page.route(ENDPOINT, route => route.fulfill(rejected))
  await fillContact(page)
  await submitContact(page).click()
  const alert = page.locator('#contact').getByRole('alert')
  await expect(alert).toContainText('wasn’t sent')
  await expect(alert.getByRole('link', { name: 'chad@salesteamio.com' })).toHaveAttribute('href', 'mailto:chad@salesteamio.com')
  await expect(page.locator('#contact [name="name"]')).toHaveValue('Test Visitor')
  await expect(page.locator('#contact [name="message"]')).toHaveValue('Our handoffs need attention.')
  await expect(submitContact(page)).toBeEnabled()
})

test('submitting prevents double submit', async ({ page }) => {
  let requests = 0
  let release!: () => void
  const pending = new Promise<void>(resolve => { release = resolve })
  await page.route(ENDPOINT, async route => {
    requests++
    await pending
    await route.fulfill(ok)
  })
  await fillContact(page)
  await submitContact(page).click()
  await expect(page.locator('#contact').getByRole('button', { name: 'Sending…' })).toBeDisabled()
  await page.locator('#contact form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })))
  expect(requests).toBe(1)
  release()
  await expect(page.getByRole('heading', { name: 'Thanks for reaching out.' })).toBeVisible()
  expect(requests).toBe(1)
})

test('honeypot discards without a network request', async ({ page }) => {
  let requests = 0
  await page.route(ENDPOINT, route => { requests++; return route.abort() })
  await fillContact(page)
  await page.locator('#contact [name="website"]').evaluate(input => { (input as HTMLInputElement).value = 'spam.example' })
  await submitContact(page).click()
  await expect(page.getByRole('heading', { name: 'Thanks for reaching out.' })).toBeVisible()
  expect(requests).toBe(0)
})

test('hero quick form posts name, email and message and keeps its box', async ({ page }) => {
  let requests = 0
  await page.route(ENDPOINT, async route => {
    requests++
    expect(route.request().postDataJSON()).toMatchObject({
      name: 'Quick Visitor', email: 'quick@example.org', message: 'Leads sit for an hour.', company: '',
    })
    await route.fulfill(ok)
  })
  await page.goto('/')
  const quick = page.locator('.quick')
  await quick.locator('[name="message"]').fill('Leads sit for an hour.')
  await quick.locator('[name="name"]').fill('Quick Visitor')
  await quick.locator('[name="email"]').fill('quick@example.org')
  await quick.getByRole('button', { name: 'Send to Chad' }).click()
  await expect(quick.getByRole('heading', { name: 'Thanks for reaching out.' })).toBeVisible()
  await expect(quick.locator('form')).toHaveCount(0)
  expect(requests).toBe(1)
})

test('hero quick form requires a name', async ({ page }) => {
  let requests = 0
  await page.route(ENDPOINT, route => { requests++; return route.fulfill(ok) })
  await page.goto('/')
  const quick = page.locator('.quick')
  await quick.locator('[name="message"]').fill('Leads sit for an hour.')
  await quick.locator('[name="email"]').fill('quick@example.org')
  await quick.getByRole('button', { name: 'Send to Chad' }).click()
  await expect(quick.locator('[name="name"]')).toHaveJSProperty('validity.valueMissing', true)
  expect(requests).toBe(0)
})

test('has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
