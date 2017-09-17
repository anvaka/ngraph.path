module.exports = nba;

var NodeHeap = require('./NodeHeap');
//var NodeSearchState = require('./NodeSearchState');
var heuristics = require('./heuristics');
var defaultSettings = require('./defaultSettings.js');

var NodeSearchState = function NodeSearchState(node) {
  this.node = node;

  // How we came to this node?
  this.p1 = null;
  this.p2 = null;

  this.inMiddle = true;

  this.g1 = Number.POSITIVE_INFINITY;
  this.g2 = Number.POSITIVE_INFINITY;
  // the f(n) = g(n) + h(n) value
  this.f1 = Number.POSITIVE_INFINITY;
  this.f2 = Number.POSITIVE_INFINITY;

  // used to reconstruct heap when fScore is updated.
  this.h1 = -1;
  this.h2 = -1;
};

var NO_PATH = defaultSettings.NO_PATH;

Object.assign(module.exports, heuristics);

function nba(graph, options) {
  options = options || {};
  // whether traversal should be considered over oriented graph.
  var oriented = options.oriented;

  var heuristic = options.heuristic;
  if (!heuristic) heuristic = defaultSettings.heuristic;

  var distance = options.distance;
  if (!distance) distance = defaultSettings.distance;

  return {
    /**
     * Finds a path between node `fromId` and `toId`.
     * @returns {Array} of nodes between `toId` and `fromId`. Empty array is returned
     * if no path is found.
     */
    find: find
  };

  function find(fromId, toId) {
    var from = graph.getNode(fromId);
    if (!from) throw new Error('fromId is not defined in this graph: ' + fromId);
    var to = graph.getNode(toId);
    if (!to) throw new Error('toId is not defined in this graph: ' + toId);

    // Maps nodeId to NodeSearchState.
    var nodeState = new Map();

    // the nodes that we still need to evaluate
    var open1Set = new NodeHeap({
      compare(a, b) { return a.f1 - b.f1; },
      setNodeId(node, heapIndex) { node.h1 = heapIndex }
    });
    var open2Set = new NodeHeap({
      compare(a, b) { return a.f2 - b.f2; },
      setNodeId(node, heapIndex) { node.h2 = heapIndex }
    });

    var lMin = Number.POSITIVE_INFINITY;

    var startNode = new NodeSearchState(from);
    nodeState.set(fromId, startNode); 
    startNode.g1 = 0;
    var f1 = heuristic(from, to);
    startNode.f1 = f1;
    open1Set.push(startNode);

    var endNode = new NodeSearchState(to);
    nodeState.set(toId, endNode);
    endNode.g2 = 0;
    var f2 = heuristic(to, from);
    endNode.f2 = f2;
    open2Set.push(endNode)

    var finished = false;
    var cameFrom;
    while (!finished) {
      // u0 = arg min{g(v) + h(v) | v ∈ M};
      // M = M − {u0};

      cameFrom = open1Set.pop();
      if (cameFrom.inMiddle) {
        cameFrom.inMiddle = false;

        if (cameFrom.f1 < lMin && (cameFrom.g1 + f2 - heuristic(from, cameFrom.node))) {
          graph.forEachLinkedNode(cameFrom.node.id, visitN1, options.oriented) // todo - needs to reverse correctly
        }
      }

      if (open1Set.length > 0) {
        f1 = open1Set.peek().f1;
      } else {
        finished = true;
      }
    }

    // If we got here, then there is no path.
    var path = reconstructPath(endNode);
    return path;

    function visitN1(otherNode, link) {
      var otherSearchState = nodeState.get(otherNode.id);
      if (!otherSearchState) {
        otherSearchState = new NodeSearchState(otherNode);
        nodeState.set(otherNode.id, otherSearchState);
      }

      if (!otherSearchState.inMiddle) return;

      var tentativeDistance = cameFrom.g1 + distance(cameFrom.node, otherNode, link);

      if (tentativeDistance < otherSearchState.g1) {
        otherSearchState.g1 = tentativeDistance;
        otherSearchState.f1 = tentativeDistance + heuristic(otherSearchState.node, to);
        otherSearchState.p1 = cameFrom;
        if (otherSearchState.h1 < 0) {
          open1Set.push(otherSearchState);
        } else {
          open1Set.updateItem(otherSearchState.h1);
        }
      }
      var potentialMin = otherSearchState.g1 + otherSearchState.g2;
      if (potentialMin < lMin) { lMin = potentialMin }
    }
  }
}

function reconstructPath(searchState) {
  var path = [searchState.node];
  var parent = searchState.p1;

  while (parent) {
    path.push(parent.node);
    parent = parent.p1;
  }

  return path;
}