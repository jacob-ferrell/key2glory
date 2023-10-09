import React, { useEffect, useRef, useState } from "react";

type FilterProps = {
  name: string;
  options: Record<string, string>;
  queryParam: string;
  allowMultiple?: boolean;
  setSearchParams: (params: any) => void;
  searchParams: any;
};

export default function Filter({
  name,
  options,
  queryParam,
  setSearchParams,
  searchParams,
  allowMultiple
}: FilterProps) {
  const allFalse = Object.fromEntries(
    Object.keys(options).map((option) => [option, false])
  );
  const [checkboxes, setCheckboxes] = useState(allFalse);
  const [allUnchecked, setAllUnchecked] = useState(true);

  const checkboxRefs = Array.from({ length: Object.keys(options).length }, () => useRef<HTMLInputElement | null>(null));

  useEffect(() => {
    const param = searchParams.get(queryParam);
    if (param && !allowMultiple) {
      const key: string = Object.keys(options).find(o => options[o] === param)!;
      return setCheckboxes({ ...allFalse, [key]: true });
    }
    if (param) {
        const checkedOptions = param.split(",");
        const checkedKeys = Object.keys(options).filter(option => checkedOptions.includes(options[option]));
        return setCheckboxes(prev => ({ ...prev, ...Object.fromEntries(checkedKeys.map(key => [key, true])) }));
    }
    if (queryParam !== "size") return setCheckboxes(allFalse);
    setCheckboxes({ ...allFalse, ["10"]: true });
    setSearchParams((params: { [x: string]: any; set: (arg0: string, arg1: string) => void; }) => {
        params.set(queryParam, options["10"]);
        return params;
    })
  }, [searchParams.get(queryParam)])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCheckboxes(prev => {
        let option = options[e.target.name];
        const updatedCheckboxes = allowMultiple ? { ...prev, [e.target.name]: e.target.checked } : { ...allFalse, [e.target.name]: e.target.checked };
        const allUnchecked = Object.values(updatedCheckboxes).every((checked) => !checked);
        option = allowMultiple ? Object.keys(updatedCheckboxes).filter((option) => updatedCheckboxes[option]).map(option => options[option]).join(",") : option;
        setSearchParams(
            (params: {
              [x: string]: any;
              set: (arg0: string, arg1: string) => void;
            }) => {
              if (allUnchecked) {
                params.delete(queryParam);
                return params;
              }
              params.set(queryParam, option);
              return params;
            }
        );
        return updatedCheckboxes;
    })
  }

function handleClick(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    e.preventDefault();
    //checkboxRefs[Number(e.currentTarget.dataset.ind)]?.current?.click();
}

  return (
    <div className="pl-3">
      <h1 className="text-lg">{name}</h1>
      <ul className="text-sm pl-3">
        {Object.keys(options).map((option, i) => (
          <li
            key={option}
            data-ind={i}
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleClick}
            /* onClick={() => handleClick(option)} */
          >
            <input
              type="checkbox"
              name={option}
              id={option}
              checked={checkboxes[option]}
              onChange={handleChange}
              ref={checkboxRefs[i]}
            />
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}
