import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import api from '../../lib/axios';
import { normalizeHall } from '../../lib/normalizeHall';
import { showcaseHalls } from '../../data/halls';

import HallCard from '../HallCard';
import HallCardSkeleton from './HallCardSkeleton';
import HallsToolbar from './HallsToolbar';

function HallsShowcase({
  title = 'Premium luxury event halls',
  subtitle = 'Discover world-class venues with real-time availability, transparent pricing, and instant booking.',
  limit,
  className = '',
}) {
  const [searchParams] = useSearchParams();
  
  // Read initial search query parameters if redirected from homepage search bar
  const querySearch = searchParams.get('search') || '';
  const queryCategory = searchParams.get('category') || 'All';
  const queryCapacity = searchParams.get('capacity') || '';

  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [category, setCategory] = useState(queryCategory);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchValue, setSearchValue] = useState(querySearch);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minCapacity, setMinCapacity] = useState(queryCapacity ? Number(queryCapacity) : 0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('All');

  useEffect(() => {
    const loadHalls = async () => {
      try {
        setLoading(true);
        const response = await api.get('/halls');
        const incoming = response.data?.halls || [];

        const list = incoming
          .map((hall) => {
            const normalized = normalizeHall(hall);
            return {
              ...normalized,
              features: normalized?.features || [],
              category: normalized?.category || 'Event Hall',
              status: normalized?.status || 'Available',
              capacity: normalized?.capacity || 0,
              price: normalized?.price || 0,
              hourlyRate: normalized?.hourlyRate || 0,
            };
          })
          .filter(Boolean);

        if (list.length > 0) {
          setHalls(list);
        } else {
          setHalls(showcaseHalls.map((hall) => normalizeHall(hall)));
        }
      } catch (error) {
        console.error(error);
        setHalls(showcaseHalls.map((hall) => normalizeHall(hall)));
      } finally {
        setLoading(false);
      }
    };

    loadHalls();
  }, []);

  // Sync state if search params change
  useEffect(() => {
    if (querySearch) setSearchValue(querySearch);
    if (queryCategory) setCategory(queryCategory);
    if (queryCapacity) setMinCapacity(Number(queryCapacity));
  }, [querySearch, queryCategory, queryCapacity]);

  const categories = useMemo(() => {
    return [
      'All',
      ...Array.from(
        new Set(
          halls
            .map((hall) => hall.category)
            .filter(Boolean)
        )
      ),
    ];
  }, [halls]);

  const filtered = useMemo(() => {
    let list = halls.filter((hall) => {
      const matchCategory =
        category === 'All' ||
        hall.category === category;

      const matchStatus =
        statusFilter === 'All' ||
        hall.status === statusFilter;

      // Price filter
      const matchPrice = hall.price >= minPrice && hall.price <= maxPrice;

      // Capacity filter
      const matchCap = hall.capacity >= minCapacity;

      // Amenities filter (must contain all selected amenities)
      const matchAmenities = selectedAmenities.every((amenity) =>
        (hall.features || []).some(
          (feat) => feat.toLowerCase().includes(amenity.toLowerCase())
        )
      );

      const searchText = [
        hall.name,
        hall.location,
        hall.description,
        ...(hall.features || []),
      ]
        .join(' ')
        .toLowerCase();

      const matchSearch = searchText.includes(
        searchValue.toLowerCase()
      );

      return (
        matchCategory &&
        matchStatus &&
        matchPrice &&
        matchCap &&
        matchAmenities &&
        matchSearch
      );
    });

    // Sorting
    if (sortBy === 'priceAsc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'capacityDesc') {
      list = [...list].sort((a, b) => b.capacity - a.capacity);
    } else if (sortBy === 'ratingDesc') {
      list = [...list].sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    }

    if (limit) {
      list = list.slice(0, limit);
    }

    return list;
  }, [
    halls,
    category,
    statusFilter,
    searchValue,
    minPrice,
    maxPrice,
    minCapacity,
    selectedAmenities,
    sortBy,
    limit,
  ]);

  return (
    <section className={`py-16 sm:py-20 bg-transparent ${className}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        {!limit && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 max-w-2xl text-left"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
              Venue Catalog
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {subtitle}
            </p>
          </motion.div>
        )}

        {/* Toolbar */}
        {limit ? (
          <div className="mb-8 flex justify-end">
            <Link
              to="/halls"
              className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              View all halls <span className="text-xs">→</span>
            </Link>
          </div>
        ) : (
          <div className="mb-10">
            <HallsToolbar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              category={category}
              onCategoryChange={setCategory}
              categories={categories}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              minPrice={minPrice}
              onMinPriceChange={setMinPrice}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              minCapacity={minCapacity}
              onMinCapacityChange={setMinCapacity}
              selectedAmenities={selectedAmenities}
              onAmenitiesChange={setSelectedAmenities}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        )}

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {loading &&
            Array.from({
              length: limit || 6,
            }).map((_, index) => (
              <HallCardSkeleton key={index} />
            ))}

          {!loading &&
            filtered.map((hall, index) => (
              <HallCard
                key={hall.id || index}
                hall={hall}
                index={index}
              />
            ))}
        </div>

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-12 text-center shadow-xl">
            <p className="text-lg font-bold text-white">
              No halls match your search filters
            </p>
            <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">
              Try adjusting your price range, capacity sliders, or select fewer custom amenities.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default HallsShowcase;