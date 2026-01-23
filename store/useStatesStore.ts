import { create } from 'zustand'

interface StatesStore {
  phoneNumber: string;
  isLoginOpen: boolean;
  isCodeSent: boolean;
  setIsLoginOpen: (isLoginOpen: boolean) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setIsCodeSent: (isCodeSent: boolean) => void;
}

export const useStatesStore = create<StatesStore>((set) => ({
  phoneNumber: '',
  isLoginOpen: false,
  isCodeSent: false,
  setIsLoginOpen: (isLoginOpen: boolean) => set({ isLoginOpen }),
  setPhoneNumber: (phoneNumber: string) => set({ phoneNumber }),
  setIsCodeSent: (isCodeSent: boolean) => set({ isCodeSent }),
}))

