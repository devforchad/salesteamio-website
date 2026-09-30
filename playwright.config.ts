import { defineConfig, devices } from '@playwright/test'

const CONFIGURED_URL = 'http://127.0.0.1:4173'
const FALLBACK_URL = 'http://127.0.0.1:4174'

export default defineConfig({
  testDir: './tests',
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: CONFIGURED_URL,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'VITE_FORM_ENDPOINT=https://api.web3forms.com/submit?access_key=test-placeholder npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
      url: CONFIGURED_URL,
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      // Second build with VITE_FORM_ENDPOINT deliberately unset, so the
      // mailto fallback branch is exercised by real tests. This is the path
      // live visitors hit until the form endpoint secret is configured.
      command: 'vite build --outDir dist-fallback && vite preview --outDir dist-fallback --host 127.0.0.1 --port 4174',
      url: FALLBACK_URL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { VITE_FORM_ENDPOINT: '' },
    },
  ],
  projects: [
    { name: 'desktop', testIgnore: /fallback\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', testIgnore: /fallback\.spec\.ts/, use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    { name: 'fallback', testMatch: /fallback\.spec\.ts/, use: { ...devices['Desktop Chrome'], baseURL: FALLBACK_URL } },
  ],
})
