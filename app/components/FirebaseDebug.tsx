'use client';

import { useEffect } from 'react';
import { auth } from '@/lib/firebase';

/**
 * Debug component to check Firebase configuration
 * Remove this component in production
 */
export default function FirebaseDebug() {
  useEffect(() => {
    console.log('🔧 Firebase Debug Info:');
    console.log('  - Current hostname:', window.location.hostname);
    console.log('  - Auth domain:', auth.config.authDomain);
    console.log('  - API Key exists:', !!auth.config.apiKey);
    
    console.log('\n📋 Required Firebase Console settings:');
    console.log('  1. Firebase Console → Authentication → Settings → Authorized domains');
    console.log('     Add:', window.location.hostname);
    console.log('\n  2. Google Cloud Console → Credentials → OAuth 2.0 Client IDs');
    console.log('     Authorized JavaScript origins:', window.location.origin);
    console.log('     Authorized redirect URIs:', `${window.location.origin}/__/auth/handler`);
  }, []);

  return null;
}
