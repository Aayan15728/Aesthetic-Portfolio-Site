"use client";

import { useSyncExternalStore } from "react";
import { ageOn } from "@/lib/age";

const subscribe = () => () => {};

/**
 * The page is pre-built, so a server-rendered age would go stale on the birthday.
 * This shows the build-time value first, then switches to the visitor's current date.
 */
export function Age({ birthDate, serverAge }: { birthDate: string; serverAge: number }) {
  const age = useSyncExternalStore(
    subscribe,
    () => ageOn(birthDate, new Date()),
    () => serverAge
  );
  return <>{age}</>;
}
