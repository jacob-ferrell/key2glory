import Filters from "./Filters";
import TestsTable from "./TestsTable";
import PageNav from "./PageNav";
import usePage from "../../hooks/usePage";

export default function BrowseTests() {
  const { results } = usePage();

  return (
    <div className="flex flex-col items-center gap-12 h-screen w-screen">
      <div className="flex w-screen px-3">
        <Filters />

        <div className="flex flex-col items-center w-3/4 justify-center">
          {results.length === 0 ? (
            <div>Search criteria yielded no results</div>
          ) : (
            <>
              {" "}
              <PageNav />
              <TestsTable />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
