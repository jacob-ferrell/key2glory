import { DependencyList, useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../api/axiosInstance";

/** Runs an async loader whenever deps change, ignoring responses that arrive out of order. */
export default function useAsync<T>(loader: () => Promise<T>, deps: DependencyList, enabled = true) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(enabled);
  const requestId = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(loader, deps);

  const reload = useCallback(() => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    load()
      .then((result) => {
        if (id === requestId.current) setData(result);
      })
      .catch((err) => {
        if (id === requestId.current) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }, [load]);

  useEffect(() => {
    if (enabled) {
      reload();
    } else {
      requestId.current++;
      setLoading(false);
    }
  }, [reload, enabled]);

  return { data, setData, error, loading, reload };
}
