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
        console.log('🔍 AuthRedirectHandler: Checking for redirect result...');
        console.log('🔍 Current URL:', window.location.href);
        console.log('🔍 Referrer:', document.referrer);
        
        const user = await handleRedirectResult();
        if (user) {
          console.log('✅ AuthRedirectHandler: User authenticated via redirect:', user.email);
          queryClient.setQueryData(AUTH_QUERY_KEY, user);
          // Invalidate user query to refetch user data
          queryClient.invalidateQueries({ queryKey: ['user'] });
          
          // Close login modal if it's open
          const event = new CustomEvent('auth-success');
          window.dispatchEvent(event);
        } else {
          console.log('ℹ️ AuthRedirectHandler: No redirect result found');
        }
      } catch (error) {
        console.error('❌ AuthRedirectHandler: Error handling redirect:', error);
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
