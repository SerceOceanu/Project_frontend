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

export const setupRecaptcha = (containerId: string = 'recaptcha-container'): RecaptchaVerifier => {
  cleanupRecaptcha();
  
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container with id "${containerId}" not found`);
  }

  const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: (response: any) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
    }
  });

  (window as any).recaptchaVerifier = recaptchaVerifier;
  
  return recaptchaVerifier;
};

export const cleanupRecaptcha = () => {
  if ((window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch (e) {
      // Ignore errors during cleanup
    }
    (window as any).recaptchaVerifier = null;
  }
  
  (window as any).recaptchaWidgetId = undefined;
  
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
    // Error; SMS not sent
    // Reset the reCAPTCHA
    if ((window as any).recaptchaWidgetId !== undefined) {
      (window as any).grecaptcha?.reset((window as any).recaptchaWidgetId);
    } else {
      // Or, if you haven't stored the widget ID:
      (window as any).recaptchaVerifier?.render().then((widgetId: number) => {
        (window as any).grecaptcha?.reset(widgetId);
      });
    }
    
    throw error;
  }
};

export const verifyPhoneCode = async (
  confirmationResult: ConfirmationResult,
  code: string
): Promise<User> => {
  try {
    const result = await confirmationResult.confirm(code);
    const user = result.user;
    // User signed in successfully.
    
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
    // User couldn't sign in (bad verification code?)
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