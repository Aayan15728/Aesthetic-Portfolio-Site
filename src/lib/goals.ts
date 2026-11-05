import { randomUUID } from "crypto";
import { getJSON, setJSON } from "@/lib/store";

export interface Goal {
  id: string;
  text: string;
  /** 0-100. Ignored for display once `done` is true (a done goal is always 100%). */
  progress: number;
  done: boolean;
  createdAt: string;
  completedAt?: string;
  /** Optional numeric tracking: progress is then worked out as current / target. */
  current?: number;
  target?: number;
  /** "$" (and other currency symbols) go in front of the number; anything else, like "followers", goes after it. */
  unit?: string;
}

const KEY = "goals";
export const MAX_GOAL_LENGTH = 200;
const MAX_GOALS = 200;

/** Shown until the owner makes the first change; after that the stored list is the truth. */
const SEED_GOALS: Goal[] = [
  { id: "seed-1k-dollars", text: "Make $1k", progress: 0, current: 0, target: 1000, unit: "$", done: false, createdAt: "2026-10-27T00:00:00.000Z" },
  { id: "seed-1k-followers", text: "Reach 1K followers", progress: 0, current: 0, target: 1000, unit: "followers", done: false, createdAt: "2026-10-27T00:00:01.000Z" },
  { id: "seed-physique", text: "Build a good physique", progress: 0, done: false, createdAt: "2026-10-27T00:00:02.000Z" },
  { id: "seed-ferrari", text: "Buy a Ferrari SF90 Spyder", progress: 0, done: false, createdAt: "2026-10-29T00:00:00.000Z" },
  { id: "seed-macbook", text: "Buy a MacBook M5 Pro", progress: 0, done: false, createdAt: "2026-10-29T00:00:01.000Z" },
];

const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

/** What a goal counts for in totals: finished goals are 100%, unfinished ones never show above 99%. */
export function effectiveProgress(goal: Goal): number {
  return goal.done ? 100 : Math.min(99, clamp(goal.progress));
}

export async function listGoals(): Promise<Goal[]> {
  const goals = await getJSON<Goal[]>(KEY, SEED_GOALS);
  // goals saved before progress existed
  return goals.map((g) => ({ ...g, progress: typeof g.progress === "number" ? g.progress : g.done ? 100 : 0 }));
}

export async function addGoal(text: string): Promise<void> {
  const clean = text.trim().slice(0, MAX_GOAL_LENGTH);
  if (!clean) return;
  const goals = await listGoals();
  if (goals.length >= MAX_GOALS) return;
  goals.push({ id: randomUUID(), text: clean, progress: 0, done: false, createdAt: new Date().toISOString() });
  await setJSON(KEY, goals);
}

export async function toggleGoal(id: string): Promise<void> {
  const goals = await listGoals();
  const goal = goals.find((g) => g.id === id);
  if (!goal) return;
  goal.done = !goal.done;
  goal.completedAt = goal.done ? new Date().toISOString() : undefined;
  await setJSON(KEY, goals);
}

export async function setGoalProgress(id: string, value: number): Promise<void> {
  if (!Number.isFinite(value)) return;
  const goals = await listGoals();
  const goal = goals.find((g) => g.id === id);
  if (!goal) return;
  goal.progress = clamp(value);
  const nowDone = goal.progress >= 100;
  if (nowDone && !goal.done) goal.completedAt = new Date().toISOString();
  if (!nowDone) goal.completedAt = undefined;
  goal.done = nowDone;
  await setJSON(KEY, goals);
}

const PREFIX_UNITS = new Set(["$", "€", "£", "¥", "₹"]);
const MAX_AMOUNT = 1e12;

/** 1250 + "$" -> "$1,250"; 320 + "followers" -> "320 followers". */
function formatAmount(value: number, unit?: string): string {
  const n = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
  if (!unit) return n;
  return PREFIX_UNITS.has(unit) ? `${unit}${n}` : `${n} ${unit}`;
}

/**
 * The two halves of "$105 of $1,000" / "782 of 1,000 followers". A currency symbol goes on both numbers;
 * a word unit goes once, after the target.
 */
export function formatPair(current: number, target: number, unit?: string): { now: string; total: string } {
  if (unit && PREFIX_UNITS.has(unit)) return { now: formatAmount(current, unit), total: formatAmount(target, unit) };
  return { now: formatAmount(current), total: formatAmount(target, unit) };
}

/**
 * Track a goal with real numbers: the percentage is calculated for you (current / target). Leaving the target
 * empty switches numeric tracking off and the manual percentage takes over again.
 */
export async function setGoalNumbers(
  id: string,
  input: { current: number | null; target: number | null; unit: string }
): Promise<void> {
  const goals = await listGoals();
  const goal = goals.find((g) => g.id === id);
  if (!goal) return;

  if (input.target === null || !Number.isFinite(input.target) || input.target <= 0) {
    delete goal.current;
    delete goal.target;
    delete goal.unit;
    await setJSON(KEY, goals);
    return;
  }

  const target = Math.min(input.target, MAX_AMOUNT);
  const current = Math.min(Math.max(0, input.current ?? 0), MAX_AMOUNT);
  const unit = input.unit.trim().slice(0, 12);

  goal.target = target;
  goal.current = current;
  if (unit) goal.unit = unit;
  else delete goal.unit;

  const reached = current >= target;
  // never show 100% until the target is actually reached
  goal.progress = reached ? 100 : Math.min(99, Math.round((current / target) * 100));
  if (reached && !goal.done) goal.completedAt = new Date().toISOString();
  if (!reached) goal.completedAt = undefined;
  goal.done = reached;
  await setJSON(KEY, goals);
}

export async function removeGoal(id: string): Promise<void> {
  const goals = await listGoals();
  await setJSON(
    KEY,
    goals.filter((g) => g.id !== id)
  );
}
