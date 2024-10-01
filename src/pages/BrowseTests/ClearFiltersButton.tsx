import { useNavigate } from "react-router-dom";

export default function ClearFiltersButton() {

    const navigate = useNavigate();

    function handleClick() {
        navigate("/typing-test/browse");
    }

    return (
        <button onClick={handleClick} className="bg-purple-600 p-1 font-bold w-full">
            Clear
        </button>
    );
}