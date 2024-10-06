import useUserStats from "../../hooks/useUserStats";
import MissedCharactersTable from "../Game/MissedCharactersTable";
import GeneralStatsTable from "./GeneralStatsTable";

export default function UserStats() {
  const {
    missedCharacters,
    hasMissedCharacters,
    hasGeneralStats,
  } = useUserStats();
  return (
    <div className="flex justify-center gap-10">
      <div className="p-3">
        <h2 className="w-full text-center font-bold">Missed Characters</h2>
        {!!hasMissedCharacters ? (
          <MissedCharactersTable
            missedCharacters={missedCharacters}
            show={true}
          />
        ) : (
          <div>You have no missed character logs</div>
        )}
      </div>
      <div className="p-3">
        <h2 className="w-full text-center font-bold">General Stats</h2>
        {!!hasGeneralStats ? (
          <GeneralStatsTable />
        ) : (
          <div>You have not completed any tests and have no stats</div>
        )}
      </div>
    </div>
  );
}
