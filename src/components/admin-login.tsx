import { Lock } from "lucide-react";
import { adminEnabled } from "@/lib/auth";
import { loginAction } from "@/app/goal/actions";

const inputClass =
  "h-10 w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-foreground transition-colors";

/** Owner sign-in form. `next` must be one of the paths allowed in app/goal/actions.ts. */
export function AdminLogin({ next, error }: { next: string; error?: boolean }) {
  if (!adminEnabled()) {
    return (
      <p className="max-w-md text-sm text-muted">
        Editing is turned off. Set <code>ADMIN_PASSWORD</code> in your environment to enable the owner login.
      </p>
    );
  }

  return (
    <form action={loginAction} className="max-w-sm space-y-3">
      <input type="hidden" name="next" value={next} />
      <p className="flex items-center gap-1.5 text-sm text-muted">
        <Lock className="h-3.5 w-3.5" /> Owner login
      </p>
      <div className="flex gap-2">
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          aria-label="Owner password"
          className={inputClass}
        />
        <button
          type="submit"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-85 active:scale-[0.98]"
        >
          Unlock
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-600" role="alert">
          Wrong password.
        </p>
      )}
    </form>
  );
}
