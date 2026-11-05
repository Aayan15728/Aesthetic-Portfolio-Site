"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin, signIn, signOut } from "@/lib/auth";
import { addGoal, removeGoal, setGoalNumbers, setGoalProgress, toggleGoal } from "@/lib/goals";

// Server Actions are reachable by direct POST, so every mutation re-checks the session.

// where signing in / out may send you back to (an allowlist, so the redirect can't be abused)
const RETURN_PATHS = ["/goal", "/writings", "/writings/new"];

function returnPath(formData: FormData): string {
  const next = formData.get("next");
  return typeof next === "string" && RETURN_PATHS.includes(next) ? next : "/goal";
}

export async function loginAction(formData: FormData) {
  const password = formData.get("password");
  const next = returnPath(formData);
  const ok = typeof password === "string" && (await signIn(password));
  redirect(ok ? next : `${next}?error=1`);
}

export async function logoutAction(formData?: FormData) {
  await signOut();
  redirect(formData ? returnPath(formData) : "/goal");
}

export async function addGoalAction(formData: FormData) {
  if (!(await isAdmin())) return;
  const text = formData.get("text");
  if (typeof text === "string") await addGoal(text);
  revalidatePath("/goal");
}

export async function toggleGoalAction(formData: FormData) {
  if (!(await isAdmin())) return;
  const id = formData.get("id");
  if (typeof id === "string") await toggleGoal(id);
  revalidatePath("/goal");
}

export async function setProgressAction(formData: FormData) {
  if (!(await isAdmin())) return;
  const id = formData.get("id");
  const progress = Number(formData.get("progress"));
  if (typeof id === "string") await setGoalProgress(id, progress);
  revalidatePath("/goal");
}

const toNumber = (value: FormDataEntryValue | null): number | null => {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/,/g, "").trim();
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

export async function setNumbersAction(formData: FormData) {
  if (!(await isAdmin())) return;
  const id = formData.get("id");
  const unit = formData.get("unit");
  if (typeof id === "string") {
    await setGoalNumbers(id, {
      current: toNumber(formData.get("current")),
      target: toNumber(formData.get("target")),
      unit: typeof unit === "string" ? unit : "",
    });
  }
  revalidatePath("/goal");
}

export async function deleteGoalAction(formData: FormData) {
  if (!(await isAdmin())) return;
  const id = formData.get("id");
  if (typeof id === "string") await removeGoal(id);
  revalidatePath("/goal");
}
