module.exports = makeNBASearchStatePool;

function makeNBASearchStatePool() {
  var currentInCache = 0;
  var nodeCache = [];

  return {
    createNewState: createNewState,
    reset: reset
  };

  function reset() {
    currentInCache = 0;
  }

  function createNewState(node) {
    var cached = nodeCache[currentInCache];
    if (cached) {
      // TODO: This almost duplicates constructor code. Not sure if
      // it would impact performance if I move this code into a function
      cached.node = node;

      // How we came to this node?
      cached.p1 = null;
      cached.p2 = null;

      cached.closed = false;

      cached.g1 = Number.POSITIVE_INFINITY;
      cached.g2 = Number.POSITIVE_INFINITY;
      cached.f1 = Number.POSITIVE_INFINITY;
      cached.f2 = Number.POSITIVE_INFINITY;

      // used to reconstruct heap when fScore is updated.
      cached.h1 = -1;
      cached.h2 = -1;
    } else {
      cached = new NBASearchState(node);
      nodeCache[currentInCache] = cached;
    }
    currentInCache++;
    return cached;
  }
}

function NBASearchState(node) {
  this.node = node;

  // How we came to this node?
  this.p1 = null;
  this.p2 = null;

  this.closed = false;

  this.g1 = Number.POSITIVE_INFINITY;
  this.g2 = Number.POSITIVE_INFINITY;
  this.f1 = Number.POSITIVE_INFINITY;
  this.f2 = Number.POSITIVE_INFINITY;

  // used to reconstruct heap when fScore is updated.
  this.h1 = -1;
  this.h2 = -1;
}