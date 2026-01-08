import { MetadataRoute } from 'next'
import collectionsData from '@/collections.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://markmorente.com' // Replace with your actual domain

  // Base routes
  const routes = [
    '',
    '/#collections',
    '/#fabrics',
    '/#manufacturing',
    '/#about',
    '/#contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Product routes
  const products = collectionsData.products.map((product) => ({
    url: `${baseUrl}/collections/${product.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...routes, ...products]
}
