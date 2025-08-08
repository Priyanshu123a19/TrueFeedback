//! if ther problem occurs in this file jusst check the original code of the video at 50 -----57 mins of timing

import { NextResponse, NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"
export { default } from "next-auth/middleware"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl;

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if(token && 
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/' // ✅ Only exact home page, not all paths
        )
    ){
        console.log('Redirecting authenticated user to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If user is NOT authenticated and trying to access protected routes
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // ✅ Allow request to continue
    return NextResponse.next()
}

export const config = {
  matcher: [
    '/sign-up',
    '/sign-in', 
    '/verify/:path*', // ✅ Fixed: 'path' not 'paths'
    '/dashboard/:path*', // ✅ Fixed: 'path' not 'paths'
    '/'
  ],
}