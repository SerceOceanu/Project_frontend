import type { Product } from '@/types/types'
export async function getProduct(id: string): Promise<Product | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  
  try {
    const url =  `${baseUrl}/products/${id}` 
    
    const response = await fetch(url, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }

    const data: Product = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    return null
  }
}
