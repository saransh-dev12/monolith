import type { TaskStatus } from "@/types/database";

export type BoardOverride = {
  status: TaskStatus;
  /** Timestamp returned by the successful update; absent while saving. */
  confirmedAt?: string | null;
};

/** Only retire an optimistic status when a server snapshot confirms or supersedes it. */
export function snapshotSupersedesOverride(
  snapshot: { status: TaskStatus; updated_at: string | null },
  override: BoardOverride,
): boolean {
  if (snapshot.status === override.status) return true;
  if (!snapshot.updated_at || !override.confirmedAt) return false;
  const snapshotTime = Date.parse(snapshot.updated_at);
  const confirmationTime = Date.parse(override.confirmedAt);
  return (
    Number.isFinite(snapshotTime) &&
    Number.isFinite(confirmationTime) &&
    snapshotTime > confirmationTime
  );
}
