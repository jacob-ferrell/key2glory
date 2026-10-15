import { FilterType } from "../../common/types";

type FilterProps = {
  filter: FilterType;
  // Current query param value (comma separated when allowMultiple)
  value: string | null;
  onChange: (value: string | null) => void;
};

export default function Filter({ filter, value, onChange }: FilterProps) {
  const { name, options, queryParam, allowMultiple, defaultValue } = filter;
  const selected = value ? value.split(",") : defaultValue ? [defaultValue] : [];

  function toggle(optionValue: string, checked: boolean) {
    let next: string[];
    if (allowMultiple) {
      next = checked ? [...selected, optionValue] : selected.filter((v) => v !== optionValue);
    } else {
      next = checked ? [optionValue] : [];
    }
    // The server default doesn't need to be in the URL
    const isDefault = !allowMultiple && next.length === 1 && next[0] === defaultValue;
    onChange(next.length === 0 || isDefault ? null : next.join(","));
  }

  return (
    <fieldset>
      <legend className="mb-1 font-semibold">{name}</legend>
      <ul className="flex flex-col gap-1 pl-1 text-sm">
        {Object.entries(options).map(([label, optionValue]) => {
          const id = `${queryParam}-${optionValue}`;
          return (
            <li key={optionValue} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={id}
                checked={selected.includes(optionValue)}
                onChange={(e) => toggle(optionValue, e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-purple-500"
              />
              <label className="cursor-pointer text-zinc-300" htmlFor={id}>
                {label}
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
