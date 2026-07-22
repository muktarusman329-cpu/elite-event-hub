# Elite Event Hub

A premium event center booking website built with React, Tailwind CSS, node.js, Express, and Microsoft SQL Server.

## Features

- Elegant homepage with cinematic hero section
- Venue cards with capacity, price, location, features, availability, and booking actions
- Booking form, calendar view, invoice download, and chatbot support
- Admin dashboard for bookings, halls, payments, approvals, and analytics
- Authentication, protected admin routes, and Paystack payment integration
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
   - Backend: http://localhost:4001

5. Seed sample data (requires SQL Server running):

   ```bash
   npm run seed
   ```

## notes

- Replace `PAYSTACK_PUBLIC_KEY` and `PAYSTACK_SECRET_KEY` in `.env` with keys from your Paystack dashboard.
- The contact form and email reminders are scaffolded and can be extended with a real SMTP provider.
- Use the admin dashboard by signing in with admin credentials seeded in the backend.

## Paystack Test Payments

- Use Paystack test keys in development: `PAYSTACK_PUBLIC_KEY=pk_test_...` and `PAYSTACK_SECRET_KEY=sk_test_...`.
- The frontend opens Paystack Inline checkout for cards, bank transfer, USSD, and mobile money.
- Amounts are sent to Paystack in Kobo from the backend, then verified server-side before a booking is marked `Paid`.
- Configure your Paystack webhook URL as `https://your-domain.com/api/payments/webhook`.
- In local development, expose port `4001` with a tunnel such as ngrok and use `https://your-ngrok-url/api/payments/webhook`.

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
   - Click "new" → "Web Service"
   - Connect your GitHub repository: `muktarusman329-cpu/elite-event-hub`
   - Configure:
     - **name**: elite-event-hub
     - **Environment**: node
     - **Build Command**: `npm install && npm run build --workspace=client`
     - **Start Command**: `npm start --workspace=server`
     - **Plan**: Free or Starter

3. **Add Environment Variables in Render:**
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (and `DB_ENCRYPT` / `DB_TRUST_SERVER_CERT` as needed)
   - `JWT_SECRET`: A secure random string (generate with `openssl rand -hex 32`)
   - `SESSION_SECRET`: A secure random string for Google/session auth
   - `PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY`: Your Paystack test/live keys
   - `FRONTEND_URL`: Your Render app URL (e.g., `https://elite-event-hub.onrender.com`)
   - `API_BASE_URL` and `PUBLIC_URL`: Set both to the same Render app URL
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`: Used to create the first admin account on startup
   - Optional Google login: set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and add this callback URL in Google Cloud: `https://your-domain.com/api/auth/google/callback`
   - Optional SMTP: set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `FROM_EMAIL` for booking emails

4. **Deploy:**
   - Render will automatically build and deploy on push to `main` branch
   - Health check endpoint: `/api/health`
   - Uploaded hall images should use the persistent `server/uploads` disk configured in `render.yaml`

5. **Seed Production Database:**
   - Connect to your Render app shell
   - Run: `npm run seed --workspace=server`

## Admin Credentials

After seeding, use these to login to the admin dashboard:
- **Email**: `admin@eliteeventhub.com`
- **Password**: `AdminPass123` (or the value of `ADMIN_PASSWORD` in your `.env` when seeding)

(Change these in production in `server/utils/seed.js`)

