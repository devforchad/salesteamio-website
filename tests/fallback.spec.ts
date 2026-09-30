import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// These run against the build made with VITE_FORM_ENDPOINT unset (port 4174).
// Until the form endpoint secret is configured, this is the path every real
// visitor hits, so it needs the same coverage as the configured path.

async function fillContact(page: import('@playwright/test').Page) {
  await page.goto('/#contact')
  await page.locator('input[name="name"]').fill('Test Visitor')
  await page.locator('input[name="email"]').fill('visitor@example.org')
  await page.locator('textarea[name="message"]').fill('Our handoffs need attention.')
}

test('unconfigured endpoint shows the email-draft status, not a failure message', async ({ page }) => {
  let providerRequests = 0
  await page.route('**/api.web3forms.com/**', route => { providerRequests++; return route.abort() })

  await fillContact(page)
  await page.getByRole('button', { name: 'Request a systems audit' }).click()

  const status = page.getByRole('status')
  await expect(status).toContainText('Opening your email app')
  await expect(status).not.toContainText('wasn’t sent')
  await expect(page.getByRole('alert')).toHaveCount(0)

  await expect(status.getByRole('link', { name: 'chad@salesteamio.com' }))
    .toHaveAttribute('href', 'mailto:chad@salesteamio.com')

  // The form stays put so nothing the visitor typed is lost.
  await expect(page.locator('#contact form')).toBeVisible()
  await expect(page.locator('input[name="name"]')).toHaveValue('Test Visitor')
  await expect(page.getByRole('button', { name: 'Request a systems audit' })).toBeEnabled()

  expect(providerRequests).toBe(0)

  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('unconfigured build ships no provider key', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.ok()).toBe(true)
  const scripts = await page.locator('script[src]').evaluateAll(els =>
    els.map(el => (el as HTMLScriptElement).src))
  for (const src of scripts) {
    const body = await (await page.request.get(src)).text()
    expect(body).not.toContain('web3forms')
    expect(body).not.toContain('access_key')
  }
})
