import Filter from "./Filter";
import filters from "../../common/filters";
import ClearFiltersButton from "./ClearFiltersButton";
import { useAuth0 } from "@auth0/auth0-react";

export default function Filters() {

  const { isAuthenticated } = useAuth0();

  
  return (
    <div className="w-fit bg-zinc-800 rounded h-fit px-3 py-2 flex flex-col gap-2">
      {filters.slice(isAuthenticated ? 0 : 1).map((filter, i) => {
        return (
          <Filter
            key={i}
            name={filter.name}
            options={filter.options}
            queryParam={filter.queryParam}
            /* searchParams={_}
            setSearchParams={setSearchParams} */
            allowMultiple={filter.allowMultiple}
          />
        );
      })}
      <ClearFiltersButton />
    </div>
  );
}
