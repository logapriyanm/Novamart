import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_PATHS = ['/admin', '/manufacturer', '/dealer', '/customer', '/account'];

// Routes that are ONLY for guest users
const GUEST_ONLY_PATHS = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token')?.value;

    // 1. If trying to access protected path without token
    const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));
    if (isProtected && !token) {
        const url = new URL('/auth/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    // 2. If already logged in and trying to access guest paths
    const isGuestOnly = GUEST_ONLY_PATHS.some(path => pathname.startsWith(path));
    if (isGuestOnly && token) {
        // Ideally we'd decode the JWT to redirect to the correct dashboard,
        // but for now redirecting to home is safer.
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. Role-based check (Rough check via path prefix)
    // In a real app, you'd decode the JWT here (using jose library)
    // or rely on a checkAuth call on the client/Server Component.

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
