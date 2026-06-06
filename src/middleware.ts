import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define protected paths
  const protectedPaths = ['/', '/mood', '/journal', '/ai-coach', '/exam-prep'];
  
  // Check if current path is protected
  const isProtected = protectedPaths.some(p => {
    if (p === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(p);
  });

  const token = request.cookies.get('auth_token')?.value;

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already authenticated, redirect from login/register to dashboard
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except API, _next/static, _next/image, and public assets
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
