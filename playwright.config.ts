import { defineConfig, devices } from '@playwright/test'

const DEFAULT_URL = 'http://127.0.0.1:4173'
const OVERRIDE_URL = 'http://127.0.0.1:4174'

// The endpoint injected into the override build. Deliberately not the real
// n8n URL, so the override test fails loudly if the env var stops being read.
const OVERRIDE_ENDPOINT = 'https://forms.example.test/override-endpoint'

export default defineConfig({
  testDir: './tests',
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: DEFAULT_URL,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      // A plain build with no env var — byte-for-byte what CI deploys.
      // Exercises the baked-in n8n endpoint, i.e. the path real visitors hit.
      command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
      url: DEFAULT_URL,
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      // Second build with VITE_FORM_ENDPOINT set, proving the override still
      // works for staging or a future move off n8n.
      command: 'vite build --outDir dist-override && vite preview --outDir dist-override --host 127.0.0.1 --port 4174',
      url: OVERRIDE_URL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { VITE_FORM_ENDPOINT: OVERRIDE_ENDPOINT },
    },
  ],
  projects: [
    { name: 'desktop', testIgnore: /override\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', testIgnore: /override\.spec\.ts/, use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    { name: 'override', testMatch: /override\.spec\.ts/, use: { ...devices['Desktop Chrome'], baseURL: OVERRIDE_URL } },
  ],
})
