import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";


export async function POST(req) {
  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL("/", url), 302);
  res.cookies.set(clearSessionCookie());
  return res;
}

// Convenience: support GET so a regular link can sign someone out too.
export const GET = POST;
