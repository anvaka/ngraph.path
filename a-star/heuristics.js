module.exports = {
  l2: l2,
  l1: l1
};
/**
 * Distance squared;
 * 
 * @param {*} a 
 * @param {*} b 
 */
function l3(a, b) {
  var dx = Math.abs(a.x - b.x);
  var dy = Math.abs(a.y - b.y);
  return Math.pow((dx  + dy), 2);
}

/**
 * Euclid distance (l2 norm);
 * 
 * @param {*} a 
 * @param {*} b 
 */
function l2(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Manhattan distance (l1 norm);
 * @param {*} a 
 * @param {*} b 
 */
function l1(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.abs(dx) + Math.abs(dy);
}
