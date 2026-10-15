import { Link } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

export default function NotFound() {
  useTitle("Page not found");
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-zinc-400">That page doesn't exist.</p>
      <Link to="/" className="font-semibold text-purple-300 hover:underline">
        Back to home
      </Link>
    </div>
  );
}
