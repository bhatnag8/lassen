import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const isPublic = (pathname === "/" 
    || pathname.startsWith("/auth/login") 
    || pathname.startsWith("/auth/signup")
    || pathname.startsWith("/auth/forgot-password")
    || pathname.startsWith("/auth/reset-password")
    || pathname === "/logo.png"
    || pathname === "/images/1.jpg"
    || pathname === "/images/2.jpg"
    || pathname === "/images/3.jpg"
  );

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
