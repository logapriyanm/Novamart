import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_PATHS = ['/admin', '/manufacturer', '/seller', '/customer', '/account'];

// Routes that are ONLY for guest users
const GUEST_ONLY_PATHS = ['/auth/login', '/auth/register'];

function decodeJwt(token: string) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        // Use atob which is available in Edge Runtime
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = atob(base64);
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

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

    // 2. If already logged in and trying to access guest paths (login/register)
    const isGuestOnly = GUEST_ONLY_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'));
    if (isGuestOnly && token) {
        // Redirect logged-in users based on their role for a better experience
        const payload = decodeJwt(token);
        if (payload?.role) {
            if (payload.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url));
            if (payload.role === 'MANUFACTURER') return NextResponse.redirect(new URL('/manufacturer/dashboard', request.url));
            if (payload.role === 'SELLER') return NextResponse.redirect(new URL('/seller/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. Strict Role-based check
    if (token) {
        const payload = decodeJwt(token);
        const role = payload?.role;

        if (pathname.startsWith('/admin') && role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }
        if (pathname.startsWith('/manufacturer') && role !== 'MANUFACTURER') {
            return NextResponse.redirect(new URL('/', request.url));
        }
        if (pathname.startsWith('/seller') && role !== 'SELLER') {
            return NextResponse.redirect(new URL('/', request.url));
        }
        // CUSTOMER role is allowed to access root and customer specific paths (if any)
    }

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
