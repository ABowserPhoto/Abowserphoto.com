import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. Define your subdomains
  const isImmo = hostname.startsWith('immo.');
  const isFood = hostname.startsWith('food.');
  const isWedding = hostname.startsWith('wedding.');

  // 2. Rewrite the URL invisibly to the correct folder path
  // The user still sees "immo.aaronbowser-photography.com" in their browser
  if (isImmo) {
    return NextResponse.rewrite(new URL(`/immo${url.pathname}`, req.url));
  }
  
  if (isFood) {
    return NextResponse.rewrite(new URL(`/food${url.pathname}`, req.url));
  }

  if (isWedding) {
    return NextResponse.rewrite(new URL(`/wedding${url.pathname}`, req.url));
  }

  // 3. Let normal root domain traffic pass through unchanged
  return NextResponse.next();
}

// Ensure the middleware doesn't run on images, CSS, or API routes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|commercial).*)',
  ],
};