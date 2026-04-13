/**
 * API route: /api/visitors
 *
 * POST  { fingerprint: string }  →  registers a unique visitor (no-op if already seen)
 * GET                            →  returns { count: number }
 *
 * Storage: JSON file at <project-root>/data/visitors.json
 * ⚠️  Works perfectly for local dev and single-instance Node servers.
 *     For Netlify/Vercel (serverless) swap the fs calls with a hosted DB
 *     (Supabase, PlanetScale, Upstash Redis, Netlify Blobs, etc.)
 */

import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// ---------- helpers ----------------------------------------------------------

const DATA_DIR  = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "visitors.json");

function readIds(): string[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8").trim();
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(ids), "utf-8");
}

// ---------- GET --------------------------------------------------------------

export async function GET() {
  const ids = readIds();
  return Response.json({ count: ids.length });
}

// ---------- POST -------------------------------------------------------------

export async function POST(request: NextRequest) {
  let fingerprint: string | undefined;

  try {
    const body = await request.json();
    fingerprint = typeof body?.fingerprint === "string" ? body.fingerprint : undefined;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!fingerprint) {
    return Response.json({ error: "fingerprint required" }, { status: 400 });
  }

  const ids = readIds();
  if (!ids.includes(fingerprint)) {
    ids.push(fingerprint);
    writeIds(ids);
  }

  return Response.json({ count: ids.length });
}
