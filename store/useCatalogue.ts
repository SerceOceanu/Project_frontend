import { create } from 'zustand'
import { Product } from '@/types/types';

interface CatalogueStore {
  category: string;
  search: string;
  filter: 'cheap' | 'expensive';
  favorites: Product[];
  setFilter: (filter: 'cheap' | 'expensive') => void;
  setSearching: (search: string) => void;
}

export const useCatalogueStore = create<CatalogueStore>((set) => ({
  category: '',
  filter: 'cheap',
  search: '',
  favorites: [],
  setFilter: (filter: 'cheap' | 'expensive') => set({ filter }),
  setSearching: (search: string) => set({ search }),
}))

