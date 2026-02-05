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
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();
    
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: token }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create session:', errorText);
    }
    
    return user;
  } catch (error: any) {
    console.error('signInWithPopup failed:', error);
    throw error;
  }
};

export const handleRedirectResult = async (): Promise<User | null> => {
  if (auth.currentUser) {
    return auth.currentUser;
  }
  return null;
};

export const setupRecaptcha = (elementId: string): RecaptchaVerifier => {
  cleanupRecaptcha();
  
  const container = document.getElementById(elementId);
  if (!container) {
    throw new Error(`reCAPTCHA container with id "${elementId}" not found`);
  }
  
  container.innerHTML = '';

  const recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    size: 'normal',
    callback: (response: any) => {
      console.log('✅ reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.warn('⚠️ reCAPTCHA expired');
    }
  });

  (window as any).recaptchaVerifier = recaptchaVerifier;
  
  return recaptchaVerifier;
};

export const cleanupRecaptcha = () => {
  if ((window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
      console.log('✅ reCAPTCHA verifier cleared');
    } catch (e) {
      console.warn('⚠️ Error clearing verifier:', e);
    }
    (window as any).recaptchaVerifier = null;
  }
  
  const container = document.getElementById('recaptcha-container');
  if (container) {
    container.innerHTML = '';
  }
  
  const iframes = document.querySelectorAll('iframe[src*="recaptcha"], iframe[src*="google.com/recaptcha"]');
  iframes.forEach(iframe => {
    iframe.remove();
  });
  
  const badges = document.querySelectorAll('.grecaptcha-badge');
  badges.forEach(badge => {
    badge.remove();
  });
};


export const sendPhoneVerification = async (
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    (window as any).confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error: any) {
    if ((window as any).recaptchaWidgetId !== undefined) {
      (window as any).grecaptcha?.reset((window as any).recaptchaWidgetId);
    }
    
    if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Неправильний формат номера телефону');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Забагато спроб. Спробуйте пізніше');
    } else if (error.code === 'auth/quota-exceeded') {
      throw new Error('Перевищено ліміт SMS. Спробуйте пізніше');
    }
    
    throw error;
  }
};

export const verifyPhoneCode = async (
  confirmationResult: ConfirmationResult,
  code: string
): Promise<User> => {
  try {
    console.log('🔐 Verifying code:', code);
    const result = await confirmationResult.confirm(code);
    const user = result.user;
    console.log('✅ Phone verification successful, user:', user.uid);
    
    const token = await user.getIdToken();
    
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: token }),
    });
    
    if (!response.ok) {
      console.warn('⚠️ Failed to create session on server');
    }
    
    cleanupRecaptcha();
    
    return user;
  } catch (error: any) {
    console.error('❌ Error verifying code:', error);
    
    if (error.code === 'auth/invalid-verification-code') {
      throw new Error('Неправильний код підтвердження');
    } else if (error.code === 'auth/code-expired') {
      throw new Error('Код підтвердження застарів');
    }
    
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
  
  await fetch('/api/auth/session', {
    method: 'DELETE',
  });
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(true);
        
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