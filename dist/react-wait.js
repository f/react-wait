function t(t) {
  return t && "object" == typeof t && "default" in t ? t.default : t;
}
var n = require("react"),
  e = t(n),
  r = t(require("hoist-non-react-statics")),
  i = n.createContext();
function a(t) {
  return n.useContext(i).waiters.includes(t.on) ? t.fallback : t.children;
}
function u() {
  var t = n.useContext(i);
  return Object.assign({}, t, { Wait: a });
}
function o(t) {
  var r = n.useContext(i),
    u = r.isWaiting,
    o = r.startWaiting,
    c = r.endWaiting;
  return {
    isWaiting: function() {
      return u(t);
    },
    startWaiting: function() {
      return o(t);
    },
    endWaiting: function() {
      return c(t);
    },
    Wait: function(n) {
      return e.createElement(a, Object.assign({}, { on: t }, n));
    }
  };
}
var c = function(t) {
    return t.length > 0;
  },
  f = function(t, n) {
    return t.includes(n);
  },
  s = function(t, n) {
    return f(t, n) ? t : t.concat([n]);
  },
  d = function(t, n) {
    return t.filter(function(t) {
      return t !== n;
    });
  };
(exports.useWait = u),
  (exports.Waiter = function(t) {
    var r = n.useState([]),
      a = r[0],
      u = r[1];
    return e.createElement(
      i.Provider,
      {
        value: {
          waiters: a,
          createWaitingContext: o,
          anyWaiting: function() {
            return c(a);
          },
          isWaiting: function(t) {
            return f(a, t);
          },
          startWaiting: function(t) {
            u(s(a, t));
          },
          endWaiting: function(t) {
            u(d(a, t));
          }
        }
      },
      t.children
    );
  }),
  (exports.injectWaiting = function(t, n) {
    void 0 === n && (n = {});
    var a = n.forwardRef;
    void 0 === a && (a = !1);
    var o = n.propName;
    void 0 === o && (o = "waiting");
    var c,
      f = function(n) {
        var r = u().Wait;
        return e.createElement(i.Consumer, null, function(i) {
          var u;
          return (
            (i.Wait = r),
            e.createElement(
              t,
              Object.assign({}, n, (((u = {})[o] = i), u), {
                ref: a ? n.forwardedRef : null
              })
            )
          );
        });
      };
    return (
      (f.displayName =
        "WithWaiting(" + ((c = t).displayName || c.name || "Component") + ")"),
      (f.WrappedComponent = t),
      r(
        a
          ? e.forwardRef(function(t, n) {
              return e.createElement(
                f,
                Object.assign({}, t, { forwardedRef: n })
              );
            })
          : f,
        t
      )
    );
  });
//# sourceMappingURL=react-wait.js.map
