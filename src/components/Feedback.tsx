import { ReactNode } from "react";

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-zinc-400" role="status">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-purple-500" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorNotice({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-red-200">
      <span>{message}</span>
      {onRetry ? (
        <button onClick={onRetry} className="rounded-md bg-red-900 px-3 py-1 text-sm font-semibold hover:bg-red-800">
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-lg bg-zinc-800/60 px-4 py-8 text-center text-zinc-400">{children}</div>;
}
