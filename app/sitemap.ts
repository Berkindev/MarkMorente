import { MetadataRoute } from 'next'
import collectionsData from '@/collections.json'
import categoriesData from '@/categories.json'

const SITE_URL = 'https://www.markmorente.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  // Primary static routes (real pages, not hash anchors)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/collections`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/mens-suit-manufacturing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about-us`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ]

  // Manufacturing category pages
  const categories = (categoriesData.page?.categories ?? []).map((c) => ({
    url: `${SITE_URL}/mens-suit-manufacturing/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Product detail pages — in-stock prioritised slightly higher
  const products = collectionsData.products.map((product) => ({
    url: `${SITE_URL}/collections/${product.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: product.status === 'In Stock' ? 0.7 : 0.5,
  }))

  return [...staticRoutes, ...categories, ...products]
}
