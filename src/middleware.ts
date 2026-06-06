import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Route-level authentication middleware.
 * - Redirects unauthenticated visitors of protected routes to /login.
 * - Redirects already-authenticated users away from /login and /register.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // All routes that require the user to be logged in
  const protectedPaths = ['/', '/mood', '/journal', '/ai-coach', '/exam-prep', '/settings'];

  const isProtected = protectedPaths.some(p => {
    if (p === '/') return pathname === '/';
    return pathname.startsWith(p);
  });

  const token = request.cookies.get('auth_token')?.value;

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Prevent authenticated users from seeing auth pages
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply to all routes except API routes, Next.js internals, and static assets
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
