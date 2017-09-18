var test = require('tap').test;
var aStar = require('../').aStar;
var aGreedy = require('../').aGreedy;
var createGraph = require('ngraph.graph');
var fromDot = require('ngraph.fromdot');
var asciiUtils = require('./utils/graphFromAscii');

test('it can find weighted', t => {
  let graph = createGraph();

  graph.addLink('a', 'b', {weight: 10});
  graph.addLink('a', 'c', {weight: 10});
  graph.addLink('c', 'd', {weight: 5});
  graph.addLink('b', 'd', {weight: 10});


  var pathFinder = aStar(graph, {
    distance(a, b, link) {
      return link.data.weight;
    }
  });
  let path = pathFinder.find('a', 'd');

  t.equals(path[0].id, 'd', 'd is here');
  t.equals(path[1].id, 'c', 'c is here');
  t.equals(path[2].id, 'a', 'a is here');
  t.end();
});

test('A* can find directed path', t => {
  let graph = createGraph();

  // We want to find a path from a to e. 
  // a -> b <- e
  //  \       /
  //   c -> d
  // In undirected graph the `a, b, e` will be the solution.
  // In directed graph it sohuld be `a c d e`
  graph.addLink('a', 'b');
  graph.addLink('e', 'b');

  graph.addLink('a', 'c');
  graph.addLink('c', 'd');
  graph.addLink('d', 'e');


  var pathFinder = aStar(graph, {
    oriented: true
  });
  let path = pathFinder.find('a', 'e');

  t.equals(path[0].id, 'e', 'e is here');
  t.equals(path[1].id, 'd', 'd is here');
  t.equals(path[2].id, 'c', 'c is here');
  t.equals(path[3].id, 'a', 'a is here');
  t.end();
});

test('A* greedy can find directed path', t => {
  let graph = createGraph();

  // We want to find a path from a to e. 
  // a -> b <- e
  //  \       /
  //   c -> d
  // In undirected graph the `a, b, e` will be the solution.
  // In directed graph it sohuld be `a c d e`
  graph.addLink('a', 'b');
  graph.addLink('e', 'b');

  graph.addLink('a', 'c');
  graph.addLink('c', 'd');
  graph.addLink('d', 'e');

  var pathFinder = aGreedy(graph, {
    oriented: true
  });
  let path = pathFinder.find('a', 'e');

  t.equals(path[0].id, 'e', 'e is here');
  t.equals(path[1].id, 'd', 'd is here');
  t.equals(path[2].id, 'c', 'c is here');
  t.equals(path[3].id, 'a', 'a is here');
  t.end();
});


test('it can use heuristic', t => {
  let createGraph = require('ngraph.graph');
  let graph = createGraph();

  // Our graph has cities:
  graph.addNode('NYC', {x: 0, y: 0});
  graph.addNode('Boston', {x: 1, y: 1});
  graph.addNode('Philadelphia', {x: -1, y: -1});
  graph.addNode('Washington', {x: -2, y: -2});

  // and railroads:
  graph.addLink('NYC', 'Boston');
  graph.addLink('NYC', 'Philadelphia');
  graph.addLink('Philadelphia', 'Washington');

  var pathFinder = aStar(graph, {
    distance(fromNode, toNode) {
      // In this case we have coordinates. Lets use them as
      // distance between two nodes:
      let dx = fromNode.data.x - toNode.data.x;
      let dy = fromNode.data.y - toNode.data.y;

      return Math.sqrt(dx * dx + dy * dy);
    },
    heuristic(fromNode, toNode) {
      // this is where we "guess" distance between two nodes.
      // In this particular case our guess is the same as our distance
      // function:
      let dx = fromNode.data.x - toNode.data.x;
      let dy = fromNode.data.y - toNode.data.y;

      return Math.sqrt(dx * dx + dy * dy);
    }
  });
  let path = pathFinder.find('NYC', 'Washington');

  t.equals(path[0].id, 'Washington', 'Washington is here');
  t.equals(path[1].id, 'Philadelphia', 'Philadelphia is here');
  t.equals(path[2].id, 'NYC', 'NYC is here');
  t.end();
})

test('it can find path without any config', t => {
  var graph = fromDot(`digraph G {
    a -> b
    b -> c
    b -> d
    c -> d
  }`);

  var pathFinder = aStar(graph);
  let path = pathFinder.find('a', 'c');
  t.equals(path[0].id, 'c', 'c is here');
  t.equals(path[1].id, 'b', 'b is here');
  t.equals(path[2].id, 'a', 'a is here');

  var pathFinderBi = aGreedy(graph);
  let foundNodes = new Set();
  pathFinderBi.find('a', 'c').forEach(n => foundNodes.add(n.id));

  t.ok(foundNodes.has('c'), 'c is here');
  t.ok(foundNodes.has('b'), 'b is here');
  t.ok(foundNodes.has('a'), 'a is here');

  t.end();
})

test('it can find paths', (t) => {
  var graph = fromDot(`digraph G {
    a -> b
    b -> c
    b -> d
    c -> d
  }`);
  
  graph.getNode('a').data = { x: 0, y: 0 };
  graph.getNode('b').data = { x: 2, y: 0 };  graph.getNode('c').data = { x: 1, y: 1 }
  graph.getNode('d').data = { x: 2, y: 2 }

  var pathFind = aStar(graph, {
    heuristic(from, to) {
      var fromPos = from.data;
      var toPos = to.data;

      return aStar.l2(fromPos, toPos);
    },
    distance(from, to) {
      var fromPos = from.data;
      var toPos = to.data;

      return aStar.l2(fromPos, toPos);
    }
  });

  var path = pathFind.find('a', 'd')
  t.equals(path.length, 3, 'Three nodes in path')
  t.equals(path[0].id, 'd', 'd is here')
  t.equals(path[1].id, 'b', 'b is here')
  t.equals(path[2].id, 'a', 'a is here')

  t.end();
});

test('it finds path on simple graph', (t) => {
  var testCases = [{
    name: 'smallWorld',
    grid: [
      '......',
      '..@@..',
      '...@..',
      '......',
    ],
    queries: [{
      from: '1;1', to: '1;4',
      route: [
        '.####.',
        '.#@@#.',
        '...@..',
        '......',
      ]
    }, {
      from: '0;0', to: '1;4',
      route: [
        '#####.',
        '..@@#.',
        '...@..',
        '......',
      ]
    }, {
      from: '0;0', to: '3;1',
      route: [
        '##....',
        '.#@@..',
        '.#.@..',
        '.#....',
      ]
    }]
  }, {
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
    ], queries: [{
      from: '12;1', to: '1;4', 
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
      ]
    }]
  }]

  testCases.forEach(testCase => {
    var graph = asciiUtils.graphFromTextArray(testCase.grid);
    testCase.queries.forEach(query => {
      var expected = query.route.join('\n')
      var path = aStar(graph, manhattanFromData());
      var foundRoute = path.find(query.from, query.to).map(toPos);
      var grid = asciiUtils.graphToTextGrid(graph);
      grid.drawPath(foundRoute);

      t.equals(grid.toString(), expected, testCase.name + '. path found from ' + query.from + ' to ' + query.to);
    })
  })

  t.end();
})

function toPos(p) {
  return p.data;
}

function manhattanFromData() {
  return {
    heuristic: distance,
    distance: distance
  };

  function distance(from, to) {
    var fromPos = from.data;
    var toPos = to.data;

    return aStar.l1(fromPos, toPos);
  }
}
