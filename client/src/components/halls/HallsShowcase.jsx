import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { normalizeHall } from '../../lib/normalizeHall';
import { showcaseHalls } from '../../data/halls';
import HallCard from '../HallCard';
import HallCardSkeleton from './HallCardSkeleton';
import HallsToolbar from './HallsToolbar';

function HallsShowcase({
  title = 'Premium event halls',
  subtitle = 'Discover world-class venues with real-time availability, transparent pricing, and instant booking.',
  limit,
  className = '',
}) {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get('/halls')
      .then((r) => {
        const list = (r.data.halls || []).map(normalizeHall).filter(Boolean);
        setHalls(list.length ? list : showcaseHalls.map(normalizeHall));
      })
      .catch(() => setHalls(showcaseHalls.map(normalizeHall)))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(halls.map((h) => h.category).filter(Boolean)))],
    [halls]
  );

  const filtered = useMemo(() => {
    let list = halls.filter((hall) => {
      const matchCat = category === 'All' || hall.category === category;
      const matchStatus = statusFilter === 'All' || hall.status === statusFilter;
      const matchSearch = [hall.name, hall.location, hall.description, ...(hall.features || [])]
        .join(' ')
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      return matchCat && matchStatus && matchSearch;
    });
    if (limit) list = list.slice(0, limit);
    return list;
  }, [halls, category, statusFilter, searchValue, limit]);

  return (
    <section className={`bg-slate-50/80 py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Venue catalog</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">{subtitle}</p>
        </motion.div>

        {limit ? (
          <div className="mb-8 flex justify-end">
            <Link
              to="/halls"
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all halls →
            </Link>
          </div>
        ) : (
          <div className="mb-8">
            <HallsToolbar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              category={category}
              onCategoryChange={setCategory}
              categories={categories}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {loading &&
            Array.from({ length: limit || 6 }).map((_, i) => <HallCardSkeleton key={i} />)}
          {!loading &&
            filtered.map((hall, index) => <HallCard key={hall.id} hall={hall} index={index} />)}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-lg font-semibold text-slate-900">No halls match your filters</p>
            <p className="mt-2 text-sm text-slate-500">Try adjusting search or availability filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default HallsShowcase;
