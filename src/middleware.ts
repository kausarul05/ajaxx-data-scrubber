// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log("🔥 MIDDLEWARE IS RUNNING!");
  console.log("Path:", req.nextUrl.pathname);
  console.log("Method:", req.method);
  
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*", // Match ALL routes
};