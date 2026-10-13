// proxy.ts
//
// Path-level protection for the administrative area. Next 16 executes this file
// convention (`proxy.ts`, export `proxy`) instead of the deprecated
// `middleware.ts`, and rejects a project that ships both.
//
// This guard answers one question only: is there a session at all? Role decisions
// are made in `requireAdmin()` (lib/api-error-handler.ts), which reads the stored
// role on every request, and in the administrative layout.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (pathname.startsWith("/admin") && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Signed-in visitors have no reason to see the sign-in form. The matcher below
  // covers this path, so the branch is reachable.
  if (pathname.startsWith("/auth/login") && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

// Covers exactly the paths the guard branches on.
export const config = {
  matcher: ["/admin/:path*", "/auth/login"],
};
