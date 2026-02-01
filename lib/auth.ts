import { 
  signInWithPopup, 
  signOut,
  User, 
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export const signInWithGoogle = async (): Promise<User> => {
  // Use popup for better reliability
  console.log('🔄 Using signInWithPopup');
  console.log('🔄 Current hostname:', window.location.hostname);
  console.log('🔄 Auth domain:', auth.config.authDomain);
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log('✅ Got user:', user.email);
    
    const token = await user.getIdToken();
    console.log('✅ Got token (length:', token.length, ')');
    
    console.log('✅ Sending token to server...');
    // Send token to server to create httpOnly cookie
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: token }),
    });
    
    console.log('✅ Server response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to create session:', errorText);
    } else {
      const responseData = await response.json();
      console.log('✅ Session created successfully:', responseData);
    }
    
    return user;
  } catch (error: any) {
    console.error('❌ signInWithPopup failed:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    throw error;
  }
};

export const handleRedirectResult = async (): Promise<User | null> => {
  // Not needed anymore since we use popup, but keep for compatibility
  // Just check if user is already authenticated
  if (auth.currentUser) {
    console.log('ℹ️ User is already authenticated:', auth.currentUser.email);
    return auth.currentUser;
  }
  return null;
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