import { useAuth0 } from "@auth0/auth0-react";
import Filter from "./Filter";
import filters from "../../common/filters";
import ClearFiltersButton from "./ClearFiltersButton";

type FiltersProps = {
  searchParams: URLSearchParams;
  updateParam: (key: string, value: string | null) => void;
  onClear: () => void;
};

export default function Filters({ searchParams, updateParam, onClear }: FiltersProps) {
  const { isAuthenticated } = useAuth0();

  return (
    <aside className="flex h-fit w-full shrink-0 flex-col gap-4 rounded-lg bg-zinc-800 px-4 py-3 md:w-56">
      {filters
        .filter((filter) => isAuthenticated || !filter.requiresAuth)
        .map((filter) => (
          <Filter
            key={filter.queryParam}
            filter={filter}
            value={searchParams.get(filter.queryParam)}
            onChange={(value) => updateParam(filter.queryParam, value)}
          />
        ))}
      <ClearFiltersButton onClick={onClear} />
    </aside>
  );
}
