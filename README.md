# ngraph.path

Path finding in a graph

# usage

## Basic usage

This is a basic example, which finds a path between arbitrary
two nodes in arbitrary graph

``` js
let path = require('ngraph.path');
let pathFinder = path.aStar(graph);

// now we can find a path between two nodes:
let fromNodeId = 40;
let toNodeId = 42;
let foundPath = pathFinder.find(fromNodeId, toNodeId);
// foundPath is array of nodes in the graph
```

Example above works for any graph, and it's equivalent to unweighted [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm).

## Weighted graph

Let's say we have the following graph:

``` js
let createGraph = require('ngraph.graph');
let graph = createGraph();

graph.addLink('a', 'b', {weight: 10});
graph.addLink('a', 'c', {weight: 10});
graph.addLink('c', 'd', {weight: 5});
graph.addLink('b', 'd', {weight: 10});
```

![weighted](https://raw.githubusercontent.com/anvaka/ngraph.path/master/doc/weighted.svg)


# license

MIT
