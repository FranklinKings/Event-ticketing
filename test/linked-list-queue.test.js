import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LinkedListQueue } from '../src/linked-list-queue.js';

describe('LinkedListQueue', () => {
  // Test 1: A fresh queue should be completely empty
  it('starts empty', () => {
    const q = new LinkedListQueue();
    assert.equal(q.isEmpty(), true);
    assert.equal(q.size, 0);
    assert.equal(q.dequeue(), null);
  });

  // Test 2: First person in must be the first person out (FIFO)
  it('enqueues and dequeues in FIFO order', () => {
    const q = new LinkedListQueue();
    q.enqueue('Alice');
    q.enqueue('Bob');
    q.enqueue('Charlie');

    assert.equal(q.size, 3);
    assert.equal(q.dequeue(), 'Alice');   // Alice was first, so she leaves first
    assert.equal(q.dequeue(), 'Bob');     // Bob was second
    assert.equal(q.dequeue(), 'Charlie'); // Charlie was third
    assert.equal(q.dequeue(), null);      // Line is now empty
    assert.equal(q.isEmpty(), true);
  });

  // Test 3: Looking at the front shouldn't remove anyone
  it('peek returns head without removing', () => {
    const q = new LinkedListQueue();
    q.enqueue('Dave');
    assert.equal(q.peek(), 'Dave');
    assert.equal(q.size, 1); // Dave is still in line!
  });
});