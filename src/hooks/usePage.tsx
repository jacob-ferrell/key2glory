import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TypingTest } from "../common/types";
import getTests from "../api/getTests";
import useSearch from "./useSearch";

type PageData = {
  content: TypingTest[];
  pageable: {
    pageSize: number;
    pageNumber: number;
  };
  totalPages: number;
};

export default function usePage() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [data, setData] = useState<PageData | null>(null);
  const [hasResults, setHasResults] = useState<boolean>(false);

  const { updateSearchParam } = useSearch();

  const location = useLocation();

  useEffect(() => {
    if (!hasResults) return updateSearchParam("page", "");
    const currentPageString = currentPage === 0 || !hasResults ? "" : currentPage.toString();
    updateSearchParam("page", currentPageString);
  }, [currentPage, hasResults]);


  useEffect(() => {
    getTests(location.search).then((res) => {
      setData(res);
      setHasResults(res.content.length > 0);
      setTotalPages(res.totalPages);
      setCurrentPage(res.pageable.pageNumber);
    })
    .catch((err) => console.log(err));
  }, [location.search]);

  function next() {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }

  function previous() {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }

  return {
    current: currentPage,
    total: totalPages,
    next,
    previous,
    setTotalPages,
    results: data?.content || [],
    setCurrent: setCurrentPage,
    hasResults,
  };
}
