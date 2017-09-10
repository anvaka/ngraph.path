module.exports = reconstructPath;

function reconstructPath(searchState) {
  let path = [searchState.node];
  let parent = searchState.parent;

  while (parent) {
    path.push(parent.node);
    parent = parent.parent;
  }

  return path;
}
