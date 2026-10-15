import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const ENDPOINT = 'https://n8n.salesteamio.com/webhook/website-contact'
const join = (page: import('@playwright/test').Page) => page.locator('#waitlist').getByRole('button', { name: /Join the launch list/ })

test('kit page loads with the offer and eight cards', async ({ page }) => {
  await page.goto('/kit/')
  await expect(page).toHaveTitle('The Creator Funnel Kit | Sales Team IO')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('followers')
  await expect(page.getByText('$27').first()).toBeVisible()
  await expect(page.locator('#inside .ce-card')).toHaveCount(8)
})

test('kit page has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/kit/')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('without a payment link the buy button goes to the waitlist form', async ({ page }) => {
  await page.goto('/kit/')
  await expect(page.locator('.hero .button.primary')).toHaveAttribute('href', /#waitlist$/)
  await expect(page.locator('#waitlist form')).toHaveCount(1)
})

test('waitlist submit maps fields and shows the confirmation', async ({ page }) => {
  const bodies: Record<string, string>[] = []
  await page.route(ENDPOINT, async route => {
    bodies.push(route.request().postDataJSON())
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }), headers: { 'access-control-allow-origin': '*' } })
  })
  await page.goto('/kit/')
  await page.locator('#waitlist [name="name"]').fill('Test Creator')
  await page.locator('#waitlist [name="email"]').fill('creator@example.org')
  await page.locator('#waitlist [name="instagram"]').fill('creator1')
  await join(page).click()
  await expect(page.getByText('You’re on the list')).toBeVisible()
  expect(bodies).toHaveLength(1)
  expect(bodies[0].message.startsWith('[Kit waitlist]')).toBe(true)
  expect(bodies[0].company).toBe('@creator1')
})

test('waitlist honeypot sends no request', async ({ page }) => {
  let requests = 0
  await page.route(ENDPOINT, route => { requests++; return route.abort() })
  await page.goto('/kit/')
  await page.locator('#waitlist [name="name"]').fill('Test Creator')
  await page.locator('#waitlist [name="email"]').fill('creator@example.org')
  await page.locator('[name="website"]').evaluate(input => { (input as HTMLInputElement).value = 'spam.example' })
  await join(page).click()
  await expect(page.getByText('You’re on the list')).toBeVisible()
  expect(requests).toBe(0)
})

test('no horizontal overflow on mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only behavior')
  await page.goto('/kit/')
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('client engine page links to the kit', async ({ page }) => {
  await page.goto('/client-engine/')
  await expect(page.locator('a[href="/kit/"]').first()).toHaveAttribute('href', '/kit/')
})
