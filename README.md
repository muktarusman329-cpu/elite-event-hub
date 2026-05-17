# Elite Event Hub

A premium event center booking website built with React, Tailwind CSS, Node.js, Express, and Microsoft SQL Server.

## Features

- Elegant homepage with cinematic hero section
- Venue cards with capacity, price, location, features, availability, and booking actions
- Booking form, calendar view, invoice download, and chatbot support
- Admin dashboard for bookings, halls, payments, approvals, and analytics
- Authentication, protected admin routes, and payment integration scaffolding
- Dark/light mode, filters, testimonials, gallery, pricing plans, and contact page

## Setup

1. Install SQL Server and configure a local or hosted database instance.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file from `.env.example` and set your SQL Server variables (the backend reads `DB_*`, not `DATABASE_URL`):

   ```bash
   cp .env.example .env
   ```

   Example (SQL authentication):
   ```
   DB_HOST=localhost
   DB_PORT=1433
   DB_NAME=myfirstdb
   DB_USER=sa
   DB_PASSWORD=your_sql_password_here
   DB_ENCRYPT=true
   DB_TRUST_SERVER_CERT=true
   ```

   For Windows Integrated Security, set `DB_USE_INTEGRATED_AUTH=true` and omit `DB_USER` / `DB_PASSWORD`.

4. Start the app:

   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000

5. Seed sample data (requires SQL Server running):

   ```bash
   npm run seed
   ```

## Notes

- Replace `STRIPE_SECRET_KEY` in `.env` with your Stripe test key for payment integration.
- The contact form and email reminders are scaffolded and can be extended with a real SMTP provider.
- Use the admin dashboard by signing in with admin credentials seeded in the backend.

## Deployment on Render

### Prerequisites
- SQL Server instance or managed SQL Server database
- Render account
- GitHub repository (already set up)

### Steps

1. **Create or connect to a SQL Server instance:**
   - Use a local SQL Server installation or a managed SQL Server service.
   - Make sure the instance is reachable from Render if deploying remotely.

2. **Deploy to Render:**
   - Go to [Render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository: `muktarusman329-cpu/elite-event-hub`
   - Configure:
     - **Name**: elite-event-hub
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build --workspace=client`
     - **Start Command**: `npm start --workspace=server`
     - **Plan**: Free or Starter

3. **Add Environment Variables in Render:**
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (and `DB_ENCRYPT` / `DB_TRUST_SERVER_CERT` as needed)
   - `JWT_SECRET`: A secure random string (generate with `openssl rand -hex 32`)
   - `STRIPE_SECRET_KEY`: Your Stripe test/live key
   - `FRONTEND_URL`: Your Render app URL (e.g., `https://elite-event-hub.onrender.com`)

4. **Deploy:**
   - Render will automatically build and deploy on push to `main` branch

5. **Seed Production Database:**
   - Connect to your Render app shell
   - Run: `npm run seed --workspace=server`

## Admin Credentials

After seeding, use these to login to the admin dashboard:
- **Email**: `admin@eliteeventhub.com`
- **Password**: `AdminPass123` (or the value of `ADMIN_PASSWORD` in your `.env` when seeding)

(Change these in production in `server/utils/seed.js`)

