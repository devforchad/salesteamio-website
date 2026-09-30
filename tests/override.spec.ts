import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// These run against the build made WITH VITE_FORM_ENDPOINT set (port 4174).
// They prove the env override still beats the baked-in n8n default, so the
// site can be pointed at a staging endpoint or moved off n8n without a
// code change.

const OVERRIDE_ENDPOINT = 'https://forms.example.test/override-endpoint'
const N8N_ENDPOINT = 'https://n8n.salesteamio.com/webhook/website-contact'

async function fillContact(page: import('@playwright/test').Page) {
  await page.goto('/#contact')
  await page.locator('input[name="name"]').fill('Test Visitor')
  await page.locator('input[name="email"]').fill('visitor@example.org')
  await page.locator('textarea[name="message"]').fill('Our handoffs need attention.')
}

test('VITE_FORM_ENDPOINT overrides the baked-in default', async ({ page }) => {
  let overrideHits = 0
  let defaultHits = 0

  await page.route(N8N_ENDPOINT, route => { defaultHits++; return route.abort() })
  await page.route(OVERRIDE_ENDPOINT, async route => {
    overrideHits++
    expect(route.request().postDataJSON()).toMatchObject({
      name: 'Test Visitor',
      email: 'visitor@example.org',
      message: 'Our handoffs need attention.',
    })
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
      headers: { 'access-control-allow-origin': '*' },
    })
  })

  await fillContact(page)
  await page.getByRole('button', { name: 'Request a systems audit' }).click()

  await expect(page.getByRole('heading', { name: 'Thanks for reaching out.' })).toBeVisible()
  expect(overrideHits).toBe(1)
  expect(defaultHits).toBe(0)

  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('a rejected submission keeps the form and offers a direct email', async ({ page }) => {
  await page.route(OVERRIDE_ENDPOINT, route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: false, message: 'Rejected' }),
    headers: { 'access-control-allow-origin': '*' },
  }))

  await fillContact(page)
  await page.getByRole('button', { name: 'Request a systems audit' }).click()

  await expect(page.getByRole('alert')).toContainText('wasn’t sent')
  await expect(page.getByRole('alert').getByRole('link', { name: 'chad@salesteamio.com' }))
    .toHaveAttribute('href', 'mailto:chad@salesteamio.com')
  // Nothing the visitor typed is lost.
  await expect(page.locator('input[name="name"]')).toHaveValue('Test Visitor')
  await expect(page.getByRole('button', { name: 'Request a systems audit' })).toBeEnabled()

  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('no build ships a third-party form provider or API key', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.ok()).toBe(true)
  const scripts = await page.locator('script[src]').evaluateAll(els =>
    els.map(el => (el as HTMLScriptElement).src))
  expect(scripts.length).toBeGreaterThan(0)
  for (const src of scripts) {
    const body = await (await page.request.get(src)).text()
    expect(body).not.toContain('web3forms')
    expect(body).not.toContain('access_key')
  }
})
