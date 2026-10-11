import { Store } from './src/domain.js';

const store = new Store();

console.log('====================================================');
console.log('       🎟️  EVENT TICKETING PLATFORM DEMO  🎟️        ');
console.log('====================================================\n');

// 1. Create an Event
const event = store.createEvent('Lagos Tech Summit 2025', '2025-11-20');
console.log(`1. 📅 Created Event: "${event.name}" on ${event.date}`);

// 2. Add a Ticket Tier with capacity = 3
// 5000 kobo = ₦50.00
const tier = store.addTier(event.id, 'Early Bird', 5000, 3);
console.log(`2. 🏷️  Added Tier: "${tier.name}" — Price: ${tier.priceKobo} kobo (₦50.00), Capacity: ${tier.capacity} seats\n`);

// 3. Three attendees book tickets (This fills up the event!)
console.log('3. 👥 Attendees booking tickets:');
const attendees = ['Alice', 'Bob', 'Charlie'];
const bookings = [];

for (const name of attendees) {
  const res = store.book(event.id, tier.id, name);
  bookings.push(res.booking);
  console.log(`   ✅ ${name} booked! Ref Code: [${res.booking.ref}]`);
}

console.log(`\n   🚨 STATUS: Tier "${tier.name}" is now 100% SOLD OUT (3/3 seats).\n`);

// 4. Two more people try to book -> They get placed on the Waitlist!
console.log('4. ⏳ Late attendees try to book:');
for (const name of ['Dave', 'Eve']) {
  const res = store.book(event.id, tier.id, name);
  console.log(`   ⛔ ${name} could not book immediately. Added to WAITLIST (Position #${res.position})`);
}
console.log();

// 5. Bob decides to cancel his ticket!
const bobBooking = bookings[1]; // Bob's booking
console.log(`5. 🔄 Bob decides to cancel his booking [${bobBooking.ref}]...`);

const { cancelled, promoted } = store.cancel(bobBooking.ref);
console.log(`   ❌ Bob's booking [${cancelled.ref}] has been CANCELLED.`);

// 6. Dave (who was #1 in line) is automatically promoted!
if (promoted) {
  console.log(`   🎉 AUTO-PROMOTION: ${promoted.attendeeName} got the seat! New Ref Code: [${promoted.ref}]`);
}
console.log();

// 7. Lookup Dave's new booking instantly (O(1) lookup)
console.log(`6. 🔍 Fast Lookup by Reference Code [${promoted.ref}]:`);
const lookupResult = store.lookup(promoted.ref);
console.log(`   Found: ${lookupResult.attendeeName} | Status: ${lookupResult.status} | Event: "${event.name}"`);

console.log('\n====================================================');
console.log('                 ✅ DEMO COMPLETE!                  ');
console.log('====================================================');