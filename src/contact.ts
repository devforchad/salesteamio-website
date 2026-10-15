export const contactEmail = 'chad@salesteamio.com'

// Our own n8n endpoint. Safe to ship in the bundle: it is a public POST URL
// with no credential attached, CORS-locked to this origin, and the workflow
// validates and rate-limits on the server side. VITE_FORM_ENDPOINT can still
// override it (staging, or a swap to another provider) without a code change.
export const DEFAULT_FORM_ENDPOINT = 'https://n8n.salesteamio.com/webhook/website-contact'

export type ContactPayload = {
  name: FormDataEntryValue | null
  email: FormDataEntryValue | null
  company: FormDataEntryValue | null
  message: FormDataEntryValue | null
  website: FormDataEntryValue | null
}

// Posts to our own n8n workflow at n8n.salesteamio.com, which persists the
// submission to Postgres before emailing it on. No third-party form service,
// and no API key in the client bundle.
export async function sendContact(data: ContactPayload, endpoint: string): Promise<void> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      company: data.company,
      message: data.message,
      website: data.website,
    }),
  })
  if (!response.ok || (await response.json()).success !== true) throw new Error('Form delivery failed')
}
