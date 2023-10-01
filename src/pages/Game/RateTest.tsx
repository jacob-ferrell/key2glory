import { useEffect, useState } from "react";
import postTestRating from "../../api/postTestRating";
import { useParams } from "react-router-dom";

type RateTestProps = {
  rating: number | null;
  setRating: (rating: number | null) => void;
};

export default function RateTest({ rating, setRating }: RateTestProps) {
  const allFalse: boolean[] = Array(5).fill(false);
  const [starColors, setStarColors] = useState<boolean[]>(allFalse);

  const { testId } = useParams();

  useEffect(() => {
    if (rating === null) return;
    console.log("rating changed: ", rating);
    colorStars(rating);
  }, [rating]);

  function colorStars(rating: number | null) {
    if (rating === null) return;
    setStarColors((prev) => prev.map((_, i) => i <= rating! - 1));
  }

  function setAllStarsGrey() {
    setStarColors(allFalse);
  }

  function renderStars() {
    return starColors.map((color, i) => {
      return (
        <svg
          key={"star" + i}
          className={`w-4 h-4 ${
            color ? "text-yellow-400" : "text-gray-300"
          } cursor-pointer`}
          onMouseOver={() => colorStars(i + 1)}
          onClick={async () => {
            postTestRating(Number(testId), { rating: i + 1 })
              .then((res) => {
                setRating(res.rating);
                console.log(res);
              })
              .catch((err) => console.log(err));
          }}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      );
    });
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-blue-500 text-xs font-bold">
        Rate This Test
      </div>
      <div
        className="flex items-center space-x-1 cursor-pointer"
        onMouseLeave={() =>
          rating === null ? setAllStarsGrey() : colorStars(rating)
        }
      >
        {renderStars()}
      </div>
    </div>
  );
}
