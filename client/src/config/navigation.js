export const mainnavItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/halls', label: 'Halls' },
  {
    label: 'Services',
    children: [
      { to: '/services', label: 'Event services' },
      { to: '/pricing', label: 'Packages & pricing' },
      { to: '/booking', label: 'Book a hall' },
    ],
  },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];
