import type { Product } from '@/types/types'

interface ProductsResponse {
  items: Product[];
  metadata?: {
    limit: number;
    offset: number;
    total: number;
  };
}

export async function getProductsByCategory(category?: string, limit?: number, offset?: number): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  
  try {
    const params = new URLSearchParams();
    if (category) {
      params.append('category', category);
    }
    
    const queryString = params.toString();
    const url = `${baseUrl}/products/in-stock/list${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }

    const data: ProductsResponse = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}
