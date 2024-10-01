import useUserStats from "../../hooks/useUserStats";
import MissedCharactersTable from "../Game/MissedCharactersTable";

export default function UserStats() {
  const { missedCharacters, isEmpty } = useUserStats();
  return (
    <div>
      {!isEmpty ? (
        <MissedCharactersTable
          missedCharacters={missedCharacters}
          show={true}
        />
      ) : null}
    </div>
  );
}
