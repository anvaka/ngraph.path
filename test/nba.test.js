import { describe, it, expect } from 'vitest';
import { nba } from '../index.js';
import createGraph from 'ngraph.graph';

describe('nba', () => {
  it('finds weighted paths', () => {
    const graph = createGraph();

    graph.addLink('a', 'b', { weight: 10 });
    graph.addLink('a', 'c', { weight: 10 });
    graph.addLink('c', 'd', { weight: 5 });
    graph.addLink('b', 'd', { weight: 10 });

    const pathFinder = nba(graph, {
      distance(_, __, link) {
        return link.data.weight;
      },
    });
    const path = pathFinder.find('a', 'd');

    expectPath(path, ['d', 'c', 'a']);
  });

  it('respects blocked links', () => {
    const graph = createGraph();

    graph.addLink('a', 'b', { blocked: true });
    graph.addLink('a', 'c', { blocked: false });
    graph.addLink('c', 'd', { blocked: false });
    graph.addLink('b', 'd', { blocked: false });

    const pathFinder = nba(graph, {
      blocked(_, __, link) {
        return link.data.blocked;
      },
    });
    const path = pathFinder.find('a', 'd');

    expectPath(path, ['d', 'c', 'a']);
  });

  it('supports oriented graphs', () => {
    const graph = createGraph();
    graph.addLink('a', 'b');
    graph.addLink('e', 'b');
    graph.addLink('a', 'c');
    graph.addLink('c', 'd');
    graph.addLink('d', 'e');

    const pathFinder = nba(graph, { oriented: true });
    const path = pathFinder.find('a', 'e');

    expectPath(path, ['e', 'd', 'c', 'a']);
  });
});

function expectPath(path, expectedIds) {
  expect(path.map((node) => node.id)).toEqual(expectedIds);
}
