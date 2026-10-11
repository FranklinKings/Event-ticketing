import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Store } from '../src/domain.js';

describe('Store Domain Core', () => {
  // 1. Check creating events and ticket tiers
  it('creates an event and tier with integer price', () => {
    const store = new Store();
    const event = store.createEvent('Tech Fest 2025', '2025-10-15');
    const tier = store.addTier(event.id, 'VIP', 10000, 2); // 10,000 kobo (₦100.00), 2 seats

    assert.equal(tier.name, 'VIP');
    assert.equal(tier.priceKobo, 10000);
    assert.equal(tier.capacity, 2);
    assert.equal(tier.sold, 0);
  });

  // 2. Reject decimal prices (must be whole kobo)
  it('rejects invalid prices and capacities', () => {
    const store = new Store();
    const event = store.createEvent('Tech Fest 2025', '2025-10-15');

    // Reject decimal money
    assert.throws(() => store.addTier(event.id, 'VIP', 50.5, 10), /priceKobo must be a non-negative integer/);
    // Reject zero or negative capacity
    assert.throws(() => store.addTier(event.id, 'VIP', 5000, 0), /capacity must be a positive integer/);
  });

  // 3. Check booking and fast lookup
  it('books a seat and looks up by reference code', () => {
    const store = new Store();
    const event = store.createEvent('Tech Fest 2025', '2025-10-15');
    const tier = store.addTier(event.id, 'Regular', 5000, 2);

    const result = store.book(event.id, tier.id, 'Alice');
    assert.equal(result.status, 'confirmed');
    assert.ok(result.booking.ref);

    // Look up the booking
    const found = store.lookup(result.booking.ref);
    assert.equal(found.attendeeName, 'Alice');
    assert.equal(found.status, 'confirmed');
  });

  // 4. Check waitlist when sold out
  it('places attendee on waitlist when capacity is reached', () => {
    const store = new Store();
    const event = store.createEvent('Tech Fest 2025', '2025-10-15');
    const tier = store.addTier(event.id, 'Regular', 5000, 1); // only 1 seat!

    const r1 = store.book(event.id, tier.id, 'Alice'); // Gets the 1 seat
    assert.equal(r1.status, 'confirmed');

    const r2 = store.book(event.id, tier.id, 'Bob'); // Should be waitlisted
    assert.equal(r2.status, 'waitlisted');
    assert.equal(r2.position, 1);
  });

  // 5. Check promotion on cancellation
  it('promotes next person in line when a ticket is cancelled', () => {
    const store = new Store();
    const event = store.createEvent('Tech Fest 2025', '2025-10-15');
    const tier = store.addTier(event.id, 'Regular', 5000, 1);

    const r1 = store.book(event.id, tier.id, 'Alice');
    store.book(event.id, tier.id, 'Bob'); // Bob is on waitlist

    // Alice cancels
    const { cancelled, promoted } = store.cancel(r1.booking.ref);
    assert.equal(cancelled.status, 'cancelled');
    assert.ok(promoted);
    assert.equal(promoted.attendeeName, 'Bob');
    assert.equal(promoted.status, 'confirmed');
  });

  // 6. Prevent double cancellation
  it('rejects double cancellation of the same booking', () => {
    const store = new Store();
    const event = store.createEvent('Tech Fest 2025', '2025-10-15');
    const tier = store.addTier(event.id, 'Regular', 5000, 1);

    const r1 = store.book(event.id, tier.id, 'Alice');
    store.cancel(r1.booking.ref);

    // Trying to cancel again should throw an error
    assert.throws(() => store.cancel(r1.booking.ref), /already cancelled/);
  });
});