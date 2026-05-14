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

3. Create a `.env` file in `server` from `.env.example` and update values:

   ```bash
   cp server/.env.example server/.env
   ```

   Update the `DATABASE_URL` with your SQL Server connection string, e.g.:
   ```
   DATABASE_URL=Data Source=localhost;Integrated Security=True;Persist Security Info=False;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Application Name="SQL Server Management Studio";Command Timeout=0
   ```

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

- Replace `STRIPE_SECRET_KEY` in `server/.env` with your Stripe test key for payment integration.
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
   - `DATABASE_URL`: Your SQL Server connection string
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
- **Password**: `AdminPass123`

(Change these in production in `server/utils/seed.js`)

