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
import Cookies from 'js-cookie';

export const signInWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const token = await user.getIdToken();
  Cookies.set('session', token, { expires: 7 });
  return user;
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
  Cookies.set('session', token, { expires: 7 });
  return user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
  Cookies.remove('session');
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken(true);
        Cookies.set('session', token, { expires: 7 });
      }
      unsubscribe();
      resolve(user);
    });
  });
};