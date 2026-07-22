import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, Check } from 'lucide-react';
import Button from '../ui/Button';

const AMENITIES_LIST = [
  'Catering',
  'Air Conditioning',
  'Parking',
  'Sound System',
  'WiFi',
  'Stage',
  'Changing Room',
  'Security',
];

const SORT_OPTIONS = [
  { label: 'Featured', value: 'All' },
  { label: 'Price: Low to High', value: 'priceAsc' },
  { label: 'Price: High to Low', value: 'priceDesc' },
  { label: 'Capacity: High to Low', value: 'capacityDesc' },
  { label: 'Popularity (Rating)', value: 'ratingDesc' },
];

function HallsToolbar({
  searchValue,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  statusFilter,
  onStatusFilterChange,
  
  // Advanced filters props
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  minCapacity,
  onMinCapacityChange,
  selectedAmenities = [],
  onAmenitiesChange,
  sortBy,
  onSortChange,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      onAmenitiesChange?.(selectedAmenities.filter((a) => a !== amenity));
    } else {
      onAmenitiesChange?.([...selectedAmenities, amenity]);
    }
  };

  const handleClearFilters = () => {
    onMinPriceChange?.(0);
    onMaxPriceChange?.(500000);
    onMinCapacityChange?.(0);
    onAmenitiesChange?.([]);
    onSortChange?.('All');
    onCategoryChange?.('All');
    onStatusFilterChange?.('All');
    onSearchChange?.('');
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#070b19]/60 backdrop-blur-xl p-5 shadow-xl text-left space-y-4">
      
      {/* Primary Toolbar */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto] items-end">
        {/* Search */}
        <div className="space-y-1.5">
          <label htmlFor="hall-search" className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Search halls
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="hall-search"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, location, features..."
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label htmlFor="hall-category" className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Category
          </label>
          <select
            id="hall-category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full min-w-[170px] rounded-xl border border-white/10 bg-slate-900/60 py-3 px-4 text-sm text-slate-200 outline-none focus:border-emerald-500/50 cursor-pointer appearance-none"
          >
            {categories.map((option) => (
              <option key={option} value={option} className="bg-slate-950 text-slate-200">
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label htmlFor="hall-status" className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Availability
          </label>
          <select
            id="hall-status"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full min-w-[170px] rounded-xl border border-white/10 bg-slate-900/60 py-3 px-4 text-sm text-slate-200 outline-none focus:border-emerald-500/50 cursor-pointer appearance-none"
          >
            <option value="All" className="bg-slate-950 text-slate-200">All Statuses</option>
            <option value="Available" className="bg-slate-950 text-slate-200">Available</option>
            <option value="Few Slots Left" className="bg-slate-950 text-slate-200">Few slots left</option>
            <option value="Fully Booked" className="bg-slate-950 text-slate-200">Fully booked</option>
          </select>
        </div>

        {/* Advanced toggle button */}
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`h-[46px] rounded-xl border border-white/10 px-4 flex items-center justify-center gap-2 text-sm font-semibold transition ${
              showAdvanced
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-900/40 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
          {(minPrice > 0 || maxPrice < 500000 || minCapacity > 0 || selectedAmenities.length > 0 || category !== 'All' || statusFilter !== 'All' || searchValue !== '') && (
            <Button
              type="button"
              onClick={handleClearFilters}
              className="h-[46px] rounded-xl border border-white/5 bg-slate-900/20 px-3.5 text-xs font-semibold text-slate-500 hover:bg-slate-900/60 hover:text-slate-300"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer */}
      {showAdvanced && (
        <div className="border-t border-white/5 pt-6 mt-4 grid gap-6 md:grid-cols-3 animate-slide-down">
          {/* Price Range */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Price Range (₦)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase text-slate-500 tracking-wider">Min Price</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => onMinPriceChange?.(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 px-3 text-xs text-slate-200 outline-none focus:border-emerald-500/45"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-slate-500 tracking-wider">Max Price</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => onMaxPriceChange?.(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 px-3 text-xs text-slate-200 outline-none focus:border-emerald-500/45"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="500000"
              step="5000"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange?.(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 mt-2"
            />
          </div>

          {/* Min Capacity & Sorting */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Min Capacity (guests)</label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={minCapacity || ''}
                onChange={(e) => onMinCapacityChange?.(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 px-3 text-xs text-slate-200 outline-none focus:border-emerald-500/45"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange?.(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-2.5 px-3 text-xs text-slate-200 outline-none focus:border-emerald-500/45 cursor-pointer appearance-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-950 text-slate-200">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amenities checklist */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Amenities Available</p>
            <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-2 scrollbar-thin">
              {AMENITIES_LIST.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold border transition ${
                      checked
                        ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
                        : 'border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/10 hover:text-slate-300'
                    }`}
                  >
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      checked ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {checked && <Check className="h-3 w-3 stroke-[3]" />}
                    </span>
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HallsToolbar;
