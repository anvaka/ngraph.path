import { describe, it, expect } from 'vitest';
import NodeHeap from '../a-star/NodeHeap.js';

describe('NodeHeap', () => {
  it('adds and pops in order', () => {
    const heap = new NodeHeap();
    heap.push(3);
    heap.push(1);
    heap.push(5);

    let last = Number.NEGATIVE_INFINITY;
    while (heap.length) {
      const current = heap.pop();
      expect(last).toBeLessThanOrEqual(current);
      last = current;
    }
  });

  it('supports custom comparers', () => {
    const heap = new NodeHeap({
      compare: (a, b) => b - a,
    });

    heap.push(3);
    heap.push(1);
    heap.push(5);

    let last = Number.POSITIVE_INFINITY;
    while (heap.length) {
      const current = heap.pop();
      expect(current).toBeLessThanOrEqual(last);
      last = current;
    }
  });

  it('can be initialized with data array', () => {
    const input = [3, 1, 5];
    new NodeHeap(input);

    for (let i = 1; i < input.length; ++i) {
      expect(input[i - 1]).toBeLessThanOrEqual(input[i]);
    }
  });

  it('tracks node ids when provided', () => {
    const nodes = [{ v: 10 }];
    new NodeHeap(nodes, {
      setNodeId(node, id) {
        node.id = id;
      },
    });

    expect(nodes[0].id).toBe(0);
  });

  it('initializes ids for larger heaps', () => {
    const nodes = Array.from({ length: 13 }, () => ({ v: Math.random() * 100 }));
    const heap = new NodeHeap(nodes, {
      compare(a, b) {
        return a.v - b.v;
      },
      setNodeId(node, id) {
        node.id = id;
      },
    });

    nodes.forEach((node, idx) => {
      expect(node.id).toBe(idx);
    });

    let prev = { v: Number.NEGATIVE_INFINITY };
    while (heap.length) {
      const current = heap.pop();
      expect(prev.v).toBeLessThanOrEqual(current.v);
      prev = current;
    }
  });

  it('updates ids when popping', () => {
    const nodes = [{ v: 10 }, { v: 5 }];
    const heap = new NodeHeap(nodes, {
      compare(a, b) {
        return a.v - b.v;
      },
      setNodeId(node, id) {
        node.id = id;
      },
    });

    const popped = heap.pop();
    expect(popped.id).toBe(0);
    expect(heap.peek().id).toBe(0);
  });

  it('rebuilds heap when key changes', () => {
    const nodes = [{ v: 10 }, { v: 5 }, { v: 14 }];
    const heap = new NodeHeap(nodes, {
      compare(a, b) {
        return a.v - b.v;
      },
      setNodeId(node, id) {
        node.id = id;
      },
    });

    const lastItem = nodes[2];
    lastItem.v = 1;
    heap.updateItem(lastItem.id);

    expect(heap.peek().v).toBe(1);
    expect(heap.length).toBe(3);

    let prev = { v: Number.NEGATIVE_INFINITY };
    while (heap.length) {
      const current = heap.pop();
      expect(prev.v).toBeLessThanOrEqual(current.v);
      prev = current;
    }
  });
});
