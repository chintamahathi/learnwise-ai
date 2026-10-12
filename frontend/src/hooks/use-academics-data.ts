import { useCallback, useEffect, useRef, useState } from "react";
import { getRecords, getTopicStats, ApiError, type PerfRecord, type TopicStat } from "@/api";

export type AcademicsLoadState =
  { status: "loading" } | { status: "error"; message: string } | { status: "success" };

interface AcademicsData {
  records: PerfRecord[];
  stats: TopicStat[];
  loadState: AcademicsLoadState;
  /** Re-fetches records + stats from the backend. */
  refresh: () => void;
}

/**
 * Fetches performance records and topic stats from the backend on mount.
 * Returns a `refresh()` callback that any child mutation can call after
 * POSTing or DELETEing a record so the whole page stays in sync.
 */
export function useAcademicsData(): AcademicsData {
  const [records, setRecords] = useState<PerfRecord[]>([]);
  const [stats, setStats] = useState<TopicStat[]>([]);
  const [loadState, setLoadState] = useState<AcademicsLoadState>({ status: "loading" });
  const [tick, setTick] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoadState({ status: "loading" });

    Promise.all([getRecords(), getTopicStats()])
      .then(([recRes, statsRes]) => {
        if (controller.signal.aborted) return;
        setRecords(recRes.data);
        setStats(statsRes.data);
        setLoadState({ status: "success" });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Unexpected error loading academic data.";
        setLoadState({ status: "error", message });
      });

    return () => {
      controller.abort();
    };
  }, [tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  return { records, stats, loadState, refresh };
}
