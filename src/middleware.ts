// middleware.ts
import {NextResponse } from "next/server";

export function middleware() {
  // console.log("🔥 MIDDLEWARE IS RUNNING!");
  // console.log("Path:", req.nextUrl.pathname);
  // console.log("Method:", req.method);
  
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*", // Match ALL routes
};