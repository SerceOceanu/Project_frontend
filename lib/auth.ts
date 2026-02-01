import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut,
  User, 
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export const signInWithGoogle = async (): Promise<User> => {
  // Use redirect on production, popup on development
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    console.log('🔄 Using signInWithRedirect for production');
    await signInWithRedirect(auth, googleProvider);
    // User will be redirected, so we won't reach here
    throw new Error('Redirecting...');
  } else {
    console.log('🔄 Using signInWithPopup for localhost');
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();
    
    console.log('✅ Got token, sending to server');
    // Send token to server to create httpOnly cookie
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: token }),
    });
    
    if (!response.ok) {
      console.error('❌ Failed to create session:', await response.text());
    } else {
      console.log('✅ Session created successfully');
    }
    
    return user;
  }
};

export const handleRedirectResult = async (): Promise<User | null> => {
  try {
    console.log('🔍 Checking for redirect result...');
    const result = await getRedirectResult(auth);
    if (result?.user) {
      console.log('✅ Got user from redirect:', result.user.email);
      const token = await result.user.getIdToken();
      
      console.log('✅ Got token, sending to server');
      // Send token to server to create httpOnly cookie
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: token }),
      });
      
      if (!response.ok) {
        console.error('❌ Failed to create session:', await response.text());
      } else {
        console.log('✅ Session created successfully');
      }
      
      return result.user;
    }
    console.log('ℹ️ No redirect result found');
    return null;
  } catch (error) {
    console.error('❌ Error handling redirect result:', error);
    throw error;
  }
};

export const setupRecaptcha = async (elementId: string): Promise<RecaptchaVerifier> => {
  // ПОЛНАЯ очистка перед созданием нового
  cleanupRecaptcha();
  
  // Подождите, чтобы DOM успел очиститься
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const container = document.getElementById(elementId);
  if (!container) {
    throw new Error(`Element with id "${elementId}" not found`);
  }
  
  // Очистите содержимое контейнера
  container.innerHTML = '';

  const recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: (response: any) => {
      console.log('reCAPTCHA solved automatically');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
      cleanupRecaptcha();
    }
  });

  // Сохраните в window для последующей очистки
  (window as any).recaptchaVerifier = recaptchaVerifier;
  
  // ВАЖНО: Отрендерите reCAPTCHA сразу
  try {
    await recaptchaVerifier.render();
    console.log('reCAPTCHA rendered successfully');
  } catch (error) {
    console.error('Error rendering reCAPTCHA:', error);
    throw error;
  }
  
  return recaptchaVerifier;
};

export const cleanupRecaptcha = () => {
  // Очистите verifier из window
  if ((window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch (e) {
      console.warn('Error clearing verifier:', e);
    }
    (window as any).recaptchaVerifier = null;
  }
  
  // Очистите DOM контейнер
  const container = document.getElementById('recaptcha-container');
  if (container) {
    container.innerHTML = '';
  }
  
  // Удалите все iframe от reCAPTCHA (на всякий случай)
  const iframes = document.querySelectorAll('iframe[src*="recaptcha"]');
  iframes.forEach(iframe => {
    iframe.remove();
  });
  
  // Удалите badge reCAPTCHA
  const badges = document.querySelectorAll('.grecaptcha-badge');
  badges.forEach(badge => {
    badge.remove();
  });
};

export const sendPhoneVerification = async (
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
};

export const verifyPhoneCode = async (
  confirmationResult: ConfirmationResult,
  code: string
): Promise<User> => {
  const result = await confirmationResult.confirm(code);
  const user = result.user;
  const token = await user.getIdToken();
  
  // Send token to server to create httpOnly cookie
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken: token }),
  });
  
  return user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
  
  // Delete session from server
  await fetch('/api/auth/session', {
    method: 'DELETE',
  });
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(true);
        
        // Send token to server to create httpOnly cookie
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken: token }),
        });
      }
      unsubscribe();
      resolve(user);
    });
  });
};