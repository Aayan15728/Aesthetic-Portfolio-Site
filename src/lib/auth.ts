import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Single-owner auth for the /goal page.
 *
 * Set ADMIN_PASSWORD in the environment. Without it nobody can edit (the page stays read-only),
 * so forks of this repo are safe by default.
 *
 * The cookie holds an HMAC derived from the password, so changing the password signs everyone out.
 */
const ADMIN_COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function tokenFor(password: string): string {
  return createHmac("sha256", password).update("portfolio-admin-v1").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function adminEnabled(): boolean {
  return secret() !== null;
}

/** Verifies the cookie of the current request. Call this inside EVERY server action that mutates data. */
export async function isAdmin(): Promise<boolean> {
  const password = secret();
  if (!password) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!value && safeEqual(value, tokenFor(password));
}

export async function signIn(candidate: string): Promise<boolean> {
  const password = secret();
  if (!password) return false;
  // compare digests so length differences don't leak through timing
  const ok = safeEqual(tokenFor(candidate), tokenFor(password));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 600)); // slow down brute force
    return false;
  }
  (await cookies()).set(ADMIN_COOKIE, tokenFor(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function signOut(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
}
