import { useMemo } from 'react';

function SearchFilter({ halls, category, onCategoryChange, searchValue, onSearchChange }) {
  const categories = useMemo(() => ['All', ...Array.from(new Set(halls.map((item) => item.category)))], [halls]);

  return (
    <div className="glass-surface rounded-3xl border border-white/10 p-5 shadow-glass">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-300">Search event hall</label>
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
            placeholder="Search by name, location, or feature"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-300">Filter by category</label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
          >
            {categories.map((option) => (
              <option key={option} value={option} className="bg-slate-950 text-slate-100">
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;
