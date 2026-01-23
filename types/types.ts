
export type Filter = 'chilled' | 'frozen' | 'ready' | 'marinated' | 'snacks';
export type Label = 'none' | 'top' | 'new';
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  gramsPerServing: number;
  quantityPerServing: number;
  imageUrl: string;
  category: Filter;
  inStock: boolean;
  label: Label;
}

export type BasketProduct = Product & {
  quantity: number;
}


export type CreateProduct = {
  name: string;
  category: Filter;
  description: string;
  price: number;
  gramsPerServing: number;
  quantityPerServing: number;
  label: Label;
  file?: File; 
  enabled?: boolean;
}

export type CreateBanner = {
  name: string;
  image: File;
}

export type Banner = {
  id: number;
  name: string;
  fileUrl: string;
}

export type Modal = {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
}
export type CreateModal = {
  name: string;
  description: string;
  enabled: boolean;
}