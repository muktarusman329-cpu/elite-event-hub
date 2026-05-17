import { Search, SlidersHorizontal } from 'lucide-react';

function HallsToolbar({
  searchValue,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  statusFilter,
  onStatusFilterChange,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-end">
        <div>
          <label htmlFor="hall-search" className="mb-2 block text-sm font-medium text-slate-700">
            Search halls
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="hall-search"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, city, or feature…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="hall-category" className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              id="hall-category"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full min-w-[160px] appearance-none rounded-xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-8 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 lg:w-auto"
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="hall-status" className="mb-2 block text-sm font-medium text-slate-700">
            Availability
          </label>
          <select
            id="hall-status"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full min-w-[160px] rounded-xl border border-slate-200 bg-slate-50/80 py-3 px-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 lg:w-auto"
          >
            <option value="All">All statuses</option>
            <option value="Available">Available</option>
            <option value="Few Slots Left">Few slots left</option>
            <option value="Fully Booked">Fully booked</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default HallsToolbar;
