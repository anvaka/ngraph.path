var createGraph = require('ngraph.graph');

var EMPTY_CELL = '.'
var WALL = '@'

module.exports = {
  graphFromTextArray, 
  graphToTextGrid,
  nodeId
};

function graphFromTextArray(lines) {
  var graph = createGraph({uniqueLinkIds: false});
  var cols = 0;
  var rows = lines.length;

  lines.forEach((line, row, lines) => {
    if (line.length > cols) cols = line.length;

    Array.from(line).forEach((symbol, col) => {
      if (symbol !== EMPTY_CELL) return;

      var id = nodeId(row, col);
      graph.addNode(id, { x: col, y: row })

      if (col > 0 && line[col - 1] !== WALL) {
        graph.addLink(id, nodeId(row, col - 1));
      }
      if (row === 0) return;
      var prevLine = lines[row - 1];

      if (prevLine.length <= col) return;

      if (prevLine[col] === EMPTY_CELL) {
        graph.addLink(id, nodeId(row - 1, col));
      }
    })
  })
  
  graph.cols = cols;
  graph.rows = rows;
  return graph;
}

function nodeId(row, col) {
  return row + ';' + col;
}

class TextGrid {
  constructor(rows, cols, fillSymbol = EMPTY_CELL) {
    this.rows = rows;
    this.cols = cols;
    this.fill(fillSymbol);
  }

  toString() {
    return this.grid.map(l => l.join('')).join('\n');
  }

  drawPath(path) {
    var grid = this;
    path.forEach(p => {
      grid.draw(p.x, p.y, '#');
    })
  }

  draw(x, y, symbol) {
    this.grid[y][x] = symbol;
  }

  fill(symbol) {
    var grid = [];
    for (var i = 0; i < this.rows; ++i) {
      var line = [];
      grid.push(line);
      for (var j = 0; j < this.cols; ++j) {
        line[j] = symbol;
      }
    }
    this.grid = grid;
  }
}

function graphToTextGrid(g) {
  var grid = new TextGrid(g.rows, g.cols, WALL);

  g.forEachNode(node => {
    grid.draw(node.data.x, node.data.y, EMPTY_CELL)
  })

  return grid;
}


// var graph = graphFromASII([
//   '....',
//   '..@.',
//   '....',
//   '....'].join('\n')
// )

// var grid = graphToASCII(graph);
// grid.drawPath([{
//   x: 0, y: 0
// }, {
//   x: 1, y: 1
// }])

// console.log(grid.toString());
