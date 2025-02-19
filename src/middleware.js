import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const session = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET, 
    cookieName: "__Secure-next-auth.session-token"
  });
  console.log("SESSION: ", session);
  const { pathname } = req.nextUrl;

  // Define paths that should be accessible only to unauthenticated users
  const publicPaths = ["/pages/signIn", "/pages/signUp"]

  if (session) {
    // If the user is signed in, restrict access to signIn and signUp pages
    if (publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/pages/profile", req.url));
    }
  } else {
    // If the user is not signed in, restrict access to non-public pages
    if (!publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/pages/signIn", req.url));
    }
  }

  // Allow access if conditions above are not met
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/pages/:path*", // Apply middleware to all paths under /pages
  ],
};
