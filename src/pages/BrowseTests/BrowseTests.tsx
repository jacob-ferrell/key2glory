import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Filters from "./Filters";
import TestsTable from "./TestsTable";
import PageNav from "./PageNav";
import getTests from "../../api/getTests";
import useAsync from "../../hooks/useAsync";
import useTitle from "../../hooks/useTitle";
import { EmptyState, ErrorNotice, Spinner } from "../../components/Feedback";

const SEARCH_DEBOUNCE_MS = 300;

export default function BrowseTests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth0();
  const query = searchParams.toString();
  const { data: page, error, loading, reload } = useAsync(
    () => getTests(query ? `?${query}` : ""),
    [query, isAuthenticated]
  );
  const [searchText, setSearchText] = useState(searchParams.get("q") ?? "");

  useTitle("Browse tests");

  function updateParam(key: string, value: string | null) {
    setSearchParams((params) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Any change other than paging starts back at the first page
      if (key !== "page") params.delete("page");
      return params;
    });
  }

  // Debounce typing in the search box before it hits the URL (and the API)
  const urlQuery = searchParams.get("q") ?? "";
  useEffect(() => {
    if (searchText.trim() === urlQuery) return;
    const timeout = window.setTimeout(() => updateParam("q", searchText.trim() || null), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  // Keep the box in sync when the URL changes elsewhere (e.g. "Clear")
  useEffect(() => setSearchText((prev) => (prev.trim() === urlQuery ? prev : urlQuery)), [urlQuery]);

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <Filters searchParams={searchParams} updateParam={updateParam} onClear={() => setSearchParams({})} />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <label className="relative block">
          <span className="sr-only">Search tests</span>
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search test text…"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-10 pr-3 text-zinc-100 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
          />
        </label>

        {error ? (
          <ErrorNotice message={error} onRetry={reload} />
        ) : !page ? (
          <Spinner label="Loading tests…" />
        ) : page.content.length === 0 ? (
          <EmptyState>No tests match your search.</EmptyState>
        ) : (
          <div className={`flex flex-col gap-3 transition-opacity ${loading ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm text-zinc-400">
                {page.totalElements} test{page.totalElements === 1 ? "" : "s"}
              </span>
              <PageNav
                current={page.number}
                total={page.totalPages}
                onChange={(next) => updateParam("page", next > 0 ? String(next) : null)}
              />
            </div>
            <TestsTable tests={page.content} />
          </div>
        )}
      </div>
    </div>
  );
}
