import { FilterType } from "./types";

  
  const filters: FilterType[] = [
    {
      name: "Test Type",
      options: {
        "Numbers": "NUMBERS",
        "General": "GENERAL",
        "Special Characters": "SPECIAL_CHARACTERS",
      },
      queryParam: "types",
      allowMultiple: true,
    },
    {
      name: "Sort By",
      options: {
        "Most Completed": "COMPLETED",
        "Highest Rating": "RATING",
        "Newest": "CREATED",
        "Length": "LENGTH",
      },
      queryParam: "sort",
    },
    {
      name: "Order",
      options: {
        "Ascending": "ASC",
        "Descending": "DESC",
      },
      queryParam: "order",
    },
    {
        name: "Results Per Page",
        options: {
            "10": "10",
            "25": "25",
            "50": "50",
        },
        queryParam: "size",
    },
    
  ];
  
  export default filters;
  