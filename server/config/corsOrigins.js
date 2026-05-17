/** Dev-friendly CORS origins (Vite may use 5174 if 5173 is taken). */
export const corsOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

export const corsOriginCheck = (origin, callback) => {
  if (!origin || corsOrigins.includes(origin)) {
    callback(null, true);
    return;
  }
  callback(new Error(`CORS blocked for origin: ${origin}`));
};
