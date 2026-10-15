import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function HeaderLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-800">
        <Navbar />
      </header>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
