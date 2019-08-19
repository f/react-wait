import n, { createContext as t, useContext as r, useState as e } from "react";
import i from "hoist-non-react-statics";
var a = t();
function o(n) {
  return r(a).waiters.includes(n.on) ? n.fallback : n.children;
}
function u() {
  var n = r(a);
  return Object.assign({}, n, { Wait: o });
}
function c(t) {
  var e = r(a),
    i = e.isWaiting,
    u = e.startWaiting,
    c = e.endWaiting;
  return {
    isWaiting: function() {
      return i(t);
    },
    startWaiting: function() {
      return u(t);
    },
    endWaiting: function() {
      return c(t);
    },
    Wait: function(r) {
      return n.createElement(o, Object.assign({}, { on: t }, r));
    }
  };
}
var f = function(n) {
    return n.length > 0;
  },
  s = function(n, t) {
    return n.includes(t);
  },
  d = function(n, t) {
    return s(n, t) ? n : n.concat([t]);
  },
  l = function(n, t) {
    return n.filter(function(n) {
      return n !== t;
    });
  };
function g(t) {
  var r = e([]),
    i = r[0],
    o = r[1];
  return n.createElement(
    a.Provider,
    {
      value: {
        waiters: i,
        createWaitingContext: c,
        anyWaiting: function() {
          return f(i);
        },
        isWaiting: function(n) {
          return s(i, n);
        },
        startWaiting: function(n) {
          o(d(i, n));
        },
        endWaiting: function(n) {
          o(l(i, n));
        }
      }
    },
    t.children
  );
}
function W(t, r) {
  void 0 === r && (r = {});
  var e = r.forwardRef;
  void 0 === e && (e = !1);
  var o = r.propName;
  void 0 === o && (o = "waiting");
  var c,
    f = function(r) {
      var i = u().Wait;
      return n.createElement(a.Consumer, null, function(a) {
        var u;
        return (
          (a.Wait = i),
          n.createElement(
            t,
            Object.assign({}, r, (((u = {})[o] = a), u), {
              ref: e ? r.forwardedRef : null
            })
          )
        );
      });
    };
  return (
    (f.displayName =
      "WithWaiting(" + ((c = t).displayName || c.name || "Component") + ")"),
    (f.WrappedComponent = t),
    i(
      e
        ? n.forwardRef(function(t, r) {
            return n.createElement(
              f,
              Object.assign({}, t, { forwardedRef: r })
            );
          })
        : f,
      t
    )
  );
}
export { u as useWait, g as Waiter, W as injectWaiting };
//# sourceMappingURL=react-wait.esm.js.map
