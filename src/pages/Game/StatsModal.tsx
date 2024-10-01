import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import RateTest from "./RateTest";
import MissedCharactersTable from "./MissedCharactersTable";
import { Stats } from "../../common/types";
import { useAuth0 } from "@auth0/auth0-react";
import addToFavorites from "../../api/addToFavorites";
import { useParams } from "react-router-dom";

type StatsModalProps = {
  stats: Stats;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setRating: (rating: number | null) => void;
  rating: number | null;
  missedCharacters: string[];
};

type SliderValues = {
  wpm: number;
  accuracy: number;
  overallScore: number;
};

export default function StatsModal({
  stats,
  isOpen,
  setIsOpen,
  rating,
  setRating,
}: StatsModalProps) {
  const { isAuthenticated } = useAuth0();
  const [showMissedCharacters, setShowMissedCharacters] =
    useState<boolean>(false);

  const [sliderValues, setSliderValues] = useState<SliderValues>({
    wpm: 0,
    accuracy: 0,
    overallScore: 0,
  });

  const { testId } = useParams();

  useEffect(() => {
    setTimeout(() => {
      setInterval(() => {
        setSliderValues((prev) => ({
          wpm: Math.min(prev.wpm + 1, stats.wpm),
          accuracy: Math.min(prev.accuracy + 1, stats.accuracy),
          overallScore: Math.min(prev.overallScore + 1, stats.overallScore),
        }));
      }, 10);
    }, 300);
  }, []);

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  ></Dialog.Title>

                  <div className="mt-2 flex flex-col gap-2 justify-center w-full">
                    <ul className="text-sm text-gray-500 flex flex-col gap-1">
                      <li className="flex flex-col gap-1 flex-wrap nowrap items-center">
                        <span className="font-bold">WPM: {stats.wpm}</span>
                        <div className="rounded bg-gray-200 relative w-full h-5">
                          <div
                            style={{ width: `${(stats.wpmScore / 8) * 100}%` }}
                            className="h-full"
                          >
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${sliderValues.wpm}%` }}
                            ></div>
                          </div>
                        </div>
                      </li>
                      <li className="flex flex-col gap-1 flex-wrap nowrap items-center">
                        <span className="font-bold">
                          Accuracy: {stats.accuracy}%
                        </span>
                        <div className="rounded bg-gray-200 relative w-full h-5">
                          <div
                            style={{ width: `${stats.accuracy}%` }}
                            className="h-full"
                          >
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${sliderValues.accuracy}%` }}
                            ></div>
                          </div>
                        </div>
                      </li>
                      <li className="flex flex-col gap-1 flex-wrap nowrap items-center">
                        <span className="font-bold">
                          Overall Score: {stats.overallScore}
                        </span>
                        <div className="rounded bg-gray-200 relative w-full h-5">
                          <div
                            style={{ width: `${stats.overallScore}%` }}
                            className="h-full"
                          >
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${sliderValues.overallScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div className="flex">
                      {stats.missedCharacters.length > 0 ? (
                        <div
                          className={`flex flex-col items-center w-${
                            isAuthenticated ? "1/2" : "full"
                          }`}
                        >
                          <span
                            className="text-blue-500 cursor-pointer font-bold text-xs"
                            onClick={() =>
                              setShowMissedCharacters((prev) => !prev)
                            }
                          >
                            {showMissedCharacters
                              ? "Hide Missed Characters ▲"
                              : "Show Missed Characters ▼"}
                          </span>
                          <MissedCharactersTable
                            missedCharacters={stats.missedCharacters}
                            show={showMissedCharacters}
                          />
                        </div>
                      ) : null}
                      {isAuthenticated ? (
                        <div className="flex justify-between w-full">
                          <div className="w-1/2">
                            <RateTest rating={rating} setRating={setRating} />
                          </div>
                          <div className="cursor-pointer text-gray-400" onClick={() => testId ? addToFavorites(testId) : null}>
                            Add to Favorites
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
