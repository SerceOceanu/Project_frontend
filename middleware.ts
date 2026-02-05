import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверка админских роутов
  if (pathname.startsWith('/admin')) {
    // Разрешаем доступ к странице логина и статическим файлам
    if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
      return NextResponse.next();
    }

    // Проверяем токен из cookies
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      // Нет токена - редирект на логин
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Можно добавить валидацию токена здесь, но для производительности лучше делать это в API
    // Пропускаем запрос дальше
    return NextResponse.next();
  }

  // Для остальных роутов используем intl middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Интернационализация для всех роутов кроме admin
    '/((?!api|_next/static|_next/image|favicon.ico|assets|admin).*)',
    // Админские роуты
    '/admin/:path*'
  ]
};