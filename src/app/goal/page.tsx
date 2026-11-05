import type { Metadata } from "next";
import { Check, Lock, Plus, Trash2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { adminEnabled, isAdmin } from "@/lib/auth";
import { MAX_GOAL_LENGTH, effectiveProgress, formatPair, listGoals, type Goal } from "@/lib/goals";
import { isPersistent } from "@/lib/store";
import { formatDate } from "@/lib/posts";
import { cn } from "@/lib/utils";
import {
  addGoalAction,
  deleteGoalAction,
  loginAction,
  logoutAction,
  setNumbersAction,
  setProgressAction,
  toggleGoalAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Goals",
  description: "What I'm working towards, checked off as I go.",
  alternates: { canonical: "/goal" },
};

const inputClass =
  "h-10 w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-accent transition-colors";
const smallInput =
  "h-7 rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-2 text-xs text-foreground placeholder:text-muted/60 outline-none focus:border-accent";
const smallButton =
  "h-7 rounded-md border border-dashed border-neutral-300/80 dark:border-neutral-700/80 px-2.5 text-xs text-muted transition-colors hover:text-foreground";
const buttonClass =
  "inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-85 active:scale-[0.98]";

function GoalRow({ goal, admin }: { goal: Goal; admin: boolean }) {
  const percent = effectiveProgress(goal);
  const box = cn(
    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
    goal.done
      ? "border-foreground bg-foreground text-background"
      : "border-neutral-300 dark:border-neutral-600 text-transparent"
  );

  return (
    <li className="flex items-start gap-3 py-3">
      {admin ? (
        <form action={toggleGoalAction}>
          <input type="hidden" name="id" value={goal.id} />
          <button
            type="submit"
            aria-label={goal.done ? "Mark as not done" : "Mark as done"}
            className={cn(box, !goal.done && "hover:border-foreground")}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </button>
        </form>
      ) : (
        <span className={box} role="img" aria-label={goal.done ? "Done" : "Not done yet"}>
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className={cn("text-[15px] leading-6 break-words", goal.done ? "text-muted line-through" : "text-foreground")}>
            {goal.text}
          </p>
          <span className="shrink-0 text-xs font-medium tabular-nums text-muted">{percent}%</span>
        </div>
        <div
          className="mt-1.5 h-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-white/10"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${goal.text} progress`}
        >
          <div
            className={cn("h-full rounded-full transition-all duration-500", goal.done ? "bg-emerald-500" : "bg-foreground")}
            style={{ width: `${percent}%` }}
          />
        </div>
        {goal.done && goal.completedAt && (
          <p className="mt-1 text-xs text-muted/70">Completed {formatDate(goal.completedAt.slice(0, 10))}</p>
        )}
        {goal.target !== undefined && (
          <p className="mt-1.5 text-xs tabular-nums text-muted">
            <span className="font-medium text-foreground">{formatPair(goal.current ?? 0, goal.target, goal.unit).now}</span> of{" "}
            {formatPair(goal.current ?? 0, goal.target, goal.unit).total}
          </p>
        )}
        {admin && (
          <div className="mt-2.5 space-y-1.5">
            {/* real numbers: the percentage is worked out for you (current / target) */}
            <form
              key={`${goal.id}-${goal.current}-${goal.target}-${goal.unit}`}
              action={setNumbersAction}
              className="flex flex-wrap items-center gap-1.5"
            >
              <input type="hidden" name="id" value={goal.id} />
              <input
                type="number"
                name="current"
                min={0}
                step="any"
                defaultValue={goal.current ?? ""}
                placeholder="Now"
                aria-label={`Current amount for ${goal.text}`}
                className={`${smallInput} w-20`}
              />
              <span className="text-xs text-muted">of</span>
              <input
                type="number"
                name="target"
                min={0}
                step="any"
                defaultValue={goal.target ?? ""}
                placeholder="Target"
                aria-label={`Target for ${goal.text}`}
                className={`${smallInput} w-24`}
              />
              <input
                name="unit"
                maxLength={12}
                defaultValue={goal.unit ?? ""}
                placeholder="$ or unit"
                aria-label={`Unit for ${goal.text}`}
                className={`${smallInput} w-24`}
              />
              <button type="submit" className={smallButton}>
                Update
              </button>
            </form>

            {goal.target === undefined && (
              <form action={setProgressAction} className="flex items-center gap-1.5">
                <input type="hidden" name="id" value={goal.id} />
                <span className="text-xs text-muted/70">or set the % directly:</span>
                <input
                  type="number"
                  name="progress"
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={percent}
                  aria-label={`Progress for ${goal.text}`}
                  className={`${smallInput} w-16`}
                />
                <span className="text-xs text-muted">%</span>
                <button type="submit" className={smallButton}>
                  Update
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {admin && (
        <form action={deleteGoalAction}>
          <input type="hidden" name="id" value={goal.id} />
          <button
            type="submit"
            aria-label="Delete goal"
            className="rounded-md p-1 text-muted/60 transition-colors hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </form>
      )}
    </li>
  );
}

export default async function GoalPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, admin, goals] = await Promise.all([searchParams, isAdmin(), listGoals()]);

  const open = goals.filter((g) => !g.done);
  const done = goals.filter((g) => g.done);
  // overall % = average progress, so partial progress on every goal counts
  const percent = goals.length ? Math.round(goals.reduce((sum, g) => sum + effectiveProgress(g), 0) / goals.length) : 0;

  return (
    <PageShell title="Goals" description="What I'm working towards, checked off as I go.">
      {/* progress */}
      <div className="mb-8">
        <p className="mb-2 flex items-baseline justify-between text-sm text-muted">
          <span>
            <span className="font-medium text-foreground">{done.length}</span> of{" "}
            <span className="font-medium text-foreground">{goals.length}</span> done
          </span>
          <span className="font-serif text-2xl text-foreground tabular-nums">{percent}%</span>
        </p>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-white/10"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Goals completed"
        >
          <div className="h-full rounded-full bg-foreground transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* owner: add form */}
      {admin && (
        <>
          <form action={addGoalAction} className="mb-8 flex gap-2">
            <input
              name="text"
              required
              maxLength={MAX_GOAL_LENGTH}
              placeholder="Write a new goal…"
              aria-label="New goal"
              className={inputClass}
            />
            <button type="submit" className={buttonClass}>
              <Plus className="h-4 w-4" /> Add
            </button>
          </form>
          {process.env.NODE_ENV === "production" && !isPersistent() && (
            <p className="mb-6 rounded-lg border border-dashed border-amber-500/50 bg-amber-500/5 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
              Storage isn&apos;t persistent: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (and run supabase/schema.sql) or
              edits will be lost.
            </p>
          )}
        </>
      )}

      {goals.length === 0 ? (
        <p className="text-sm text-muted">{admin ? "No goals yet. Add your first one above." : "No goals yet."}</p>
      ) : (
        <>
          {open.length > 0 && (
            <ul className="divide-y divide-dashed divide-neutral-300/80 dark:divide-neutral-700/80">
              {open.map((g) => (
                <GoalRow key={g.id} goal={g} admin={admin} />
              ))}
            </ul>
          )}
          {done.length > 0 && (
            <>
              <h2 className="mb-1 mt-8 text-xs font-medium uppercase tracking-widest text-muted/70">Completed</h2>
              <ul className="divide-y divide-dashed divide-neutral-300/80 dark:divide-neutral-700/80">
                {done.map((g) => (
                  <GoalRow key={g.id} goal={g} admin={admin} />
                ))}
              </ul>
            </>
          )}
        </>
      )}

      {/* owner login / logout */}
      <div className="mt-12 border-t border-dashed border-neutral-300/80 dark:border-neutral-700/80 pt-5">
        {admin ? (
          <form action={logoutAction}>
            <button type="submit" className="text-xs text-muted transition-colors hover:text-foreground">
              Sign out
            </button>
          </form>
        ) : adminEnabled() ? (
          <details open={Boolean(error)} className="group">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-xs text-muted transition-colors hover:text-foreground">
              <Lock className="h-3 w-3" /> Owner login
            </summary>
            <form action={loginAction} className="mt-3 flex max-w-sm gap-2">
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="Password"
                aria-label="Owner password"
                className={inputClass}
              />
              <button type="submit" className={buttonClass}>
                Unlock
              </button>
            </form>
            {error && <p className="mt-2 text-xs text-red-600" role="alert">Wrong password.</p>}
          </details>
        ) : (
          process.env.NODE_ENV !== "production" && (
            <p className="text-xs text-muted">
              Editing is disabled. Set <code>ADMIN_PASSWORD</code> in <code>.env.local</code> to enable it.
            </p>
          )
        )}
      </div>
    </PageShell>
  );
}
