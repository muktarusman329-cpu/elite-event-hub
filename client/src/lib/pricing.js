/**
 * Pure pricing calculation functions for Elite Event Hub.
 * These are used by both the BookingForm and PriceCalculator components.
 */

/**
 * Convert "HH:mm" time string to total minutes from midnight.
 * @param {string} t - e.g. "14:30"
 * @returns {number}
 */
export const timeToMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

/**
 * Calculate event duration in hours between two HH:mm strings.
 * @param {string} startTime - e.g. "10:00"
 * @param {string} endTime   - e.g. "16:00"
 * @returns {number} hours (decimal, e.g. 6.0 or 2.5)
 */
export const calcDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const diff = timeToMinutes(endTime) - timeToMinutes(startTime);
  return Math.max(0, diff / 60);
};

/**
 * Calculate the hourly surcharge.
 * @param {number} hourlyRate
 * @param {number} duration - hours
 * @returns {number}
 */
export const calcHourlyCharge = (hourlyRate, duration) =>
  Math.round((parseFloat(hourlyRate) || 0) * (parseFloat(duration) || 0));

/**
 * Calculate extra-guest surcharge.
 * @param {number} guests
 * @param {number} baseGuestCount - guests included in base price
 * @param {number} pricePerGuest
 * @returns {number}
 */
export const calcGuestCharge = (guests, baseGuestCount, pricePerGuest) => {
  const extra = Math.max(0, (parseInt(guests) || 0) - (parseInt(baseGuestCount) || 0));
  return extra * (parseFloat(pricePerGuest) || 0);
};

/**
 * Sum the prices of selected services.
 * Services can be objects { name, price } or just names (legacy).
 * @param {Array} selectedServices
 * @returns {number}
 */
export const calcServicesTotal = (selectedServices) => {
  if (!Array.isArray(selectedServices)) return 0;
  return selectedServices.reduce((sum, svc) => {
    if (typeof svc === 'object' && svc !== null) return sum + (parseFloat(svc.price) || 0);
    return sum;
  }, 0);
};

/**
 * Compute the complete price breakdown for a booking.
 * @param {object} hall  - hall record with price, hourlyRate, baseGuestCount, capacityPricePerGuest
 * @param {string} startTime
 * @param {string} endTime
 * @param {number} guests
 * @param {Array}  selectedServices  - array of { name, price } objects
 * @returns {{ basePrice, hourlyCharge, guestCharge, servicesTotal, duration, total }}
 */
export const calcTotal = (hall, startTime, endTime, guests, selectedServices = []) => {
  const basePrice = parseFloat(hall?.price) || 0;
  const duration = calcDuration(startTime, endTime);
  const hourlyCharge = calcHourlyCharge(hall?.hourlyRate, duration);
  const guestCharge = calcGuestCharge(guests, hall?.baseGuestCount, hall?.capacityPricePerGuest);
  const servicesTotal = calcServicesTotal(selectedServices);
  const total = basePrice + hourlyCharge + guestCharge + servicesTotal;

  return {
    basePrice,
    duration,
    hourlyCharge,
    guestCharge,
    servicesTotal,
    total,
  };
};

/**
 * Format a number as Nigerian Naira.
 * @param {number} amount
 * @returns {string}
 */
export const formatNaira = (amount) =>
  `₦${Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;

/**
 * Format duration hours to a readable string e.g. "3h 30m".
 * @param {number} hours
 * @returns {string}
 */
export const formatDuration = (hours) => {
  if (!hours || hours <= 0) return '—';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

/**
 * Generate an array of time slot strings (HH:mm) from startHour to endHour.
 * @param {number} startHour - inclusive, e.g. 8
 * @param {number} endHour   - exclusive, e.g. 23
 * @param {number} stepMinutes - e.g. 60 for 1-hour slots
 * @returns {string[]}
 */
export const generateTimeSlots = (startHour = 8, endHour = 23, stepMinutes = 60) => {
  const slots = [];
  for (let mins = startHour * 60; mins < endHour * 60; mins += stepMinutes) {
    const h = Math.floor(mins / 60).toString().padStart(2, '0');
    const m = (mins % 60).toString().padStart(2, '0');
    slots.push(`${h}:${m}`);
  }
  return slots;
};

/**
 * Check if a given time slot falls within any existing booking range.
 * @param {string} slot - "HH:mm"
 * @param {Array}  bookings - [{ startTime, endTime }]
 * @returns {boolean}
 */
export const isSlotTaken = (slot, bookings) => {
  const slotMins = timeToMinutes(slot);
  return bookings.some(({ startTime, endTime }) => {
    if (!startTime) return false;
    const start = timeToMinutes(startTime);
    const end = endTime ? timeToMinutes(endTime) : start + 60;
    return slotMins >= start && slotMins < end;
  });
};
