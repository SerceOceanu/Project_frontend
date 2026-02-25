
export type Filter = 'chilled' | 'frozen' | 'ready' | 'marinated' | 'snacks';
export type Label = 'none' | 'top' | 'new';
export type Product = {
  id: string;
  name: string | { pl: string; ua: string };
  description: string | { pl: string; ua: string };
  price: number;
  gramsPerServing: number;
  maxGramsPerServing?: number;
  imageUrl: string | { pl: string; ua: string };
  imageUrlPL?: string;
  imageUrlUA?: string;
  category: Filter;
  inStock: boolean;
  label: Label;
  syrveProductId?: string;
}

export type BasketProduct = Product & {
  quantity: number;
}


export type CreateProduct = {
  name: { pl: string; ua: string };
  category: Filter;
  description: { pl: string; ua: string };
  price: number;
  gramsPerServing: number;
  maxGramsPerServing?: number;
  label?: Label;
  syrveProductId?: string;
  filePL?: File;
  fileUA?: File;
  enabled?: boolean;
}

export type CreateBanner = {
  namePL: string;
  nameUA: string;
  imagePL: File;
  imageUA: File;
}

export type Banner = {
  id: string;
  namePL: string;
  nameUA: string;
  fileUrlPL: string;
  fileUrlUA: string;
  created: string;
  updated: string;
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