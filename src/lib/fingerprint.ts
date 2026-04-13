/**
 * Returns a persistent, unique visitor ID from localStorage.
 * On first visit a UUID is generated and stored; subsequent calls
 * return the same ID so the same browser is only counted once.
 */
export function getOrCreateVisitorId(): string {
  let id = localStorage.getItem("visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitor_id", id);
  }
  return id;
}
