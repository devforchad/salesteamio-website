import { expect, test } from '@playwright/test'
import { fileURLToPath } from 'node:url'

// Repo-relative so this runs anywhere (CI has no /docker scratch dir).
// Override with SCREENSHOT_DIR to collect the captures somewhere else.
const screenshotDir = process.env.SCREENSHOT_DIR
  ?? fileURLToPath(new URL('../test-results/screens', import.meta.url))

test('operating diagrams retain their layout at desktop and phone widths', async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    // Playwright's offscreen element capture can paint the fixed skip link into the crop.
    await page.locator('.skip-link').evaluate(el => { el.style.visibility = 'hidden' })
    for (const [name, selector] of [
      ['hero', '.hero'],
      ['projects', '.projects'],
      ['about', '.about'],
    ]) {
      await page.locator(selector).screenshot({ path: `${screenshotDir}/fixed-${name}-${width}.png`, animations: 'disabled' })
    }
    await page.locator('.skip-link').evaluate(el => { el.style.visibility = '' })
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    for (const selector of ['.system-flow', '.operator-stages']) {
      expect(await page.locator(selector).evaluate(el => getComputedStyle(el).listStyleType)).toBe('none')
    }
    expect(await page.locator('.art-number').first().evaluate(el => getComputedStyle(el).position)).toBe('absolute')
    expect(await page.locator('.lending-track span').first().evaluate(el => getComputedStyle(el).position)).toBe('relative')
    const collisions = await page.evaluate(() => {
      const leaves = [...document.querySelectorAll('.system-visual, .project-art, .about-mark')].flatMap(panel =>
        [...panel.querySelectorAll('small, b, .art-number, .stage-status, .operator-stages span, .operator-stages i')]
          .filter(el => el.textContent?.trim() && !el.querySelector('*')))
      return leaves.flatMap((a, i) => leaves.slice(i + 1).filter(b => {
        if (a.closest('.system-visual, .project-art, .about-mark') !== b.closest('.system-visual, .project-art, .about-mark')) return false
        const x = a.getBoundingClientRect(), y = b.getBoundingClientRect()
        return Math.min(x.right, y.right) - Math.max(x.left, y.left) > 1 &&
          Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top) > 1
      }).map(b => `${a.textContent?.trim()} / ${b.textContent?.trim()}`))
    })
    expect(collisions, `overlapping diagram text at ${width}px`).toEqual([])
  }
})
