import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/onboarding(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Handle protected routes
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  try {
    const { userId, orgId } = await auth();

    // Redirect to onboarding if logged in but no org selected
    if (
      userId && !orgId &&
      !req.nextUrl.pathname.startsWith('/onboarding') &&
      req.nextUrl.pathname !== '/'
    ) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }

  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.next();
  }

  return NextResponse.next();
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};