import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import usePage from "../../hooks/usePage";
import useSearch from "../../hooks/useSearch";

type FilterProps = {
  name: string;
  options: Record<string, string>;
  queryParam: string;
  allowMultiple?: boolean;
};

export default function Filter({
  name,
  options,
  queryParam,
  allowMultiple,
}: FilterProps) {
  const allFalse = Object.fromEntries(
    Object.keys(options).map((option) => [option, false])
  );
  const [checkboxes, setCheckboxes] = useState(allFalse);

  const [searchParams] = useSearchParams();

  const search = useSearch();

  const { setCurrent } = usePage();

  useEffect(() => {
    const param = searchParams.get(queryParam);
    if (param && !allowMultiple) {
      const key: string = Object.keys(options).find(
        (o) => options[o] === param
      )!;
      return setCheckboxes({ ...allFalse, [key]: true });
    }
    if (param) {
      const checkedOptions = param.split(",");
      const checkedKeys = Object.keys(options).filter((option) =>
        checkedOptions.includes(options[option])
      );
      return setCheckboxes((prev) => ({
        ...prev,
        ...Object.fromEntries(checkedKeys.map((key) => [key, true])),
      }));
    }
    if (queryParam !== "size") return setCheckboxes(allFalse);
    setCheckboxes({ ...allFalse, ["10"]: true });
    search.updateSearchParam("size", "10");
  }, [searchParams.get(queryParam)]);

  useEffect(() => {
    
    const allUnchecked = Object.values(checkboxes).every((v) => !v);
    if (allUnchecked) {
        search.updateSearchParam(queryParam, "");
        return;
    }
    const checkedKeys = Object.keys(checkboxes).filter(
      (key) => checkboxes[key]
    );
    const checkedOptions = checkedKeys.map((key) => options[key]);
    search.updateSearchParam(queryParam, checkedOptions.join(","));
  }, [checkboxes])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCheckboxes((prev) => {
      return allowMultiple
        ? { ...prev, [e.target.name]: e.target.checked }
        : { ...allFalse, [e.target.name]: e.target.checked };
    });
  }

  return (
    <div className="pl-3">
      <h1 className="text-lg">{name}</h1>
      <ul className="text-sm pl-3">
        {Object.keys(options).map((option) => (
          <li key={option} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={option}
              id={option}
              checked={checkboxes[option] || false}
              onChange={handleChange}
              className="cursor-pointer"
            />
            <label
              className="cursor-pointer"
              onClick={(e) => e.stopPropagation()}
              htmlFor={option}
            >
              {option}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
