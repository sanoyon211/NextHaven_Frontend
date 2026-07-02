import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if the user has a "token" cookie
  const token = request.cookies.get('token')?.value;

  const url = request.nextUrl.clone();
  
  // If no token is found, redirect to /login
  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed if token exists
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};
