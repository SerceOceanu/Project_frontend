import type { Product } from '@/types/types'
export async function getProductsByCategory(category?: string): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  
  try {
    const url = category 
      ? `${baseUrl}/products?category=${category}` 
      : `${baseUrl}/products`
    
    const response = await fetch(url, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }

    const data: { items: Product[] } = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}
