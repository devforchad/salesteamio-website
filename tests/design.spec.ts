import { expect, test } from '@playwright/test'

test('self-hosted fonts load and nothing is requested from Google Fonts', async ({ page }) => {
  const external: string[] = []
  page.on('request', request => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) external.push(request.url())
  })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.fonts.check('700 1em Archivo'))).toBe(true)
  expect(await page.evaluate(() => document.fonts.check('400 1em "Libre Franklin"'))).toBe(true)
  expect(await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily)).toContain('Libre Franklin')
  expect(await page.locator('h1').evaluate(el => getComputedStyle(el).fontFamily)).toContain('Archivo')
  expect(external).toEqual([])
})

test('structured data parses as a ProfessionalService', async ({ page }) => {
  await page.goto('/')
  const data = await page.evaluate(() => JSON.parse(document.querySelector('script[type="application/ld+json"]')!.textContent!))
  expect(data['@context']).toBe('https://schema.org')
  expect(data['@type']).toBe('ProfessionalService')
})

test('no horizontal overflow at phone, tablet and desktop widths', async ({ page }) => {
  for (const path of ['/', '/client-engine/']) {
    for (const width of path === '/' ? [390, 820, 1024, 1440] : [820, 900, 1024]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(path)
      await page.evaluate(() => document.fonts.ready)
      const { scroll, client } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
      expect(scroll, `${path} at ${width}px`).toBeLessThanOrEqual(client)
    }
  }
})
