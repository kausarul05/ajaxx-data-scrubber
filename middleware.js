import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Note: cookies() is now recommended

export async function middleware(request) {
  // console.log('🔥 Middleware running for:', request.nextUrl.pathname);
  
  // In Next.js 15, you might need to use cookies() differently
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;
  
  const protectedPaths = [
    '/dashboard',
    '/dashboard/history',
    '/dashboard/review',
    '/dashboard/edit-profile',
    '/dashboard/change-password',
  ];
  
  const isProtected = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  if (isProtected && !token) {
    console.log(`Redirecting from ${request.nextUrl.pathname} to /`);
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};