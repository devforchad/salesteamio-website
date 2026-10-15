import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const ENDPOINT = 'https://n8n.salesteamio.com/webhook/website-contact'
const apply = (page: Page) => page.getByRole('button', { name: /Apply for a founding spot/ })

async function fillApplication(page: Page) {
  await page.goto('/client-engine/')
  await page.locator('[name="name"]').fill('Test Creator')
  await page.locator('[name="email"]').fill('creator@example.org')
  await page.locator('[name="instagram"]').fill('testcreator')
  await page.locator('[name="followers"]').selectOption('50k–100k')
  await page.locator('[name="offer"]').fill('A mobility coaching program')
  await page.locator('[name="package"]').selectOption('Client Engine ($2,500)')
}

test('client engine page loads with packages, proof and apply sections', async ({ page }) => {
  await page.goto('/client-engine/')
  await expect(page).toHaveTitle('Client Engine | Sales Team IO')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('booked calls')
  for (const id of ['#packages', '#proof', '#apply']) await expect(page.locator(id)).toHaveCount(1)
  for (const price of ['$997', '$2,500', '$4,500']) await expect(page.locator('#packages').getByText(price, { exact: true })).toBeVisible()
})

test('client engine page has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/client-engine/')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('submitting with required fields empty sends no request', async ({ page }) => {
  let requests = 0
  await page.route(ENDPOINT, route => { requests++; return route.abort() })
  await page.goto('/client-engine/')
  await apply(page).click()
  await expect(page.locator('input[name="name"]')).toHaveJSProperty('validity.valueMissing', true)
  expect(requests).toBe(0)
})

test('successful application maps fields and shows the confirmation', async ({ page }) => {
  const bodies: Record<string, string>[] = []
  await page.route(ENDPOINT, async route => {
    bodies.push(route.request().postDataJSON())
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }), headers: { 'access-control-allow-origin': '*' } })
  })
  await fillApplication(page)
  await apply(page).click()
  await expect(page.getByText('Application received')).toBeVisible()
  expect(bodies).toHaveLength(1)
  expect(bodies[0].company).toBe('@testcreator')
  expect(bodies[0].name).toBe('Test Creator')
  expect(bodies[0].message.startsWith('[Client Engine application]')).toBe(true)
  expect(bodies[0].message).toContain('Followers: 50k–100k')
  expect(bodies[0].message).toContain('Package: Client Engine ($2,500)')
  expect(bodies[0].message).toContain('Bio link: none')
})

test('failed application keeps the form and shows the email fallback', async ({ page }) => {
  await page.route(ENDPOINT, route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: false }), headers: { 'access-control-allow-origin': '*' } }))
  await fillApplication(page)
  await apply(page).click()
  const alert = page.getByRole('alert')
  await expect(alert).toContainText('wasn’t sent')
  await expect(alert.getByRole('link', { name: 'chad@salesteamio.com' })).toHaveAttribute('href', 'mailto:chad@salesteamio.com')
  await expect(page.locator('#apply form')).toHaveCount(1)
  await expect(apply(page)).toBeEnabled()
})

test('filled honeypot sends no request and shows success', async ({ page }) => {
  let requests = 0
  await page.route(ENDPOINT, route => { requests++; return route.abort() })
  await fillApplication(page)
  await page.locator('[name="website"]').evaluate(input => { (input as HTMLInputElement).value = 'spam.example' })
  await apply(page).click()
  await expect(page.getByText('Application received')).toBeVisible()
  expect(requests).toBe(0)
})

test('no horizontal overflow on mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only behavior')
  await page.goto('/client-engine/')
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('home page links to the client engine page', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('a[href="/client-engine/"]').first()).toHaveAttribute('href', '/client-engine/')
  await expect(page.locator('#primary-navigation a[href="/client-engine/"]')).toHaveText('For creators')
})
