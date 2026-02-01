'use client';

import { useEffect } from 'react';
import { handleRedirectResult } from '@/lib/auth';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_QUERY_KEY } from '@/hooks/useAuth';

/**
 * Global component to handle Google Auth redirect results
 * This component must be mounted at the root level to catch redirects
 */
export default function AuthRedirectHandler() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        console.log('🔍 AuthRedirectHandler: Checking for redirect result...');
        const user = await handleRedirectResult();
        if (user) {
          console.log('✅ AuthRedirectHandler: User authenticated via redirect:', user.email);
          queryClient.setQueryData(AUTH_QUERY_KEY, user);
          // Invalidate user query to refetch user data
          queryClient.invalidateQueries({ queryKey: ['user'] });
        } else {
          console.log('ℹ️ AuthRedirectHandler: No redirect result found');
        }
      } catch (error) {
        console.error('❌ AuthRedirectHandler: Error handling redirect:', error);
      }
    };

    checkRedirectResult();
  }, [queryClient]);

  return null; // This component doesn't render anything
}
