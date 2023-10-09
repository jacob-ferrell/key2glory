import Filter from "./Filter";
import filters from "../../common/filters";
import { useSearchParams } from "react-router-dom";

export default function Filters() {
  const [_, setSearchParams] = useSearchParams();
  

  return (
    <div className="w-1/4">
      <h1>Filters</h1>
      {filters.map((filter, i) => {
        return (
          <Filter
            key={i}
            name={filter.name}
            options={filter.options}
            queryParam={filter.queryParam}
            searchParams={_}
            setSearchParams={setSearchParams}
            allowMultiple={filter.allowMultiple}
          />
        );
      })}
    </div>
  );
}
