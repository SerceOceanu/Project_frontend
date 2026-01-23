import { Banner } from '@/types/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://145.239.30.37:3000';

export async function getBanners(): Promise<Banner[]> {
  try {
    const response = await fetch(`${API_URL}/banners`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch banners: ${response.status}`);
    }
    const data: Banner[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}
