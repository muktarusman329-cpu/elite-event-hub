import { Booking } from '../models/Booking.js';

/**
 * Middleware to protect guest routes.
 * Expects token in either `x-guest-token` header or `token` query param.
 * Verifies token exists, matches a booking, and is not expired.
 */
export const guestAuth = async (req, res, next) => {
  try {
    const token = req.headers['x-guest-token'] || req.query.token;
    if (!token) return res.status(401).json({ message: 'Guest token required.' });
    const booking = await Booking.findOne({ where: { guestToken: token } });
    if (!booking) return res.status(404).json({ message: 'Invalid guest token.' });
    if (booking.guestTokenExpiresAt && new Date() > booking.guestTokenExpiresAt) {
      return res.status(401).json({ message: 'Guest token expired.' });
    }
    // attach booking to request for downstream handlers
    req.guestBooking = booking;
    next();
  } catch (err) {
    next(err);
  }
};
