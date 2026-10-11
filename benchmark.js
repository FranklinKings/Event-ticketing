import { performance } from 'node:perf_hooks';

const COUNT = 100_000;
const targetRef = `REF-${COUNT - 1}`; // The very last booking in the collection

console.log('====================================================');
console.log(`  ⏱️  BENCHMARK: Map.get vs Array.find (${COUNT.toLocaleString()} items)`);
console.log('====================================================\n');

// 1. Prepare data in both an Array and a Map
const arrayData = [];
const mapData = new Map();

for (let i = 0; i < COUNT; i++) {
  const item = { ref: `REF-${i}`, attendeeName: `Attendee ${i}` };
  arrayData.push(item);
  mapData.set(item.ref, item);
}

// 2. Measure Array.find (O(n) - scans item by item)
const startArray = performance.now();
const foundInArray = arrayData.find((b) => b.ref === targetRef);
const endArray = performance.now();
const arrayTimeMs = (endArray - startArray).toFixed(4);

// 3. Measure Map.get (O(1) - instant hash jump)
const startMap = performance.now();
const foundInMap = mapData.get(targetRef);
const endMap = performance.now();
const mapTimeMs = (endMap - startMap).toFixed(4);

// 4. Print results
console.log(`🎯 Searching for booking: "${targetRef}"\n`);
console.log(`🐢 Array.find (O(n)) : ${arrayTimeMs} ms  [Linear scan through entire list]`);
console.log(`⚡ Map.get    (O(1)) : ${mapTimeMs} ms  [Instant hash table lookup]`);

const speedMultiplier = (parseFloat(arrayTimeMs) / Math.max(parseFloat(mapTimeMs), 0.0001)).toFixed(0);
console.log(`\n🚀 Map is approximately ${speedMultiplier}x FASTER than Array!\n`);

console.log('----------------------------------------------------');
console.log('📖 BIG O EXPLANATION:');
console.log('----------------------------------------------------');
console.log('• Array.find is O(n) because it checks elements one by one from');
console.log('  start to end until it finds a match. Searching 100,000 items');
console.log('  takes ~100,000 checks in the worst case.');
console.log();
console.log('• Map.get is O(1) because it uses a hash table to jump directly');
console.log('  to the memory address of the key, requiring only 1 lookup step');
console.log('  regardless of how many items are stored.');
console.log('====================================================\n');