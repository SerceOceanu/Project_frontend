'use client';

import { useEffect, useState } from 'react';
import { handleRedirectResult } from '@/lib/auth';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_QUERY_KEY } from '@/hooks/useAuth';

/**
 * Global component to handle Google Auth redirect results
 * This component must be mounted at the root level to catch redirects
 */
export default function AuthRedirectHandler() {
  const queryClient = useQueryClient();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Only check once per page load
    if (checked) return;

    const checkRedirectResult = async () => {
      try {
        const user = await handleRedirectResult();
        if (user) {
          queryClient.setQueryData(AUTH_QUERY_KEY, user);
          // Invalidate user query to refetch user data
          queryClient.invalidateQueries({ queryKey: ['user'] });
          
          // Close login modal if it's open
          const event = new CustomEvent('auth-success');
          window.dispatchEvent(event);
        }
      } catch (error) {
        console.error('AuthRedirectHandler error:', error);
      } finally {
        setChecked(true);
      }
    };

    // Small delay to ensure Firebase is initialized
    const timer = setTimeout(() => {
      checkRedirectResult();
    }, 100);

    return () => clearTimeout(timer);
  }, [queryClient, checked]);

  return null; // This component doesn't render anything
}
