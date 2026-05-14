import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] items-center justify-center px-6 py-16 sm:px-8 lg:px-12">
      <div className="glass-surface rounded-[2rem] border border-white/10 p-12 text-center shadow-glass">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Page not found</p>
        <h1 className="mt-4 text-5xl font-semibold text-white">404</h1>
        <p className="mt-4 max-w-xl text-slate-400">The page you are looking for cannot be found. Return to the homepage to continue browsing event halls and bookings.</p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-emerald-500 px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
