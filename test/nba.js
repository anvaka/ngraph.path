var test = require('tap').test;
var nba = require('../').nba;
var createGraph = require('ngraph.graph');

test('it can find path', t => {
  let graph = createGraph();

  graph.addLink('a', 'b', {weight: 10});
  graph.addLink('a', 'c', {weight: 10});
  graph.addLink('c', 'd', {weight: 5});
  graph.addLink('b', 'd', {weight: 10});


  var pathFinder = nba(graph, {
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

test('it can find directed path', t => {
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


  var pathFinder = nba(graph, {
    oriented: true
  });
  let path = pathFinder.find('a', 'e');

  t.equals(path[0].id, 'e', 'e is here');
  t.equals(path[1].id, 'd', 'd is here');
  t.equals(path[2].id, 'c', 'c is here');
  t.equals(path[3].id, 'a', 'a is here');
  t.end();
});