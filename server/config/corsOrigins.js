export const getCorsOrigins = () => {
  const envOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  /** Dev-friendly CORS origins (Vite may use 5174 if 5173 is taken). */
  return [
    process.env.FRONTEND_URL,
    process.env.RENDER_EXTERNAL_URL,
    ...envOrigins,
    'http://localhost:5173',
    'http://localhost:5174',
  ].filter(Boolean);
};

export const corsOrigins = getCorsOrigins();

export const corsOriginCheck = (origin, callback) => {
  if (!origin || getCorsOrigins().includes(origin)) {
    callback(null, true);
    return;
  }
  callback(new Error(`CORS blocked for origin: ${origin}`));
};
