import { describe, it, expect } from 'vitest';
import { aStar, aGreedy } from '../index.js';
import createGraph from 'ngraph.graph';
import { graphFromTextArray, graphToTextGrid } from './utils/graphFromAscii.js';

describe('aStar family', () => {
  it('finds weighted paths', () => {
    const graph = createGraph();

    graph.addLink('a', 'b', { weight: 10 });
    graph.addLink('a', 'c', { weight: 10 });
    graph.addLink('c', 'd', { weight: 5 });
    graph.addLink('b', 'd', { weight: 10 });

    const pathFinder = aStar(graph, {
      distance(_, __, link) {
        return link.data.weight;
      },
    });
    const path = pathFinder.find('a', 'd');

    expectPath(path, ['d', 'c', 'a']);
  });

  it('respects blocked links for aStar', () => {
    const graph = createGraph();

    graph.addLink('a', 'b', { blocked: true });
    graph.addLink('a', 'c', { blocked: false });
    graph.addLink('c', 'd', { blocked: false });
    graph.addLink('b', 'd', { blocked: false });

    const pathFinder = aStar(graph, {
      blocked(_, __, link) {
        return link.data.blocked;
      },
    });
    const path = pathFinder.find('a', 'd');

    expectPath(path, ['d', 'c', 'a']);
  });

  it('respects blocked links for aGreedy', () => {
    const graph = createGraph();

    graph.addLink('a', 'b', { blocked: true });
    graph.addLink('a', 'c', { blocked: false });
    graph.addLink('c', 'd', { blocked: false });
    graph.addLink('b', 'd', { blocked: false });

    const pathFinder = aGreedy(graph, {
      blocked(_, __, link) {
        return link.data.blocked;
      },
    });
    const path = pathFinder.find('a', 'd');

    expectPath([...path].reverse(), ['d', 'c', 'a']);
  });

  it('finds directed paths with aStar', () => {
    const graph = createGraph();
    graph.addLink('a', 'b');
    graph.addLink('e', 'b');
    graph.addLink('a', 'c');
    graph.addLink('c', 'd');
    graph.addLink('d', 'e');

    const pathFinder = aStar(graph, { oriented: true });
    const path = pathFinder.find('a', 'e');

    expectPath(path, ['e', 'd', 'c', 'a']);
  });

  it('finds directed paths with aGreedy', () => {
    const graph = createGraph();
    graph.addLink('a', 'b');
    graph.addLink('e', 'b');
    graph.addLink('a', 'c');
    graph.addLink('c', 'd');
    graph.addLink('d', 'e');

    const pathFinder = aGreedy(graph, { oriented: true });
    const path = pathFinder.find('a', 'e');

    expectPath(path, ['e', 'd', 'c', 'a']);
  });

  it('leverages heuristics when provided', () => {
    const graph = createGraph();

    graph.addNode('NYC', { x: 0, y: 0 });
    graph.addNode('Boston', { x: 1, y: 1 });
    graph.addNode('Philadelphia', { x: -1, y: -1 });
    graph.addNode('Washington', { x: -2, y: -2 });

    graph.addLink('NYC', 'Boston');
    graph.addLink('NYC', 'Philadelphia');
    graph.addLink('Philadelphia', 'Washington');

    const pathFinder = aStar(graph, {
      distance(fromNode, toNode) {
        return euclid(fromNode.data, toNode.data);
      },
      heuristic(fromNode, toNode) {
        return euclid(fromNode.data, toNode.data);
      },
    });

    const path = pathFinder.find('NYC', 'Washington');
    expectPath(path, ['Washington', 'Philadelphia', 'NYC']);
  });

  it('works with default config', () => {
    const graph = makeDiamondGraph();

    const greedy = aGreedy(graph);
    const shortest = aStar(graph);
    expectPath(shortest.find('a', 'c'), ['c', 'b', 'a']);

    const nodes = new Set(greedy.find('a', 'c').map((node) => node.id));
    expect(nodes.has('c')).toBe(true);
    expect(nodes.has('b')).toBe(true);
    expect(nodes.has('a')).toBe(true);
  });

  it('supports custom heuristic utilities', () => {
    const graph = makeDiamondGraph();

    graph.getNode('a').data = { x: 0, y: 0 };
    graph.getNode('b').data = { x: 2, y: 0 };
    graph.getNode('c').data = { x: 1, y: 1 };
    graph.getNode('d').data = { x: 2, y: 2 };

    const finder = aStar(graph, {
      heuristic(from, to) {
        return aStar.l2(from.data, to.data);
      },
      distance(from, to) {
        return aStar.l2(from.data, to.data);
      },
    });

    const path = finder.find('a', 'd');
    expect(path.length).toBe(3);
    expectPath(path, ['d', 'b', 'a']);
  });

  it('finds ASCII paths with Manhattan heuristic', () => {
    const testCases = [
      {
        name: 'smallWorld',
        grid: ['......', '..@@..', '...@..', '......'],
        queries: [
          {
            from: '1;1',
            to: '1;4',
            route: ['.####.', '.#@@#.', '...@..', '......'],
          },
          {
            from: '0;0',
            to: '1;4',
            route: ['#####.', '..@@#.', '...@..', '......'],
          },
          {
            from: '0;0',
            to: '3;1',
            route: ['##....', '.#@@..', '.#.@..', '.#....'],
          },
        ],
      },
      {
        name: 'bidirectional checker',
        grid: [
          '......',
          '......',
          '..@@@.',
          '......',
          '......',
          '......',
          '......',
          '......',
          '......',
          '......',
          '......',
          '......',
          '......',
          '......',
        ],
        queries: [
          {
            from: '12;1',
            to: '1;4',
            route: [
              '......',
              '.####.',
              '.#@@@.',
              '.#....',
              '.#....',
              '.#....',
              '.#....',
              '.#....',
              '.#....',
              '.#....',
              '.#....',
              '.#....',
              '.#....',
              '......',
            ],
          },
        ],
      },
    ];

    testCases.forEach((testCase) => {
      const graph = graphFromTextArray(testCase.grid);
      testCase.queries.forEach((query) => {
        const finder = aStar(graph, manhattanFromData());
        const foundRoute = finder.find(query.from, query.to).map(toPos);
        const grid = graphToTextGrid(graph);
        grid.drawPath(foundRoute);

        expect(grid.toString()).toBe(query.route.join('\n'));
      });
    });
  });
});

function expectPath(path, expectedIds) {
  expect(path.map((node) => node.id)).toEqual(expectedIds);
}

function euclid(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function toPos(node) {
  return node.data;
}

function manhattanFromData() {
  return {
    heuristic: distance,
    distance,
  };

  function distance(from, to) {
    return aStar.l1(from.data, to.data);
  }
}

function makeDiamondGraph() {
  const graph = createGraph();
  graph.addLink('a', 'b');
  graph.addLink('b', 'c');
  graph.addLink('b', 'd');
  graph.addLink('c', 'd');
  return graph;
}
