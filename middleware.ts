// Middleware disabled for UI preview
// Re-enable Clerk middleware when ready for production

import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
