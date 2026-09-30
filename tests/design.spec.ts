import { expect, test } from '@playwright/test'
import { fileURLToPath } from 'node:url'

// Repo-relative so this runs anywhere (CI has no /docker scratch dir).
// Override with SCREENSHOT_DIR to collect the captures somewhere else.
const screenshotDir = process.env.SCREENSHOT_DIR
  ?? fileURLToPath(new URL('../test-results/screens', import.meta.url))

test('self-hosted fonts, lightweight assets and valid structured data', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.fonts.check('1em Inter'))).toBe(true)
  expect(await page.evaluate(() => document.fonts.check('500 1em "DM Mono"'))).toBe(true)
  expect(await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily)).toContain('Inter')
  expect(await page.locator('.eyebrow').first().evaluate(el => getComputedStyle(el).fontFamily)).toContain('DM Mono')
  expect(await page.evaluate(() => JSON.parse(document.querySelector('script[type="application/ld+json"]')!.textContent!)['@context'])).toBe('https://schema.org')
  const resources = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => ({ name: entry.name, transfer: (entry as PerformanceResourceTiming).transferSize })))
  expect(resources.reduce((sum, entry) => sum + entry.transfer, 0)).toBeLessThan(250_000)
  expect(resources.some(entry => entry.name.endsWith('/assets/salesteamio-logo.png'))).toBe(false)
})

test('section audit and connected routing at desktop, tablet and phone widths', async ({ page }) => {
  for (const width of [1280, 1024, 800, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await page.locator('.skip-link').evaluate(el => { el.style.visibility = 'hidden' })
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    const connections = await page.locator('.project-routing').evaluate(panel => {
      const box = (selector: string) => panel.querySelector(selector)!.getBoundingClientRect()
      const input = box('.route-input'), first = box('.route-link'), hub = box('.route-hub')
      const branch = box('.route-branches'), output = box('.route-output')
      const rows = [...panel.querySelectorAll('.route-output span')].map(row => row.getBoundingClientRect())
      const near = (a: number, b: number) => Math.abs(a - b) < 2
      return near(input.right, first.left) && near(first.right, hub.left) &&
        near(hub.right, branch.left) && near(branch.right, output.left) &&
        near(branch.y + .5 - 33, rows[0].y + rows[0].height / 2) &&
        near(branch.y + .5 + 33, rows[2].y + rows[2].height / 2)
    })
    expect(connections, `routing connectors at ${width}px`).toBe(true)
    if (width === 1280 || width === 390) {
      for (const [name, selector] of [
        ['hero', '.hero'], ['services', '.services'], ['projects', '.projects'],
        ['about', '.about'], ['contact', '.contact'], ['routing', '.project-routing'],
      ]) {
        await page.locator(selector).screenshot({ path: `${screenshotDir}/polish-${name}-${width}.png`, animations: 'disabled' })
      }
    }
  }
})
