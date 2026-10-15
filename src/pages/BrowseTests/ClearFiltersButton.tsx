export default function ClearFiltersButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full rounded-md bg-purple-600 py-1.5 font-semibold transition hover:bg-purple-500">
      Clear filters
    </button>
  );
}
