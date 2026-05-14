import { useMemo, useState } from 'react';
import { halls } from '../data/halls';
import HallCard from '../components/HallCard';
import SearchFilter from '../components/SearchFilter';

function Venues() {
  const [category, setCategory] = useState('All');
  const [searchValue, setSearchValue] = useState('');

  const filteredHalls = useMemo(() => {
    return halls.filter((hall) => {
      const matchesCategory = category === 'All' || hall.category === category;
      const matchesSearch = [hall.name, hall.location, ...hall.features]
        .join(' ')
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, searchValue]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="mb-12 space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Venue collection</p>
        <h1 className="text-4xl font-semibold text-white">Elegant spaces built for unforgettable experiences.</h1>
        <p className="max-w-2xl text-slate-400">Search by capacity, event type, and availability to find the perfect premium venue for your celebration.</p>
      </div>

      <SearchFilter
        halls={halls}
        category={category}
        onCategoryChange={setCategory}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {filteredHalls.map((hall) => (
          <HallCard key={hall.id} hall={hall} />
        ))}
        {filteredHalls.length === 0 && (
          <div className="glass-surface rounded-[2rem] border border-white/10 p-12 text-center text-slate-300">
            <p className="text-xl text-white">No halls match your search.</p>
            <p className="mt-3">Try a different keyword or select another event category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Venues;
