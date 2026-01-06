import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// DEMO MODE - Set to false for production with auth
const DEMO_MODE = process.env.DEMO_MODE === "true";

export function middleware(req: NextRequest) {
  // If demo mode, allow all access
  if (DEMO_MODE) {
    return NextResponse.next();
  }

  // TODO: Add proper auth check here when ready for production
  // For now, just allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
