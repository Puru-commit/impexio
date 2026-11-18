import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Sends anyone who is not signed in away from /app before the page loads.
export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = { matcher: ["/app/:path*"] };
