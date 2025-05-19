
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const protectedRoutes = ['/summary']
  
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    // Since middleware can't access localStorage, we'll use a different approach
    // Check for the token in the request headers (you'll need to send it from client)
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      // If no token found, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Extract token
    const token = authHeader.split(' ')[1]
    
    try {
      // Verify token with backend
      const verifyResponse = await fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!verifyResponse.ok) {
        throw new Error('Invalid token')
      }
      
      return NextResponse.next()
    } catch (error) {
      // Token is invalid, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}