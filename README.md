# Elite Event Hub

A premium event center booking website built with React, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- Elegant homepage with cinematic hero section
- Venue cards with capacity, price, location, features, availability, and booking actions
- Booking form, calendar view, invoice download, and chatbot support
- Admin dashboard for bookings, halls, payments, approvals, and analytics
- Authentication, protected admin routes, and payment integration scaffolding
- Dark/light mode, filters, testimonials, gallery, pricing plans, and contact page

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` file in `server` from `.env.example`.

3. Start the app:

   ```bash
   npm run dev
   ```

4. Seed sample data:

   ```bash
   npm run seed
   ```

## Notes

- Replace `STRIPE_SECRET_KEY` in `server/.env` with your Stripe test key for payment integration.
- The contact form and email reminders are scaffolded and can be extended with a real SMTP provider.
- Use the admin dashboard by signing in with admin credentials seeded in the backend.
