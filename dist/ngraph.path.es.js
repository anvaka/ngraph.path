function y(e, t) {
  if (!new.target) return new y(e, t);
  if (Array.isArray(e) || (t = e, e = []), t = t || {}, this.data = e || [], this.length = this.data.length, this.compare = t.compare || Q, this.setNodeId = t.setNodeId || K, this.length > 0)
    for (var n = this.length >> 1; n >= 0; n--) this._down(n);
  if (t.setNodeId)
    for (var n = 0; n < this.length; ++n)
      this.setNodeId(this.data[n], n);
}
function K() {
}
function Q(e, t) {
  return e - t;
}
y.prototype = {
  push: function(e) {
    this.data.push(e), this.setNodeId(e, this.length), this.length++, this._up(this.length - 1);
  },
  pop: function() {
    if (this.length !== 0) {
      var e = this.data[0];
      return this.length--, this.length > 0 && (this.data[0] = this.data[this.length], this.setNodeId(this.data[0], 0), this._down(0)), this.data.pop(), e;
    }
  },
  peek: function() {
    return this.data[0];
  },
  updateItem: function(e) {
    this._down(e), this._up(e);
  },
  _up: function(e) {
    for (var t = this.data, n = this.compare, d = this.setNodeId, o = t[e]; e > 0; ) {
      var r = e - 1 >> 1, s = t[r];
      if (n(o, s) >= 0) break;
      t[e] = s, d(s, e), e = r;
    }
    t[e] = o, d(o, e);
  },
  _down: function(e) {
    for (var t = this.data, n = this.compare, d = this.length >> 1, o = t[e], r = this.setNodeId; e < d; ) {
      var s = (e << 1) + 1, T = s + 1, p = t[s];
      if (T < this.length && n(t[T], p) < 0 && (s = T, p = t[T]), n(p, o) >= 0) break;
      t[e] = p, r(p, e), e = s;
    }
    t[e] = o, r(o, e);
  }
};
function U(e) {
  this.node = e, this.parent = null, this.closed = !1, this.open = 0, this.distanceToSource = Number.POSITIVE_INFINITY, this.fScore = Number.POSITIVE_INFINITY, this.heapIndex = -1;
}
function R() {
  var e = 0, t = [];
  return {
    createNewState: d,
    reset: n
  };
  function n() {
    e = 0;
  }
  function d(o) {
    var r = t[e];
    return r ? (r.node = o, r.parent = null, r.closed = !1, r.open = 0, r.distanceToSource = Number.POSITIVE_INFINITY, r.fScore = Number.POSITIVE_INFINITY, r.heapIndex = -1) : (r = new U(o), t[e] = r), e++, r;
  }
}
function $(e, t) {
  var n = e.x - t.x, d = e.y - t.y;
  return Math.sqrt(n * n + d * d);
}
function q(e, t) {
  var n = e.x - t.x, d = e.y - t.y;
  return Math.abs(n) + Math.abs(d);
}
const J = [];
typeof Object.freeze == "function" && Object.freeze(J);
const u = {
  // Path search settings
  heuristic: W,
  distance: X,
  blocked: Z,
  compareFScore: ee,
  NO_PATH: J,
  // heap settings
  setHeapIndex: te,
  // nba:
  setH1: ae,
  setH2: ie,
  compareF1Score: re,
  compareF2Score: ne
};
function W() {
  return 0;
}
function X() {
  return 1;
}
function Z() {
  return !1;
}
function ee(e, t) {
  var n = e.fScore - t.fScore;
  return n;
}
function te(e, t) {
  e.heapIndex = t;
}
function re(e, t) {
  return e.f1 - t.f1;
}
function ne(e, t) {
  return e.f2 - t.f2;
}
function ae(e, t) {
  e.h1 = t;
}
function ie(e, t) {
  e.h2 = t;
}
var oe = u.NO_PATH;
function j(e, t) {
  t = t || {};
  var n = t.oriented, d = t.blocked;
  d || (d = u.blocked);
  var o = t.heuristic;
  o || (o = u.heuristic);
  var r = t.distance;
  r || (r = u.distance);
  var s = R();
  return {
    /**
     * Finds a path between node `fromId` and `toId`.
     * @returns {Array} of nodes between `toId` and `fromId`. Empty array is returned
     * if no path is found.
     */
    find: T
  };
  function T(p, x) {
    var g = e.getNode(p);
    if (!g) throw new Error("fromId is not defined in this graph: " + p);
    var l = e.getNode(x);
    if (!l) throw new Error("toId is not defined in this graph: " + x);
    s.reset();
    var E = /* @__PURE__ */ new Map(), H = new y({
      compare: u.compareFScore,
      setNodeId: u.setHeapIndex
    }), m = s.createNewState(g);
    E.set(p, m), m.fScore = o(g, l), m.distanceToSource = 0, H.push(m), m.open = 1;
    for (var h; H.length > 0; ) {
      if (h = H.pop(), de(h, l)) return ce(h);
      h.closed = !0, e.forEachLinkedNode(h.node.id, S, n);
    }
    return oe;
    function S(v, O) {
      var c = E.get(v.id);
      if (c || (c = s.createNewState(v), E.set(v.id, c)), !c.closed && (c.open === 0 && (H.push(c), c.open = 1), !d(v, h.node, O))) {
        var _ = h.distanceToSource + r(v, h.node, O);
        _ >= c.distanceToSource || (c.parent = h, c.distanceToSource = _, c.fScore = _ + o(c.node, l), H.updateItem(c.heapIndex));
      }
    }
  }
}
j.l2 = $;
j.l1 = q;
function de(e, t) {
  return e.node === t;
}
function ce(e) {
  for (var t = [e.node], n = e.parent; n; )
    t.push(n.node), n = n.parent;
  return t;
}
var M = 1, L = 2, fe = u.NO_PATH;
function z(e, t) {
  t = t || {};
  var n = t.oriented, d = t.blocked;
  d || (d = u.blocked);
  var o = t.heuristic;
  o || (o = u.heuristic);
  var r = t.distance;
  r || (r = u.distance);
  var s = R();
  return {
    find: T
  };
  function T(p, x) {
    var g = e.getNode(p);
    if (!g) throw new Error("fromId is not defined in this graph: " + p);
    var l = e.getNode(x);
    if (!l) throw new Error("toId is not defined in this graph: " + x);
    if (g === l) return [g];
    s.reset();
    var E = n ? B : f, H = /* @__PURE__ */ new Map(), m = new y({
      compare: u.compareFScore,
      setNodeId: u.setHeapIndex
    }), h = new y({
      compare: u.compareFScore,
      setNodeId: u.setHeapIndex
    }), S = s.createNewState(g);
    H.set(p, S), S.fScore = o(g, l), S.distanceToSource = 0, m.push(S), S.open = M;
    var v = s.createNewState(l);
    v.fScore = o(l, g), v.distanceToSource = 0, h.push(v), v.open = L;
    for (var O = Number.POSITIVE_INFINITY, c, _, V = m, P = M; m.length > 0 && h.length > 0; ) {
      m.length < h.length ? (P = M, V = m) : (P = L, V = h);
      var b = V.pop();
      if (b.closed = !0, !(b.distanceToSource > O) && (e.forEachLinkedNode(b.node.id, E), c && _))
        return C(c, _);
    }
    return fe;
    function f(w, N) {
      return A(w, N, b);
    }
    function B(w, N) {
      if (P === M) {
        if (N.fromId === b.node.id) return A(w, N, b);
      } else if (P === L && N.toId === b.node.id)
        return A(w, N, b);
    }
    function D(w) {
      var N = w.open;
      return !!(N && N !== P);
    }
    function C(w, N) {
      for (var F = [], a = w; a; )
        F.push(a.node), a = a.parent;
      for (var I = N; I; )
        F.unshift(I.node), I = I.parent;
      return F;
    }
    function A(w, N, F) {
      var a = H.get(w.id);
      if (a || (a = s.createNewState(w), H.set(w.id, a)), !a.closed && !d(a.node, F.node, N)) {
        if (D(a)) {
          var I = a.distanceToSource + F.distanceToSource;
          I < O && (c = a, _ = F, O = I);
          return;
        }
        var i = F.distanceToSource + r(a.node, F.node, N);
        if (!(i >= a.distanceToSource)) {
          var Y = P === M ? l : g, k = i + o(a.node, Y);
          k >= O || (a.fScore = k, a.open === 0 && (V.push(a), V.updateItem(a.heapIndex), a.open = P), a.parent = F, a.distanceToSource = i);
        }
      }
    }
  }
}
z.l2 = $;
z.l1 = q;
function se(e) {
  this.node = e, this.p1 = null, this.p2 = null, this.closed = !1, this.g1 = Number.POSITIVE_INFINITY, this.g2 = Number.POSITIVE_INFINITY, this.f1 = Number.POSITIVE_INFINITY, this.f2 = Number.POSITIVE_INFINITY, this.h1 = -1, this.h2 = -1;
}
function ue() {
  var e = 0, t = [];
  return {
    /**
     * Creates a new NBASearchState instance
     */
    createNewState: d,
    /**
     * Marks all created instances available for recycling.
     */
    reset: n
  };
  function n() {
    e = 0;
  }
  function d(o) {
    var r = t[e];
    return r ? (r.node = o, r.p1 = null, r.p2 = null, r.closed = !1, r.g1 = Number.POSITIVE_INFINITY, r.g2 = Number.POSITIVE_INFINITY, r.f1 = Number.POSITIVE_INFINITY, r.f2 = Number.POSITIVE_INFINITY, r.h1 = -1, r.h2 = -1) : (r = new se(o), t[e] = r), e++, r;
  }
}
var he = u.NO_PATH;
function G(e, t) {
  t = t || {};
  var n = t.oriented, d = t.quitFast, o = t.blocked;
  o || (o = u.blocked);
  var r = t.heuristic;
  r || (r = u.heuristic);
  var s = t.distance;
  s || (s = u.distance);
  var T = ue();
  return {
    /**
     * Finds a path between node `fromId` and `toId`.
     * @returns {Array} of nodes between `toId` and `fromId`. Empty array is returned
     * if no path is found.
     */
    find: p
  };
  function p(x, g) {
    var l = e.getNode(x);
    if (!l) throw new Error("fromId is not defined in this graph: " + x);
    var E = e.getNode(g);
    if (!E) throw new Error("toId is not defined in this graph: " + g);
    T.reset();
    var H = n ? F : A, m = n ? N : w, h = /* @__PURE__ */ new Map(), S = new y({
      compare: u.compareF1Score,
      setNodeId: u.setH1
    }), v = new y({
      compare: u.compareF2Score,
      setNodeId: u.setH2
    }), O, c = Number.POSITIVE_INFINITY, _ = T.createNewState(l);
    h.set(x, _), _.g1 = 0;
    var V = r(l, E);
    _.f1 = V, S.push(_);
    var P = T.createNewState(E);
    h.set(g, P), P.g2 = 0;
    var b = V;
    P.f2 = b, v.push(P);
    for (var f; v.length && S.length && (S.length < v.length ? D() : C(), !(d && O)); )
      ;
    var B = ve(O);
    return B;
    function D() {
      f = S.pop(), !f.closed && (f.closed = !0, f.f1 < c && f.g1 + b - r(l, f.node) < c && e.forEachLinkedNode(f.node.id, H), S.length > 0 && (V = S.peek().f1));
    }
    function C() {
      f = v.pop(), !f.closed && (f.closed = !0, f.f2 < c && f.g2 + V - r(f.node, E) < c && e.forEachLinkedNode(f.node.id, m), v.length > 0 && (b = v.peek().f2));
    }
    function A(a, I) {
      var i = h.get(a.id);
      if (i || (i = T.createNewState(a), h.set(a.id, i)), !i.closed && !o(f.node, a, I)) {
        var Y = f.g1 + s(f.node, a, I);
        Y < i.g1 && (i.g1 = Y, i.f1 = Y + r(i.node, E), i.p1 = f, i.h1 < 0 ? S.push(i) : S.updateItem(i.h1));
        var k = i.g1 + i.g2;
        k < c && (c = k, O = i);
      }
    }
    function w(a, I) {
      var i = h.get(a.id);
      if (i || (i = T.createNewState(a), h.set(a.id, i)), !i.closed && !o(f.node, a, I)) {
        var Y = f.g2 + s(f.node, a, I);
        Y < i.g2 && (i.g2 = Y, i.f2 = Y + r(l, i.node), i.p2 = f, i.h2 < 0 ? v.push(i) : v.updateItem(i.h2));
        var k = i.g1 + i.g2;
        k < c && (c = k, O = i);
      }
    }
    function N(a, I) {
      if (I.toId === f.node.id) return w(a, I);
    }
    function F(a, I) {
      if (I.fromId === f.node.id) return A(a, I);
    }
  }
}
G.l2 = $;
G.l1 = q;
function ve(e) {
  if (!e) return he;
  for (var t = [e.node], n = e.p1; n; )
    t.push(n.node), n = n.p1;
  for (var d = e.p2; d; )
    t.unshift(d.node), d = d.p2;
  return t;
}
const Ie = {
  aStar: j,
  aGreedy: z,
  nba: G
};
export {
  z as aGreedy,
  j as aStar,
  Ie as default,
  G as nba
};
//# sourceMappingURL=ngraph.path.es.js.map
