import { randomBytes } from 'node:crypto';
import { LinkedListQueue } from './linked-list-queue.js';

// Helper: Generates an 8-character reference code like "A3F1B9C2"
function generateRef() {
  return randomBytes(4).toString('hex').toUpperCase();
}

export class Store {
  constructor() {
    this.events = new Map();       // Stores all events
    this.bookings = new Map();     // Stores bookings by reference code for instant O(1) lookup
    this.waitlists = new Map();    // Stores the waitlist line for each event tier
    this._nextEventId = 1;
    this._nextTierId = 1;
  }

  // 1. Create a new event
  createEvent(name, date) {
    const id = this._nextEventId++;
    const event = { id, name, date, tiers: new Map() };
    this.events.set(id, event);
    return event;
  }

  // 2. Add ticket tier (e.g. VIP, General Admission)
  addTier(eventId, tierName, priceKobo, capacity) {
    // Rule: Money must be a whole integer (kobo), never decimals
    if (!Number.isInteger(priceKobo) || priceKobo < 0) {
      throw new Error('priceKobo must be a non-negative integer');
    }
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new Error('capacity must be a positive integer');
    }

    const event = this.events.get(eventId);
    if (!event) throw new Error(`Event ${eventId} not found`);

    const id = this._nextTierId++;
    const tier = { id, name: tierName, priceKobo, capacity, sold: 0 };
    event.tiers.set(id, tier);
    return tier;
  }

  // 3. Book a ticket or join the waitlist if sold out
  book(eventId, tierId, attendeeName) {
    const event = this.events.get(eventId);
    if (!event) throw new Error(`Event ${eventId} not found`);

    const tier = event.tiers.get(tierId);
    if (!tier) throw new Error(`Tier ${tierId} not found`);

    // If sold out -> put person in the waitlist queue
    if (tier.sold >= tier.capacity) {
      const key = `${eventId}:${tierId}`;
      if (!this.waitlists.has(key)) {
        this.waitlists.set(key, new LinkedListQueue());
      }
      const queue = this.waitlists.get(key);
      queue.enqueue(attendeeName);
      return { status: 'waitlisted', position: queue.size };
    }

    // Otherwise -> confirm booking
    tier.sold++;
    const ref = generateRef();
    const booking = {
      ref,
      attendeeName,
      eventId,
      tierId,
      status: 'confirmed',
    };
    this.bookings.set(ref, booking);
    return { status: 'confirmed', booking };
  }

  // 4. Cancel a booking and promote the next person on the waitlist
  cancel(ref) {
    const booking = this.bookings.get(ref);
    if (!booking) throw new Error(`Booking ${ref} not found`);
    if (booking.status === 'cancelled') {
      throw new Error(`Booking ${ref} is already cancelled`);
    }

    booking.status = 'cancelled';

    const event = this.events.get(booking.eventId);
    const tier = event.tiers.get(booking.tierId);
    tier.sold--;

    // Check if anyone is waiting in line
    const key = `${booking.eventId}:${booking.tierId}`;
    const queue = this.waitlists.get(key);
    let promoted = null;

    if (queue && !queue.isEmpty()) {
      const nextPerson = queue.dequeue();
      tier.sold++;
      const newRef = generateRef();
      const newBooking = {
        ref: newRef,
        attendeeName: nextPerson,
        eventId: booking.eventId,
        tierId: booking.tierId,
        status: 'confirmed',
      };
      this.bookings.set(newRef, newBooking);
      promoted = newBooking;
    }

    return { cancelled: booking, promoted };
  }

  // 5. Look up a booking instantly by reference code (O(1))
  lookup(ref) {
    return this.bookings.get(ref) ?? null;
  }
}