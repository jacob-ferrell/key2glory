import { useLocation, useSearchParams } from "react-router-dom";
import Filters from "./Filters";
import TestsTable from "./TestsTable";
import { useEffect, useState } from "react";
import { TypingTest } from "../../common/types";
import getTests from "../../api/getTests";

export default function BrowseTests() {
    let location = useLocation();
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [pageResult, setPageResult] = useState<TypingTest[]>([]);
    
    useEffect(() => {
        getTests(location.search)
          .then(res => setPageResult(res))

    }, [location.search])

    return (
        <div className="flex flex-col items-center gap-12 h-screen w-screen">
            <h1>Browse Tests</h1>
            <div className="flex w-screen">
                <Filters />
                <TestsTable tests={pageResult}/>
            </div>
        </div>
    )
}