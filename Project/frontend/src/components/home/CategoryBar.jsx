import { useCategories } from "../../hooks/useCategories";

export default function CategoryBar() {
  const { data, isLoading } = useCategories();

  if (isLoading) return <p>Loading...</p>;

  const categories = data?.data || [];

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 py-4 px-4">
        {categories.map((cat) => (
          <button
            key={cat.category}
            className="min-w-[160px] h-[80px] bg-gray-400 text-white rounded-xl flex items-center justify-center font-semibold hover:bg-gray-700 transition"
          >
            {cat.category}
          </button>
        ))}
      </div>
    </div>
  );
}
