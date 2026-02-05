import { Product } from '@/types/types';

/**
 * Получает локализованное название продукта
 */
export function getProductName(product: Product, locale?: string): string {
  if (typeof product.name === 'string') {
    return product.name;
  }
  const currentLocale = (locale === 'ua' ? 'ua' : 'pl') as 'pl' | 'ua';
  return product.name[currentLocale] || product.name.pl || product.name.ua || '';
}

/**
 * Получает локализованное описание продукта
 */
export function getProductDescription(product: Product, locale?: string): string {
  if (typeof product.description === 'string') {
    return product.description;
  }
  const currentLocale = (locale === 'ua' ? 'ua' : 'pl') as 'pl' | 'ua';
  return product.description[currentLocale] || product.description.pl || product.description.ua || '';
}

/**
 * Получает URL изображения продукта в зависимости от локали
 */
export function getProductImage(product: Product, locale?: string): string {
  const currentLocale = (locale === 'ua' ? 'ua' : 'pl') as 'pl' | 'ua';
  
  // Новый формат - imageUrl как объект
  if (typeof product.imageUrl === 'object' && product.imageUrl !== null) {
    if (currentLocale === 'pl' && 'pl' in product.imageUrl && product.imageUrl.pl) {
      return product.imageUrl.pl;
    }
    if (currentLocale === 'ua' && 'ua' in product.imageUrl && product.imageUrl.ua) {
      return product.imageUrl.ua;
    }
    // Fallback на другой язык
    return product.imageUrl.pl || product.imageUrl.ua || '';
  }
  
  // Старый формат - отдельные поля
  if (currentLocale === 'pl' && product.imageUrlPL) {
    return product.imageUrlPL;
  }
  if (currentLocale === 'ua' && product.imageUrlUA) {
    return product.imageUrlUA;
  }
  
  // Fallback на строковое значение imageUrl
  if (typeof product.imageUrl === 'string') {
    return product.imageUrl;
  }
  
  return product.imageUrlPL || product.imageUrlUA || '';
}

/**
 * Получает все доступные изображения продукта
 */
export function getProductImages(product: Product): string[] {
  const urls: string[] = [];
  
  // Новый формат - imageUrl как объект
  if (typeof product.imageUrl === 'object' && product.imageUrl !== null) {
    if ('pl' in product.imageUrl && product.imageUrl.pl) urls.push(product.imageUrl.pl);
    if ('ua' in product.imageUrl && product.imageUrl.ua) urls.push(product.imageUrl.ua);
  }
  // Старый формат - imageUrl как строка
  else if (typeof product.imageUrl === 'string' && product.imageUrl) {
    urls.push(product.imageUrl);
  }
  
  // Добавляем отдельные поля если есть
  if (product.imageUrlPL) urls.push(product.imageUrlPL);
  if (product.imageUrlUA) urls.push(product.imageUrlUA);
  
  // Убираем дубликаты
  return [...new Set(urls)];
}
