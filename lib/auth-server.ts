import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session) {
    redirect('/');
  }
  
  return true;
}