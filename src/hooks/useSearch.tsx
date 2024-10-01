
import { useLocation, useSearchParams } from "react-router-dom";
import usePage from "./usePage";
import { useEffect } from "react";

export default function useSearch() {

    const { search } = useLocation();

    const [searchParams, setSearchParams] = useSearchParams();


    useEffect(() => {
             
    }, [search])

    function updateSearchParam(key: string, value: string) {
        setSearchParams((params: { [x: string]: any; set: (arg0: string, arg1: string) => void; }) => {
            if (value === "") {
                params.delete(key);
                return params;
            }
            params.set(key, value);
            return params;
        })
    }

    return {
        searchParams,
        updateSearchParam
    }


}