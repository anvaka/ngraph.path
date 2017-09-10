class NodeSearchState {
  constructor(node) {
    this.node = node;

    // How we came to this node?
    this.parent = null;

    this.closed = false;
    this.open = 0;

    this.distanceToSource = Number.POSITIVE_INFINITY;
    // the f(n) = g(n) + h(n) value
    this.fScore = Number.POSITIVE_INFINITY;

    // used to reconstruct heap when fScore is updated.
    this.heapIndex = -1;
  }
}

module.exports = NodeSearchState;