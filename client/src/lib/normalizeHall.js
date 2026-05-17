const STATUS_MAP = {
  Available: 'Available',
  Limited: 'Few Slots Left',
  Booked: 'Fully Booked',
  'Few Slots Left': 'Few Slots Left',
  'Fully Booked': 'Fully Booked',
};

export function normalizeHall(hall) {
  if (!hall) return null;
  const status = STATUS_MAP[hall.status] || hall.status || 'Available';
  return {
    ...hall,
    id: hall.id,
    name: hall.name,
    location: hall.location || 'Premium district',
    capacity: hall.capacity ?? 100,
    price: Number(hall.price) || 0,
    image:
      hall.image ||
      'https://images.unsplash.com/photo-1519167758481-83f29da8c8a2?auto=format&fit=crop&w=1200&q=80',
    category: hall.category || 'Events',
    features: Array.isArray(hall.features) ? hall.features : [],
    status,
    rating: hall.rating ?? 4.5 + (Number(hall.id) % 5) * 0.1,
    description:
      hall.description ||
      `Elegant ${hall.category?.toLowerCase() || 'event'} venue with professional staff, flexible layouts, and premium amenities.`,
  };
}

export function statusStyles(status) {
  switch (status) {
    case 'Fully Booked':
      return 'bg-rose-50 text-rose-700 ring-rose-100';
    case 'Few Slots Left':
      return 'bg-amber-50 text-amber-700 ring-amber-100';
    default:
      return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
  }
}
