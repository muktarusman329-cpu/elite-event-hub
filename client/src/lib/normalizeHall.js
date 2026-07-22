const STATUS_MAP = {
  Available: 'Available',
  Limited: 'Few Slots Left',
  Booked: 'Fully Booked',
  'Few Slots Left': 'Few Slots Left',
  'Fully Booked': 'Fully Booked',
};

const FALLBACK_IMAGE =
'https://res.cloudinary.com/dpintbnfc/image/upload/v1780585846/pexels-simeart-30311728_ywbpxr.jpg';

export function normalizeHall(hall) {
if (!hall) return null;

const status =
STATUS_MAP[hall.status] ||
hall.status ||
'Available';

return {
...hall,

// BASIC
id: Number(hall.id),
name: hall.name || 'Premium Event Hall',

location:
  hall.location ||
  'Premium district',

category:
  hall.category ||
  'Events',

status,

// PRICING
price:
  Number(hall.price) || 0,

hourlyRate:
  Number(hall.hourlyRate) || 0,

capacityPricePerGuest:
  Number(
    hall.capacityPricePerGuest
  ) || 0,

baseGuestCount:
  Number(
    hall.baseGuestCount
  ) || 0,

// CAPACITY
capacity:
  Number(hall.capacity) || 100,

// IMAGE
image:
  typeof hall.image === 'string' &&
  hall.image.trim() !== ''
    ? hall.image
    : FALLBACK_IMAGE,

// FEATURES
features: Array.isArray(
  hall.features
)
  ? hall.features
  : [],

// RATING
rating:
  Number(hall.rating) ||
  4.5,

// DESCRIPTION
description:
  hall.description ||
  `Elegant ${
    hall.category?.toLowerCase() ||
    'event'
  } venue with premium decoration, modern facilities, secure parking, professional staff, and luxury event experience.`,

// SMART PRICING INFO
smartPricing: true,

// SERVICES
availableServices: [
  {
    name: 'Premium Catering',
    price: 150000,
  },
  {
    name: 'Photography',
    price: 80000,
  },
  {
    name: 'Live Streaming',
    price: 120000,
  },
  {
    name: 'AV Support',
    price: 50000,
  },
  {
    name: 'Light Design',
    price: 70000,
  },
],


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
