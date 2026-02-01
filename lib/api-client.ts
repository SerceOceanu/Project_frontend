import { auth } from '@/lib/firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://145.239.30.37:3000';

async function getFirebaseToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  
  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    return null;
  }
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: HeadersInit;
  requireAuth?: boolean;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers: customHeaders = {},
    requireAuth = true,
  } = options;

  let token: string | null = null;
  if (requireAuth) {
    token = await getFirebaseToken();
    if (!token) {
      throw new Error('Not authenticated. Please login first.');
    }
  }

  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const url = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`;

  const headers: Record<string, string> = {
    'accept': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (body && typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorMessage = `Failed to ${method} ${endpoint}`;
    
    try {
      const errorDetails = await response.json();
      errorMessage = errorDetails.message || errorDetails.error || errorMessage;
    } catch (e) {
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  const data: T = await response.json();
  return data;
}

export function isAuthenticated(): boolean {
  return !!auth.currentUser;
}
