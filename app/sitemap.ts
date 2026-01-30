import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.instapact.in'
  
  const routes = [
    '',
    '/auth',
    '/blog',
    '/blog/scope-creep-agency-profit',
    '/blog/essential-freelancer-clauses-2026',
    '/blog/digital-signing-client-trust',
    '/faq',
    '/privacy',
    '/terms',
    '/refund-policy',
    '/shipping-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: route === '' ? '2026-01-24' : '2026-01-20',
    changeFrequency: (route === '' ? 'daily' : 'monthly') as any,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}
