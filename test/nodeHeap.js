var test = require('tap').test;
var NodeHeap = require('../a-star/NodeHeap');

test('it can add items', (t) => {
  var q = new NodeHeap();
  q.push(3);
  q.push(1);
  q.push(5);
  var last = Number.NEGATIVE_INFINITY;
  while(q.length) {
    var current = q.pop();
    t.ok(last <= current, 'Elements ordered: ' + current + ' > ' + last);
    last = current;
  }
  t.end();
})

test('it can have custom comparer', (t) => {
  var q = new NodeHeap({
    compare: (a, b) => {
      return b - a;
    }
  });
  q.push(3);
  q.push(1);
  q.push(5);
  var last = Number.POSITIVE_INFINITY;
  while(q.length) {
    var current = q.pop();
    t.ok(current <= last, 'Elements ordered: ' + current + ' < ' + last);
    last = current;
  }
  t.end();
});

test('it can be initialized with array', (t) => {
  var input = [3, 1, 5];

  new NodeHeap(input);

  for (var i = 1; i < input.length; ++i) {
    var current = input[i];
    var last = input[i - 1];
    t.ok(last <= current, 'Elements ordered: ' + last + ' < ' + current);
  }
  t.end();
})

test('it can track node id', (t) => {
  var nodes = [{v: 10}];
  new NodeHeap(nodes, {
    setNodeId(node, id) {
      node.id = id;
    }
  })
  t.equals(nodes[0].id, 0, 'id is set');
  t.end();
});

test('it initializes ids for multiple nodes', (t) => {
  var nodes = [];
  for (var i = 0; i < 13; ++i) {
    nodes.push({
      v: Math.random() * 100
    });
  }
  debugger;
  var heap = new NodeHeap(nodes, {
    compare(a, b) {
      return a.v - b.v;
    },
    setNodeId(node, id) {
      node.id = id;
    }
  });

  for (var i = 0; i < nodes.length; ++i) {
    var current = nodes[i];
    t.equals(current.id, i, 'id is initialized correctly');
  }
  var prev = {v: Number.NEGATIVE_INFINITY};
  while (heap.length) {
    var current = heap.pop();
    t.ok(prev.v <= current.v, 'Sort is preserved ' + current.v + ' ' + prev.v);
    prev = current;
  }

  t.end();
});

test('it updates ids when popped', (t) => {
  var nodes = [{v: 10}, {v: 5}];
  var heap = new NodeHeap(nodes, {
    compare(a, b) {
      return a.v - b.v;
    },
    setNodeId(node, id) {
      node.id = id;
    }
  });

  var popped = heap.pop();
  t.equals(popped.id, 0, 'Popped from the top');
  t.equals(heap.peek().id, 0, 'Element at the top of the heap has updated its id');

  t.end();
});

test('it can update node values', (t) => {
  var nodes = [{v: 10}, {v: 5}, {v: 14}];
  var heap = new NodeHeap(nodes, {
    compare(a, b) {
      return a.v - b.v;
    },
    setNodeId(node, id) {
      node.id = id;
    }
  });

  // we update our sort key. Let's ask heap to rebuild index for this node
  var lastItem = nodes[2];
  lastItem.v = 1;

  heap.updateItem(lastItem.id);
  
  t.equals(heap.peek().v, 1, 'First element was updated');
  t.equals(heap.length, 3, 'Length is preserved')

  var prev = {v: Number.NEGATIVE_INFINITY};
  while (heap.length) {
    var current = heap.pop();
    t.ok(prev.v <= current.v, 'Sort is preserved ' + current.v + ' ' + prev.v);
    prev = current;
  }

  t.end();
})
