import { FilterType } from "./types";

const filters: FilterType[] = [
  {
    name: "My Tests",
    options: {
      Favorites: "FAVORITES",
      "Created by Me": "CREATED",
      "Completed by Me": "COMPLETED",
    },
    queryParam: "mine",
    requiresAuth: true,
  },
  {
    name: "Test Type",
    options: {
      General: "GENERAL",
      Numbers: "NUMBERS",
      "Special Characters": "SPECIAL_CHARACTERS",
    },
    queryParam: "types",
    allowMultiple: true,
  },
  {
    name: "Sort By",
    options: {
      Newest: "CREATED",
      "Most Completed": "COMPLETED",
      "Highest Rating": "RATING",
      Length: "LENGTH",
    },
    queryParam: "sort",
    defaultValue: "CREATED",
  },
  {
    name: "Order",
    options: {
      Descending: "DESC",
      Ascending: "ASC",
    },
    queryParam: "order",
    defaultValue: "DESC",
  },
  {
    name: "Results Per Page",
    options: {
      "10": "10",
      "25": "25",
      "50": "50",
    },
    queryParam: "size",
    defaultValue: "10",
  },
];

export default filters;
